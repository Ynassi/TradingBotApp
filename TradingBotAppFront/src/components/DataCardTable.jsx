import React from 'react';

export default function DataCardTable({ title, items }) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-xl p-6 mb-12">
      <h2 className="text-xl font-semibold text-teal-400 mb-4 tracking-wide">
        {title}
      </h2>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="bg-gray-900 p-4 rounded-lg shadow hover:shadow-lg transition duration-300">
            <p className="text-gray-200 text-sm leading-relaxed">{item}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
