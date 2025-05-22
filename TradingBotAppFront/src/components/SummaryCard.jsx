import React, { useState } from "react";

export default function SummaryCard({ summary }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4 bg-gray-800 rounded-2xl shadow space-y-2">
      <h3 className="text-lg font-semibold text-white">🧠 Résumé stratégique (Mistral)</h3>
      <p className="text-sm text-gray-300 whitespace-pre-line">{summary}</p>
      <button
        onClick={() => setOpen(!open)}
        className="text-xs text-blue-400 underline"
      >
        {open ? "Masquer la méthode" : "Afficher la méthodologie"}
      </button>
      {open && (
        <p className="text-xs text-gray-400 mt-2">
          Ce résumé est généré automatiquement à partir des actualités récentes de l’entreprise, via le modèle de langage Mistral. Il identifie les faits saillants pertinents.
        </p>
      )}
    </div>
  );
}
