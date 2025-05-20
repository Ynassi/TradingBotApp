import React from 'react';
import { useParams } from 'react-router-dom';

export default function List() {
  const { type } = useParams();

  return (
    <div className="text-white p-8">
      <h1 className="text-2xl font-semibold mb-4">Liste : {type}</h1>
      <p>Affichage des entreprises correspondant à la catégorie "{type}".</p>
    </div>
  );
}
