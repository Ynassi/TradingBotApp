import React, { useState } from "react";

export default function NewsListScored({ headlines = [] }) {
  const [showAll, setShowAll] = useState(false);

  const getColor = (label) => {
    if (label === "POSITIVE") return "bg-green-600";
    if (label === "NEGATIVE") return "bg-red-600";
    if (label === "NEUTRAL") return "bg-yellow-500";
    return "bg-gray-500";
  };

  const displayedNews = showAll ? headlines : headlines.slice(0, 3);

  return (
    <div className="mt-10 space-y-4">
      <h4 className="text-teal-400 font-semibold text-md mb-2">
        Articles analysés par l’IA
      </h4>

      {displayedNews.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-gray-700 px-4 py-2 rounded-xl shadow hover:bg-gray-600 transition"
        >
          {/* Titre cliquable */}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white hover:underline max-w-[85%] truncate"
          >
            {item.title}
          </a>

          {/* Label de sentiment */}
          <span
            className={`ml-4 text-xs text-white font-semibold px-2 py-1 rounded-full ${getColor(
              item.label
            )}`}
          >
            {item.label}
          </span>
        </div>
      ))}

      {/* Bouton Voir plus */}
      {headlines.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-sm text-teal-400 hover:underline"
        >
          {showAll ? "Réduire" : "Voir plus"}
        </button>
      )}
    </div>
  );
}
