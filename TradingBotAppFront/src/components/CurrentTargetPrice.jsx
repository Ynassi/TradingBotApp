import React from "react";

export default function CurrentTargetPrice({ current, target, currency = "$" }) {
  if (!current || !target) return null;

  const delta = target - current;
  const percent = ((delta / current) * 100).toFixed(1);
  const isPositive = delta > 0;

  const color =
    delta === 0
      ? "text-gray-400 border-gray-400"
      : isPositive
      ? "text-green-400 border-green-400"
      : "text-red-400 border-red-400";

  const label = delta === 0 ? "Même prix" : `${isPositive ? "+" : ""}${percent}%`;

  return (
    <div className="flex justify-center mt-6">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md space-y-6">
        
        {/* Badge de variation */}
        <div className="flex justify-center">
          <div className={`border px-4 py-1 rounded-full text-sm font-semibold ${color}`}>
            {label}
          </div>
        </div>

        {/* Bloc prix actuel et cible */}
        <div className="flex justify-between text-sm text-white">
          <div className="text-center w-1/2">
            <p className="text-gray-400 text-xs mb-1">Prix actuel</p>
            <p className="font-semibold text-base">
              {current.toFixed(2)} {currency}
            </p>
          </div>
          <div className="text-center w-1/2">
            <p className="text-gray-400 text-xs mb-1">Cible moyenne</p>
            <p className="font-semibold text-base">
              {target.toFixed(2)} {currency}
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
