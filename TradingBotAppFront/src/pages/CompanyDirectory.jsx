import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import CompanyMiniCard from "../components/CompanyMiniCard";
import CompanyStats from "../components/CompanyStats";
import SectorChart from "../components/SectorChart";
import MarketCapBreakdown from "../components/MarketCapBreakdown";
import KpiDistribution from "../components/KpiDistribution";
import CompanyFilterPanel from "../components/CompanyFilterPanel";
import { fuzzySearch } from "../utils/fuzzySearch";
import { ChevronDown, ChevronUp } from "lucide-react";

function CompanyDirectory() {
  const [companies, setCompanies] = useState([]);
  const [dfMerged, setDfMerged] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("market_cap");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterOptions, setFilterOptions] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Load data
  useEffect(() => {
    fetch("/api/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data));
    fetch("/api/df_final_merged")
      .then((res) => res.json())
      .then((data) => setDfMerged(data));
  }, []);

  // Apply filters + search + sort
  useEffect(() => {
    let results = fuzzySearch(companies, searchQuery, ["name", "ticker"]);

    if (filterOptions) {
      const {
        peMax,
        rsiMax,
        roeMin,
        betaMax,
        sentimentLabel,
        selectedRecs,
      } = filterOptions;

      results = results.filter((c) => {
        const pe = c?.fundamentals?.PE ?? Infinity;
        const rsi = c?.technical_indicators?.RSI_14 ?? Infinity;
        const roe = c?.fundamentals?.ROE ?? -Infinity;
        const beta = c?.beta ?? Infinity;
        const sentiment = c?.news_sentiment?.label ?? "";
        const rec = c?.analyst_rating?.recommendation?.toUpperCase() ?? "";

        return (
          pe <= peMax &&
          rsi <= rsiMax &&
          roe >= roeMin &&
          beta <= betaMax &&
          (sentimentLabel ? sentiment === sentimentLabel : true) &&
          (selectedRecs.length ? selectedRecs.includes(rec) : true)
        );
      });
    }

    results.sort((a, b) => {
      const valA = a?.market_cap ?? 0;
      const valB = b?.market_cap ?? 0;
      return sortOrder === "asc" ? valA - valB : valB - valA;
    });

    setFilteredCompanies(results);
  }, [companies, searchQuery, sortKey, sortOrder, filterOptions]);

  const handleFilterChange = (filters) => {
    setFilterOptions(filters);
  };

  return (
    <Layout>
      <h1 className="text-3xl md:text-4xl font-bold tracking-wider text-center mb-2">
        Répertoire des entreprises
      </h1>
      <p className="text-gray-300 text-sm max-w-2xl mx-auto text-center mb-2">
        Toutes les entreprises actuellement suivies par NASTRAD, triables par indicateur et filtrables par recherche.
      </p>

      <div className="mt-[-20px] p-6 flex flex-col gap-6">
        {/* 🔹 Dashboard Exploratoire */}
        <div>
          <h2 className="ml-10 text-xl font-semibold text-teal-300 text-left mt-10">
            Dashboard Exploratoire
          </h2>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 my-8 flex flex-col gap-10">
            <CompanyStats data={dfMerged} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <SectorChart data={dfMerged} type={"Sector"} />
              </div>
              <MarketCapBreakdown data={dfMerged} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KpiDistribution data={dfMerged} metric="PE" label="PE Ratio" />
              <KpiDistribution data={dfMerged} metric="ROE" label="ROE" />
              <KpiDistribution data={dfMerged} metric="ProfitMargin" label="Profit Margin" />
            </div>
          </div>
        </div>

        {/* 🔍 Barre de recherche */}
        <input
          type="text"
          placeholder="🔍 Rechercher une entreprise ou ticker..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 mx-auto px-4 py-2 rounded-lg border bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
        />

        {/* 🔍 Barre Filtres */}
        <div className="w-full">
          <div
            className="flex justify-between items-center bg-gray-800 text-teal-400 px-6 py-3 rounded-xl cursor-pointer w-full transition hover:bg-gray-700"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <span className="text-md font-bold tracking-wide">Filtres</span>
            {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              showFilters ? "max-h-[1000px] opacity-100 scale-100" : "max-h-0 opacity-0 scale-95"
            }`}
          >
            <div className="mt-4">
              <CompanyFilterPanel onFilterChange={handleFilterChange} />
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company, idx) => (
            <CompanyMiniCard key={idx} company={company} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default CompanyDirectory;