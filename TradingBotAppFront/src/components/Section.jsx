import React from "react";

export default function Section({ title, children }) {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold text-teal-300">{title}</h2>
      {children}
    </div>
  );
}