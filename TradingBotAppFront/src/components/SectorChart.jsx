// components/SectorChart.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
  "#0ea5e9", // sky-500
  "#6366f1", // indigo-500
  "#06b6d4", // cyan-500
  "#3b82f6", // blue-500
  "#60a5fa", // blue-400
  "#818cf8", // indigo-400
  "#0f766e"  // teal-700
];

const normalizeSector = (raw) => {
  const map = {
    "technology": "technology",
    "information technology": "technology",
    "financial services": "financials",
    "financials": "financials",
    "health care": "healthcare",
    "healthcare": "healthcare",
    "consumer discretionary": "consumer discretionary",
    "consumer cyclical": "consumer discretionary",
    "consumer staples": "consumer staples",
    "consumer defensive": "consumer staples",
    "basic materials": "materials",
    "materials": "materials"
  };
  const cleaned = raw?.toLowerCase().trim();
  return map[cleaned] || raw;
};

const SectorChart = ({ data, type = "Sector" }) => {
  const key = type === "Index" ? "IndexSource" : "Sector";
  const counts = data.reduce((acc, item) => {
    const raw = item[key] || "Inconnu";
    const label = type === "Sector" ? normalizeSector(raw) : raw;
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(counts).map(([name, value]) => ({ name, value }));

  return (
    <div className="text-white w-full max-w-xl mx-auto">
      <h2 className="text-lg font-bold mb-2 text-center">Répartition par {type === "Index" ? "index" : "secteur"}</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name }) => name}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SectorChart;
