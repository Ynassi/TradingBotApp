import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";


export default function CAC40Chart() {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      async function fetchCAC40() {
        try {
          const response = await fetch("/api/data/ewq");
          const data = await response.json();
  
          if (!data.labels || !data.data) throw new Error("Invalid format");
  
          setChartData({
            labels: data.labels,
            datasets: [
              {
                label: "EWQ (France / CAC 40 ETF)",
                data: data.data,
                borderColor: "#60a5fa",
                backgroundColor: "rgba(96, 165, 250, 0.2)",
                tension: 0.3,
                fill: true,
              },
            ],
          });
        } catch (err) {
          console.error("Erreur récupération CAC40 :", err);
        } finally {
          setLoading(false);
        }
      }
  
      fetchCAC40();
    }, []);
  
    if (loading) return <p className="text-white p-4">Chargement du graphique CAC 40...</p>;
    if (!chartData) return <p className="text-red-500 p-4">Erreur de chargement du CAC 40</p>;
  
    return (
      <div className="bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-white text-sm font-semibold mb-4">CAC 40 (via EWQ ETF)</h3>
        <Line data={chartData} />
      </div>
    );
  }
  