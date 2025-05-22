import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Filler,
  Legend,
  Title,
} from "chart.js";
import 'chartjs-adapter-date-fns';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Filler,
  Legend,
  Title
);

const ranges = {
  "6M": 180,
  "3M": 90,
  "1M": 30,
  "7J": 7,
};

export default function PriceHistoryChart({ data }) {
  const [selectedRange, setSelectedRange] = useState("6M");

  if (!data || data.length === 0) return null;

  const days = ranges[selectedRange];
  const filteredData = data.slice(-days);

  const chartData = {
    labels: filteredData.map(d => d.date),
    datasets: [
      {
        label: "Cours de clôture",
        data: filteredData.map(d => d.price),
        fill: true,
        borderColor: "#4ade80",
        backgroundColor: "rgba(74, 222, 128, 0.1)",
        pointRadius: 2,
        pointHoverRadius: 4,
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "PPP",
        },
        ticks: {
          color: "#cbd5e1"
        },
        grid: {
          color: "rgba(255,255,255,0.05)"
        }
      },
      y: {
        ticks: {
          color: "#cbd5e1"
        },
        grid: {
          color: "rgba(255,255,255,0.05)"
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => `Prix : ${ctx.parsed.y.toFixed(2)}`
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center gap-2 text-xs">
        {Object.keys(ranges).map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={`px-2 py-1 rounded ${
              selectedRange === range
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      <div style={{ height: "250px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
