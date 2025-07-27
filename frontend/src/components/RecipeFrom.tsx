import React, { useState } from 'react';
import IngredientList from './IngredientList.tsx';

interface RecipeData {
  name: string;
  ingredients: string[];
}

export default function RecipeForm() {
  const [url, setUrl] = useState('');
  const [recipe, setRecipe] = useState<RecipeData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 実際はAPIにPOSTするなどですが、ここではモックで代用
    const mockData: RecipeData = {
      name: 'トマトパスタ',
      ingredients: ['パスタ 200g', 'トマト缶 1缶', 'にんにく 1片', '塩', 'オリーブオイル'],
    };

    // 本当は以下のようにAPIを呼び出す
    // const res = await fetch(`${import.meta.env.PUBLIC_API_URL}/extract`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ url }),
    // });
    // const data = await res.json();

    setRecipe(mockData);
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
          材料を取得
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
