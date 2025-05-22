import React from "react";
import { Link } from "react-router-dom";

const CompanyMiniCard = ({ company }) => {
  if (!company) return null;

  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow hover:shadow-xl transition duration-200 border border-gray-700">
      {/* Titre principal */}
      <div className="text-lg font-semibold text-white truncate">
        {company.name} ({company.ticker})
      </div>
      <div className="text-xs text-gray-400 mb-2">Secteur : {company.sector}</div>

      {/* Indicateurs clés */}
      <div className="text-sm text-gray-300 space-y-1">
        <div><strong>RSI :</strong> {company.technical_indicators?.RSI_14?.toFixed(1)}</div>
        <div><strong>Momentum :</strong> {company.technical_indicators?.Momentum_10?.toFixed(2)}</div>
        <div><strong>PE Ratio :</strong> {company.fundamentals?.PE?.toFixed(2)}</div>
        <div><strong>ROE :</strong> {(company.fundamentals?.ROE * 100)?.toFixed(1)}%</div>
        <div><strong>Profit Margin :</strong> {(company.fundamentals?.ProfitMargin * 100)?.toFixed(1)}%</div>
        <div><strong>Gross Margin :</strong> {(company.fundamentals?.GrossMargin * 100)?.toFixed(1)}%</div>
        <div><strong>Market Cap :</strong> ${(company.market_cap / 1e9)?.toFixed(1)}B</div>
      </div>

      {/* Lien vers la fiche */}
      <Link
        to={`/fiche/${encodeURIComponent(company.ticker)}`}
        className="inline-flex items-center justify-center mt-4 px-3 py-1.5 bg-gray-700 text-teal-300 text-xs font-semibold rounded-lg border border-gray-600 hover:bg-gray-600 hover:text-white transition"
      >
        Voir fiche
      </Link>
    </div>
  );
};

export default CompanyMiniCard;
