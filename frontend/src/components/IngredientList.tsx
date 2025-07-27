import React from 'react';

interface Props {
  ingredients: string[];
}

export default function IngredientList({ ingredients }: Props) {
  return (
    <ul className="list-disc pl-6 text-gray-800">
      {ingredients.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
