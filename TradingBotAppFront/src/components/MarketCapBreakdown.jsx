import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const MarketCapBreakdown = ({ data }) => {
  const counts = {
    Small: 0,
    Mid: 0,
    Large: 0
  };

  data.forEach((item) => {
    const cap = item.MarketCap;
    if (typeof cap === "number") {
      if (cap < 2e9) counts.Small++;
      else if (cap < 1e10) counts.Mid++;
      else counts.Large++;
    }
  });

  const chartData = [
    { name: "Small Cap (<2B)", value: counts.Small },
    { name: "Mid Cap (2B-10B)", value: counts.Mid },
    { name: "Large Cap (>10B)", value: counts.Large }
  ];

  return (
    <div className="text-white w-full max-w-xl mx-auto">
      <h2 className="text-lg font-bold mb-2 text-center">Répartition par taille de capitalisation</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" stroke="#ccc" tick={{ fontSize: 11 }} />
          <YAxis stroke="#ccc" allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketCapBreakdown;