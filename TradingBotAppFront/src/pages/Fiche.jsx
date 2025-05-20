import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Section from "../components/Section";
import StatGrid from "../components/StatGrid";
import ProgressBar from "../components/ProgressBar";
import Badge from "../components/Badge";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchFicheData } from "../api/api";

// 🧠 Devise dynamique selon le suffixe du ticker
function getCurrencySymbol(ticker) {
  if (ticker.endsWith(".T")) return "¥";
  if (ticker.endsWith(".PA")) return "€";
  return "$";
}

export default function Fiche() {
  const { ticker } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFicheData(ticker)
      .then((res) => {
        if (!res || res.error) throw new Error();
        setData(res);
      })
      .catch(() => {
        setError(true);
      });
  }, [ticker]);

  return (
    <Layout>
      {error ? (
        <div className="text-center text-red-400 py-10">
          Impossible de charger les données pour <span className="font-bold">{ticker}</span>.
        </div>
      ) : !data ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-10 animate-fadeIn">
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              {ticker} — {data.name}
            </h1>
            <p className="text-sm text-gray-400">
              {data.sector} · {data.source_list} ·{" "}
              {data.market_cap ? `${Math.round(data.market_cap / 1e9)} B ${getCurrencySymbol(data.ticker)}` : "N/A"}
            </p>
          </div>

          <Section title="Fondamentaux">
            <StatGrid data={data.fundamentals} />
          </Section>

          <Section title="Indicateurs Techniques">
            <StatGrid data={data.technical_indicators} />
          </Section>

          <Section title="Scores internes">
            <ProgressBar label="Value Score" value={data.scores?.ValueScore} />
            <ProgressBar label="Quality Score" value={data.scores?.QualityScore} />
            <ProgressBar label="Signal Score" value={data.scores?.SignalScore} />
          </Section>

          <Section title="Performance et Risque">
            <StatGrid data={{ volatility: data.volatility, beta: data.beta, return_6m: data.return_6m }} />
          </Section>

          <Section title="Analystes">
            <div className="flex flex-wrap items-center gap-4">
              <Badge text={data.analyst_rating?.recommendation} />
              <span className="text-sm text-gray-300">
                {data.analyst_rating?.analyst_count ?? "?"} analystes
              </span>
              <span className="text-sm text-gray-300">
                Cible moyenne :{" "}
                {data.analyst_rating?.target_mean_price
                  ? `${data.analyst_rating.target_mean_price.toLocaleString()} ${getCurrencySymbol(data.ticker)}`
                  : "N/A"}
              </span>
            </div>
          </Section>
        </div>
      )}
    </Layout>
  );
}
