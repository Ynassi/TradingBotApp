import React, { useState } from "react";

export default function CompanyFilterPanel({ onFilterChange }) {
  const [peMax, setPeMax] = useState(40);
  const [rsiMax, setRsiMax] = useState(100);
  const [roeMin, setRoeMin] = useState(0);
  const [betaMax, setBetaMax] = useState(3);
  const [sentimentLabel, setSentimentLabel] = useState("");
  const [selectedRecs, setSelectedRecs] = useState([]);

  const toggleRec = (rec) => {
    setSelectedRecs((prev) =>
      prev.includes(rec) ? prev.filter((r) => r !== rec) : [...prev, rec]
    );
  };

  const applyFilters = () => {
    onFilterChange({ peMax, rsiMax, roeMin, betaMax, sentimentLabel, selectedRecs });
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg space-y-6 w-full">
      {/* Filtres fondamentaux et techniques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-gray-300">PE Ratio maximum</label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={peMax}
            onChange={(e) => setPeMax(Number(e.target.value))}
            className="w-full accent-teal-400"
          />
          <div className="text-sm text-gray-400 mt-1">{peMax}</div>
        </div>

        <div>
          <label className="text-sm text-gray-300">RSI maximum</label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={rsiMax}
            onChange={(e) => setRsiMax(Number(e.target.value))}
            className="w-full accent-teal-400"
          />
          <div className="text-sm text-gray-400 mt-1">{rsiMax}</div>
        </div>

        <div>
          <label className="text-sm text-gray-300">ROE minimum</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={roeMin}
            onChange={(e) => setRoeMin(Number(e.target.value))}
            className="w-full accent-teal-400"
          />
          <div className="text-sm text-gray-400 mt-1">{roeMin}</div>
        </div>

        <div>
          <label className="text-sm text-gray-300">Beta maximum</label>
          <input
            type="range"
            min={0}
            max={3}
            step={0.1}
            value={betaMax}
            onChange={(e) => setBetaMax(Number(e.target.value))}
            className="w-full accent-teal-400"
          />
          <div className="text-sm text-gray-400 mt-1">{betaMax}</div>
        </div>
      </div>

      {/* Sentiment label */}
      <div className="flex justify-center gap-6">
        {"POSITIVE NEUTRAL NEGATIVE".split(" ").map((label) => (
          <button
            key={label}
            className={`px-3 py-1 rounded-full font-semibold text-sm transition hover:scale-105 ${
              sentimentLabel === label ? "bg-teal-400 text-white" : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setSentimentLabel(label === sentimentLabel ? "" : label)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Recommandation analystes */}
      <div className="flex flex-wrap gap-4 justify-center">
        {"STRONG_BUY BUY HOLD SELL".split(" ").map((rec) => (
          <button
            key={rec}
            className={`px-3 py-1 rounded-full font-semibold text-sm border transition duration-150 ease-in-out hover:scale-105 ${
              selectedRecs.includes(rec) ? "bg-teal-500 text-white" : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => toggleRec(rec)}
          >
            {rec}
          </button>
        ))}
      </div>

      {/* Bouton appliquer */}
      <div className="flex justify-center">
        <button
          onClick={applyFilters}
          className="mt-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-400 transition font-semibold"
        >
          Appliquer les filtres
        </button>
      </div>
    </div>
  );
}
