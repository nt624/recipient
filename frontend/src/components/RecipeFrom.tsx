import React, { useState } from 'react';
import IngredientList from './IngredientList.tsx';
// import { set } from 'astro:schema';

interface RecipeData {
  name: string;
  ingredients: string[];
}

export default function RecipeForm() {
  const [url, setUrl] = useState('');
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    if(!url) return;
    e.preventDefault();
    setLoading(true);

    try {
        const res = await fetch('http://localhost:3001/api/scrape', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Failed to fetch recipe');
        }
        setRecipe(data);
    } catch (error) {
        console.error('API Error:', error);
        alert('レシピの取得に失敗しました。URLを確認してください。');
    } finally {
        setLoading(false);
    }

  };

  return (
    <div className="bg-white shadow p-6 rounded-lg max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          レシピのURLを入力:
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-2"
          placeholder="https://example.com/recipe"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "読み込み中..." : "材料を取得する"}
        </button>
      </form>

      {recipe && (
        <>
          <h2 className="text-lg font-bold mb-2">{recipe.name}</h2>
          <IngredientList ingredients={recipe.ingredients} />
        </>
      )}
    </div>
  );
}
