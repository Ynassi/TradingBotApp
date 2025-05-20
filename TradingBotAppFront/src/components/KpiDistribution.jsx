// components/KpiDistribution.jsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const KpiDistribution = ({ data, metric, label }) => {
  const bins = Array(10).fill(0);

  // Définir une échelle max personnalisée
  let maxValue;
  if (metric === "PE") {
    maxValue = 200;
  } else if (metric === "ROE") {
    maxValue = 1;
  } else {
    maxValue = null;
  }

  const values = data.map((item) => item[metric]).filter((v) => typeof v === "number" && !isNaN(v));
  const actualMax = maxValue || Math.max(...values);

  // Remplir les bins
  data.forEach((item) => {
    const value = item[metric];
    if (typeof value === "number" && !isNaN(value)) {
      const adjusted = Math.min(value, actualMax);
      const index = Math.min(Math.floor((adjusted / actualMax) * 10), 9);
      bins[index]++;
    }
  });

  const chartData = bins.map((count, index) => ({
    range: `${(index * actualMax / 10).toFixed(1)}-${((index + 1) * actualMax / 10).toFixed(1)}`,
    count
  }));

  const outliers = data
    .filter((item) => {
      const v = item[metric];
      return typeof v === "number" && !isNaN(v) && v > actualMax;
    })
    .sort((a, b) => b[metric] - a[metric]); // Limiter à 5 par défaut

  return (
    <div className="text-white w-full max-w-xl mx-auto">
      <h2 className="text-lg font-bold mb-2 text-center">Distribution de {label}</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <XAxis dataKey="range" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Bar dataKey="count" fill="#14b8a6" />
        </BarChart>
      </ResponsiveContainer>
      {outliers.length > 0 && (
        <details className="mt-4 ml-10 text-sm text-gray-300">
          <summary className="cursor-pointer font-semibold text-teal-400">Outliers </summary>
          <ul className="list-disc list-inside space-y-1 mt-2">
            {outliers.map((item, idx) => (
              <li key={idx}>{item.Company} – {label}: {item[metric]}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
};

export default KpiDistribution;
