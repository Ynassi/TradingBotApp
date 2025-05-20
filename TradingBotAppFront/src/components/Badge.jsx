import React from "react";

export default function Badge({ text }) {
  if (!text) return null;

  const colorMap = {
    buy: "bg-green-600",
    hold: "bg-yellow-500",
    sell: "bg-red-600"
  };

  const lowerText = text.toLowerCase();
  const badgeColor = colorMap[lowerText] || "bg-gray-600";

  return (
    <span className={`inline-block px-3 py-1 text-xs font-bold text-white uppercase rounded-full ${badgeColor}`}>
      {text}
    </span>
  );
}