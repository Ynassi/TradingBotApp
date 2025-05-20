import React, { useState } from "react"

export default function SectorOverviewTable({ performance, volatility }) {
  const [sortKey, setSortKey] = useState("performance")
  const [sortOrder, setSortOrder] = useState("desc")

  if (!performance || !volatility) return null

  // Conversion en tableau [{ sector, performance, volatility }]
  const merged = Object.entries(performance).map(([sector, values]) => {
    return {
      sector,
      performance: values["1d"] ?? null,
      volatility: volatility[sector] ?? null,
    }
  })

  // Fonction de tri dynamique
  const sorted = [...merged].sort((a, b) => {
    const aVal = a[sortKey] ?? -Infinity
    const bVal = b[sortKey] ?? -Infinity
    return sortOrder === "asc" ? aVal - bVal : bVal - aVal
  })

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("desc")
    }
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-xl mb-8">
      <h2 className="text-xl font-semibold text-teal-400 mb-4 tracking-wide">
        Performances sectorielles du jour
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="border-b border-gray-700 text-gray-400">
            <tr>
              <th
                className="py-2 px-4 cursor-pointer hover:text-white"
                onClick={() => handleSort("sector")}
              >
                Secteur {sortKey === "sector" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="py-2 px-4 cursor-pointer hover:text-white"
                onClick={() => handleSort("performance")}
              >
                Performance 1j {sortKey === "performance" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="py-2 px-4 cursor-pointer hover:text-white"
                onClick={() => handleSort("volatility")}
              >
                Volatilité moyenne {sortKey === "volatility" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={row.sector}
                className="border-b border-gray-700 hover:bg-gray-700/30"
              >
                <td className="py-2 px-4">{row.sector}</td>
                <td className="py-2 px-4 text-green-400">
                  {row.performance !== null ? `${row.performance.toFixed(2)}%` : "N/A"}
                </td>
                <td className="py-2 px-4 text-yellow-300">
                  {row.volatility !== null ? row.volatility.toFixed(2) : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
