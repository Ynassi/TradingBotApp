import React from "react";
import { Link } from "react-router-dom";

const CompanyMiniCard = ({ company }) => {
  if (!company) return null;

  // Fonctions utilitaires pour éviter les erreurs sur null
  const formatNumber = (val, decimals = 2) =>
    val != null && !isNaN(val) ? val.toFixed(decimals) : "N/A";

  const formatPercent = (val, decimals = 1) =>
    val != null && !isNaN(val) ? `${(val * 100).toFixed(decimals)}%` : "N/A";

  const formatBillion = (val) =>
    val != null && !isNaN(val) ? `$${(val / 1e9).toFixed(1)}B` : "N/A";

  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow hover:shadow-xl transition duration-200 border border-gray-700">
      {/* Titre principal */}
      <div className="text-lg font-semibold text-white truncate">
        {company.name} ({company.ticker})
      </div>
      <div className="text-xs text-gray-400 mb-2">
        Secteur : {company.sector || "N/A"}
      </div>

      {/* Indicateurs clés */}
      <div className="text-sm text-gray-300 space-y-1">
        <div><strong>RSI :</strong> {formatNumber(company.technical_indicators?.RSI_14, 1)}</div>
        <div><strong>Momentum :</strong> {formatNumber(company.technical_indicators?.Momentum_10, 2)}</div>
        <div><strong>PE Ratio :</strong> {formatNumber(company.fundamentals?.PE, 2)}</div>
        <div><strong>ROE :</strong> {formatPercent(company.fundamentals?.ROE)}</div>
        <div><strong>Profit Margin :</strong> {formatPercent(company.fundamentals?.ProfitMargin)}</div>
        <div><strong>Gross Margin :</strong> {formatPercent(company.fundamentals?.GrossMargin)}</div>
        <div><strong>Market Cap :</strong> {formatBillion(company.market_cap)}</div>
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
