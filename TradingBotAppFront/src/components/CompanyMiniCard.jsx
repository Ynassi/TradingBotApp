import React from "react";
import { Link } from "react-router-dom";

const CompanyMiniCard = ({ company }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow hover:shadow-xl transition duration-200 border border-gray-700">
      <div className="text-lg font-semibold text-white truncate">{company.Company}</div>
      <div className="text-xs text-gray-400 mb-2">Secteur : {company.Sector}</div>

      <div className="text-sm text-gray-300 space-y-1">
        <div><strong>RSI:</strong> {company.RSI_14?.toFixed(1)}</div>
        <div><strong>Momentum:</strong> {company.Momentum_10?.toFixed(2)}</div>
        <div><strong>PE Ratio:</strong> {company.PE?.toFixed(2)}</div>
        <div><strong>ROE:</strong> {(company.ROE * 100)?.toFixed(1)}%</div>
        <div><strong>Profit Margin:</strong> {(company.ProfitMargin * 100)?.toFixed(1)}%</div>
        <div><strong>Gross Margin:</strong> {(company.GrossMargin * 100)?.toFixed(1)}%</div>
        <div><strong>Market Cap:</strong> ${(company.MarketCap / 1e9)?.toFixed(1)}B</div>
      </div>

      <Link
        to={`/fiche/${encodeURIComponent(company.Ticker)}`}
        className="inline-flex items-center justify-center mt-4 px-3 py-1.5 bg-gray-700 text-teal-300 text-xs font-semibold rounded-lg border border-gray-600 hover:bg-gray-600 hover:text-white transition"
      >
        Voir fiche ({company.Company})
      </Link>
    </div>
  );
};

export default CompanyMiniCard;
