import React from "react";

export default function SentimentOverviewCard({ sentiment }) {
  const {
    sentiment_score,
    label,
    positive_ratio,
    neutral_ratio,
    negative_ratio
  } = sentiment;

  const getLabelColor = (label) => {
    if (label === "POSITIVE") return "bg-green-600";
    if (label === "NEGATIVE") return "bg-red-600";
    if (label === "NEUTRAL") return "bg-yellow-500";
    return "bg-gray-500";
  };

  return (
    <div className="bg-gray-800 rounded-2xl px-6 py-8 text-white mx-4">
      <div className="flex flex-col sm:flex-row sm:justify-center sm:items-start sm:gap-32 gap-6">

        {/* Bloc Gauche = Score FinBERT + Ratios */}
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:items-start sm:text-left text-center">

          {/* Score FinBERT stylisé */}
          <div className="flex flex-col items-center justify-center rounded-full bg-blue-900 border border-white w-32 h-32 shadow-inner">
            <p className="text-sm text-teal-400 font-semibold">Score FinBERT</p>
            <p className="text-3xl font-bold text-white">
              {(sentiment_score * 100).toFixed(0)}%
            </p>
          </div>

          {/* Ratios */}
          <div className="text-sm space-y-2 text-sky-300 sm:text-left text-center">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              <span>Positives : {(positive_ratio * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
              <span>Neutres : {(neutral_ratio * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <span>Négatives : {(negative_ratio * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Bloc Droite = Classification IA */}
        <div className="flex flex-col items-center space-y-6">
          <p className="text-md font-semibold text-teal-400 text-center">
            Classification Mistral + FinBERT
          </p>
          <div className={`px-8 py-2.5 rounded-xl font-bold text-xl tracking-wide ${getLabelColor(label)}`}>
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
