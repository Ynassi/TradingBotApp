import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import CompanyMiniCard from "../components/CompanyMiniCard";
import CompanyStats from "../components/CompanyStats";
import SectorChart from "../components/SectorChart";
import MarketCapBreakdown from "../components/MarketCapBreakdown";
import KpiDistribution from "../components/KpiDistribution";
import { fuzzySearch } from "../utils/fuzzySearch";

// 📈 Conversion vers USD approximative
function convertToUSD(marketCap, ticker) {
  if (ticker?.endsWith(".T")) return marketCap / 150;     // ¥ → USD
  if (ticker?.endsWith(".PA")) return marketCap * 1.08;   // € → USD
  return marketCap; // USD par défaut
}

function CompanyDirectory() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("MarketCap");
  const [sortOrder, setSortOrder] = useState("desc");
  const [chartType, setChartType] = useState("Sector");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/companies")
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
        setFilteredCompanies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement companies:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const results = fuzzySearch(companies, searchQuery, ["Company", "Ticker"]);
    const sorted = results.sort((a, b) => {
      let valA = a[sortKey] ?? 0;
      let valB = b[sortKey] ?? 0;

      if (sortKey === "MarketCap") {
        valA = convertToUSD(valA, a.Ticker);
        valB = convertToUSD(valB, b.Ticker);
      }

      return sortOrder === "asc" ? valA - valB : valB - valA;
    });
    setFilteredCompanies(sorted);
  }, [searchQuery, sortKey, sortOrder, companies]);

  return (
    <Layout>
      <div className="p-6 flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-wider">Répertoire des entreprises</h1>
          <p className="text-gray-300 mt-2 text-sm max-w-2xl mx-auto">
            Toutes les entreprises actuellement suivies par NASTRAD, triables par indicateur et filtrables par recherche.
          </p>
        </div>

        {/* Dashboard Exploratoire */}
        <div>
          <h2 className="ml-10 text-xl font-semibold text-teal-300 text-left mt-10">Dashboard Exploratoire</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 my-8 flex flex-col gap-10">
            <CompanyStats data={companies} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <SectorChart data={companies} type={chartType} />
                <div className="flex justify-center">
                  <button
                    onClick={() =>
                      setChartType(chartType === "Sector" ? "Index" : "Sector")
                    }
                    className="mt-1 ml-2 px-3 py-1 bg-gray-700 text-sm rounded-lg border border-gray-600 text-teal-400 hover:bg-gray-600 transition"
                  >
                    🔁 Voir par {chartType === "Sector" ? "index" : "secteur"}
                  </button>
                </div>
              </div>
              <MarketCapBreakdown data={companies} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KpiDistribution data={companies} metric="PE" label="PE Ratio" />
              <KpiDistribution data={companies} metric="ROE" label="ROE" />
              <KpiDistribution data={companies} metric="ProfitMargin" label="Profit Margin" />
            </div>
          </div>
        </div>

        {/* Recherche et tri */}
        <h2 className="ml-10 text-xl font-semibold text-teal-300 text-left mt-10">Recherche</h2>
        <input
          type="text"
          placeholder="🔍 Rechercher une entreprise ou ticker..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 mx-auto px-4 py-2 rounded-lg border bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
        />

        <div className="flex justify-center items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Trier par :</label>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="p-2 rounded-md bg-gray-700 border border-gray-600 text-white"
            >
              <option value="RSI_14">RSI</option>
              <option value="Momentum_10">Momentum</option>
              <option value="PE">PE Ratio</option>
              <option value="ROE">ROE</option>
              <option value="ProfitMargin">Profit Margin</option>
              <option value="GrossMargin">Gross Margin</option>
              <option value="MarketCap">Market Cap</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Ordre :</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 rounded-md bg-gray-700 border border-gray-600 text-white"
            >
              <option value="desc">Décroissant</option>
              <option value="asc">Croissant</option>
            </select>
          </div>
        </div>

        {/* Résultats */}
        {loading ? (
          <p className="text-white text-center">Chargement des entreprises...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company, idx) => (
              <CompanyMiniCard key={idx} company={company} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default CompanyDirectory;
