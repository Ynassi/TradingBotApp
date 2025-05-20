import React, { useState } from "react";
import SP500Chart from "./SP500Chart";
import CAC40Chart from "./CAC40Chart";
import NikkeiChart from "./NikkeiChart";

const chartOptions = {
  sp500: {
    label: "S&P 500",
    component: <SP500Chart />,
  },
  cac40: {
    label: "CAC 40",
    component: <CAC40Chart />,
  },
  nikkei: {
    label: "Nikkei 225",
    component: <NikkeiChart />,
  },
};

export default function IndexesWrapper() {
  const [selectedChart, setSelectedChart] = useState("sp500");

  return (
    <div className="bg-gray-800 rounded-xl shadow-xl p-6 mb-8">
      <h2 className="text-xl font-semibold text-teal-400 mb-4 tracking-wide">
        Indices boursiers
      </h2>

      <div className="flex flex-wrap gap-3 mb-6">
        {Object.keys(chartOptions).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedChart(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedChart === key
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {chartOptions[key].label}
          </button>
        ))}
      </div>

      <div className="w-full">{chartOptions[selectedChart].component}</div>
    </div>
  );
}
