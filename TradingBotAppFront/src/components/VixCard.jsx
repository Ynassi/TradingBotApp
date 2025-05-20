import React, { useState } from 'react';

export default function VixCard({ vixValue }) {
  const [showMore, setShowMore] = useState(false);

  const getColor = (vix) => {
    if (vix < 15) return 'text-green-400';
    if (vix < 25) return 'text-yellow-400';
    return 'text-red-500';
  };

  const getLabel = (vix) => {
    if (vix < 13) return 'Très faible volatilité';
    if (vix < 17) return 'Faible volatilité';
    if (vix < 25) return 'Modérée';
    if (vix < 35) return 'Élevée';
    return 'Très élevée';
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-xl p-6 mb-8">
      <h2 className="text-xl font-semibold text-teal-400 mb-4 tracking-wide">Indice VIX (Volatilité)</h2>

      <p className={`text-3xl font-bold ${getColor(vixValue)}`}>
        {vixValue} <span className="text-base text-gray-400">({getLabel(vixValue)})</span>
      </p>

      <p className="text-sm text-gray-400 mt-1">
        Plus l'indice est élevé, plus la volatilité attendue est forte.
      </p>

      {/* 🔽 Accordéon explicatif ici */}
      <button
        className="mt-2 text-sm text-teal-400 hover:underline"
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? "Masquer l'explication" : "En savoir plus"}
      </button>

      {showMore && (
        <p className="mt-2 text-sm text-gray-300">
          Le VIX mesure la volatilité implicite anticipée du S&P 500 sur les 30 prochains jours. 
          Il est souvent considéré comme un "indice de peur". Une valeur inférieure à 15 signifie des marchés calmes, 
          tandis qu’une valeur supérieure à 30 suggère un niveau élevé de stress ou d’incertitude.
        </p>
      )}
    </div>
  );
}
