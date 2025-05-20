import React from "react";

export default function ProgressBar({ label, value }) {
  if (value == null) return null;

  const percentage = Math.round(value * 100);

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-gray-300 mb-1">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full">
        <div
          className="h-2 bg-teal-400 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
