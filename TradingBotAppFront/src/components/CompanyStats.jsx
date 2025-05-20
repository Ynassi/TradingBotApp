import React from "react";

const CompanyStats = ({ data }) => {
  const totalCompanies = data.length;
  const totalMarketCap = data.reduce(
    (sum, company) => sum + (company.MarketCap || 0),
    0
  );

  return (
    <div className="text-white text-center">
      <p className="text-xl font-semibold">{totalCompanies} entreprises listées</p>
      <p className="text-sm text-gray-400">
        Capitalisation totale : {(totalMarketCap / 1e12).toFixed(2)}T $
      </p>
    </div>
  );
};

export default CompanyStats;