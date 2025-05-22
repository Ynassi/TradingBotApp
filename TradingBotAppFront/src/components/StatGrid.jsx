import React from "react";

export default function StatGrid({ data }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(data).map(([key, val]) => (
        <div key={key} className="bg-gray-900 rounded-xl p-4 shadow">
          <div className="text-xs text-gray-400 uppercase tracking-wider">{key}</div>
          <div className="text-lg font-bold text-white">
            {val !== null && val !== undefined
              ? val.toLocaleString(undefined, { maximumFractionDigits: 2 })
              : "—"}
          </div>
        </div>
      ))}
    </div>
  );
}
