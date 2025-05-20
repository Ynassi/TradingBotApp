import React, { useState } from "react";

export default function SectorPerformanceTable({ data }) {
  const [sortKey, setSortKey] = useState("1d");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const sortedData = Object.entries(data).sort(([, a], [, b]) => {
    const aVal = a[sortKey] ?? 0;
    const bVal = b[sortKey] ?? 0;
    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
  });

  const headers = [
    { key: "1d", label: "1j" },
    { key: "1w", label: "1s" },
    { key: "1m", label: "1m" },
    { key: "YTD", label: "YTD" },
  ];

  return (
    <div className="bg-gray-800 rounded-xl shadow-xl p-6 mb-8 overflow-x-auto">
      <h2 className="text-xl font-semibold text-teal-400 mb-4 tracking-wide">
        Performances sectorielles historiques
      </h2>
      <table className="min-w-full text-sm text-left text-gray-300">
        <thead className="text-xs uppercase text-gray-400 border-b border-gray-700">
          <tr>
            <th className="px-4 py-2">Secteur</th>
            {headers.map(({ key, label }) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                className="px-4 py-2 cursor-pointer hover:text-white"
              >
                {label}
                {sortKey === key && (sortOrder === "asc" ? " ↑" : " ↓")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map(([sectorName, perf]) => (
            <tr key={sectorName} className="border-t border-gray-700 hover:bg-gray-700/30">
              <td className="px-4 py-2">{sectorName}</td>
              {headers.map(({ key }) => (
                <td key={key} className="px-4 py-2">
                  {perf[key] !== undefined ? `${perf[key].toFixed(2)}%` : "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
