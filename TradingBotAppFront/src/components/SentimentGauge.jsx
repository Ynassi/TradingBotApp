import React from 'react';

export default function SentimentGauge({ score, label }) {
  const color =
    score < 40 ? 'bg-red-500' : score < 60 ? 'bg-yellow-400' : 'bg-green-500';

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-xl mb-8">
      <h2 className="text-xl font-semibold text-teal-400 mb-4 tracking-wide">Indice Fear & Greed</h2>

      <div className="w-full bg-gray-700 h-6 rounded-full">
        <div
          className={`h-6 rounded-full ${color}`}
          style={{ width: `${score}%`, transition: 'width 0.3s ease-in-out' }}
        />
      </div>

      <p className="text-center text-sm text-gray-300 mt-2">
        Score actuel : {score}/100      ({label})
      </p>
    </div>
  );
}
