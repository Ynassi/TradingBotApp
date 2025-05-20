import React from 'react';

export default function SectorHeatmap({ data }) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-xl p-6 mb-8">
      <h2 className="text-xl font-semibold text-teal-400 mb-4 tracking-wide">Heatmap sectorielle</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Object.entries(data).map(([sectorName, change]) => (
          <div
            key={sectorName}
            className={`rounded-lg p-4 text-center cursor-pointer transition transform hover:scale-105 ${
              change > 0 ? 'bg-green-700' : change < 0 ? 'bg-red-700' : 'bg-yellow-600'
            }`}
          >
            <p className="text-sm font-bold text-white">{sectorName}</p>
            <p className="text-xs text-gray-200">{change.toFixed(2)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
