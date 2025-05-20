import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function SP500Chart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSP500() {
      try {
        const response = await fetch("/api/data/spy");
        const data = await response.json();

        if (!data.labels || !data.data) throw new Error("Invalid format");

        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: "SPY (S&P 500 ETF)",
              data: data.data,
              borderColor: "#4ade80",
              backgroundColor: "rgba(74, 222, 128, 0.2)",
              tension: 0.3,
              fill: true,
            },
          ],
        });
      } catch (err) {
        console.error("Erreur récupération SP500 :", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSP500();
  }, []);

  if (loading) return <p className="text-white p-4">Chargement du graphique SP500...</p>;
  if (!chartData) return <p className="text-red-500 p-4">Erreur de chargement du SP500</p>;

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-white text-sm font-semibold mb-4">S&P 500 (via SPY ETF)</h3>
      <Line data={chartData} />
    </div>
  );
}
