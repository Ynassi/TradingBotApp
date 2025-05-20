import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";


export default function NikkeiChart() {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      async function fetchNikkei() {
        try {
          const response = await fetch("/api/data/ewj");
          const data = await response.json();
  
          if (!data.labels || !data.data) throw new Error("Invalid format");
  
          setChartData({
            labels: data.labels,
            datasets: [
              {
                label: "EWJ (Japan / Nikkei ETF)",
                data: data.data,
                borderColor: "#f472b6",
                backgroundColor: "rgba(244, 114, 182, 0.2)",
                tension: 0.3,
                fill: true,
              },
            ],
          });
        } catch (err) {
          console.error("Erreur récupération Nikkei :", err);
        } finally {
          setLoading(false);
        }
      }
  
      fetchNikkei();
    }, []);
  
    if (loading) return <p className="text-white p-4">Chargement du graphique Nikkei...</p>;
    if (!chartData) return <p className="text-red-500 p-4">Erreur de chargement du Nikkei 225</p>;
  
    return (
      <div className="bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-white text-sm font-semibold mb-4">Nikkei 225 (via EWJ ETF)</h3>
        <Line data={chartData} />
      </div>
    );
  }
  