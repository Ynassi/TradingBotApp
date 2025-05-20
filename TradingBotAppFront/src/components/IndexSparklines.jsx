import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { fetchOverviewData } from "../api/api";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler);

const chartColors = {
  "S&P500": "#4ade80",
  "CAC40": "#60a5fa",
  "Nikkei225": "#f472b6",
};

const labelMap = {
  "S&P500": "S&P 500",
  "CAC40": "CAC 40",
  "Nikkei225": "Nikkei 225",
};

export default function IndexesSparklinesWrapper() {
  const [sparklines, setSparklines] = useState(null);
  const [selected, setSelected] = useState("S&P500");

  useEffect(() => {
    fetchOverviewData().then((data) => {
      if (data.index_sparklines) {
        setSparklines(data.index_sparklines);
      }
    });
  }, []);

  if (
    !sparklines ||
    !sparklines[selected] ||
    !Array.isArray(sparklines[selected])
  )
    return null;

  const values = sparklines[selected];
  const labels = values.map((_, i) => "");

  const chartData = {
    labels,
    datasets: [
      {
        label: labelMap[selected],
        data: values,
        borderColor: chartColors[selected],
        backgroundColor: `${chartColors[selected]}33`,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        display: false, // ❌ supprime les ticks de l'axe X
        grid: { display: false },
      },
      y: {
        display: false, // ❌ supprime les ticks de l'axe Y
        grid: { display: false },
      },
    },
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-xl p-6 mb-8">
      <h2 className="text-xl font-semibold text-teal-400 mb-2 tracking-wide">
        Tendances horaires des indices
      </h2>
      <p className="text-xs text-gray-400 mb-4 italic">
        Données 5 derniers jours – 1h d’intervalle
      </p>
      <div className="flex gap-3 mb-4">
        {Object.keys(sparklines).map((key) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selected === key
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {labelMap[key]}
          </button>
        ))}
      </div>
      <div className="bg-gray-900 rounded-lg p-4">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
