import React from "react";

export default function Badge({ text }) {
  if (!text) return null;

  const lowerText = text.toLowerCase().replaceAll(" ", "_");

  const colorMap = {
    strong_buy: "bg-emerald-400",  // ✅ Pastille verte flashy
    buy: "bg-green-600",
    hold: "bg-yellow-500",
    sell: "bg-red-600",
    underperform: "bg-red-700"
  };

  const badgeColor = colorMap[lowerText] || "bg-gray-600";
  const displayText = text.replaceAll("_", " ").toUpperCase();

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase rounded-full ${badgeColor}`}
    >
      <span className={lowerText === "strong_buy" ? "text-blue-900" : "text-white"}>
        {displayText}
      </span>
      {lowerText === "strong_buy" && (
        <span className="animate-pulse text-lg">🔥</span>
      )}
    </span>
  );
}
