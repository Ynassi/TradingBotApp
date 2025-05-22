import React from "react";

const indicators = [
  { key: "PE", label: "PER (PE)", source: "fundamentals", format: v => v.toFixed(2) },
  { key: "ROE", label: "ROE", source: "fundamentals", format: v => `${(v * 100).toFixed(1)}%` },
  { key: "RSI_14", label: "RSI (14)", source: "technicals", format: v => v.toFixed(1) },
  { key: "beta", label: "Bêta", source: "root", format: v => v.toFixed(2) },
  { key: "volatility", label: "Volatilité", source: "root", format: v => `${(v * 100).toFixed(2)}%` },
];

const IndicatorBubble = ({ label, value }) => (
  <div className="w-32 h-32 rounded-full overflow-hidden shadow-md ring-1 ring-blue-800 ring-offset-2 ring-offset-gray-900 transform transition-transform duration-300 hover:scale-105 cursor-default flex flex-col">
    
    {/* Haut : nom indicateur */}
    <div className="bg-teal-300 h-1/2 flex items-center justify-center px-2 border-b border-blue-800">
      <span className="text-[11px] uppercase font-bold tracking-wide text-blue-900">
        {label}
      </span>
    </div>

    {/* Bas : valeur */}
    <div className="bg-blue-900 h-1/2 flex items-center justify-center px-2 shadow-inner">
      <span className="text-xl font-semibold text-white">
        {value}
      </span>
    </div>
  </div>
);

export default function MiniDashboard({ fundamentals, technicals, beta, volatility }) {
  const values = {
    fundamentals,
    technicals,
    root: { beta, volatility },
  };

  const displayedIndicators = indicators.map((ind) => {
    const value = values[ind.source]?.[ind.key];
    return value !== undefined ? (
      <IndicatorBubble key={ind.key} label={ind.label} value={ind.format(value)} />
    ) : null;
  });

  return (
    <div className="text-white text-center space-y-6">
      <div className="flex flex-wrap justify-center gap-16">
        {displayedIndicators}
      </div>
    </div>
  );
}
