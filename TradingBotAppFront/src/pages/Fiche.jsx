import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Section from "../components/Section";
import ToggleSection from "../components/ToggleSection";
import StatGrid from "../components/StatGrid";
import ProgressBar from "../components/ProgressBar";
import Badge from "../components/Badge";
import LoadingSpinner from "../components/LoadingSpinner";
import CurrentTargetPrice from "../components/CurrentTargetPrice";
import PriceHistoryChart from "../components/PriceHistoryChart";
import MiniDashboard from "../components/MiniDashboard";
import SentimentOverviewCard from "../components/SentimentOverviewCard";
import NewsListScored from "../components/NewsListScored";
import { fetchFicheData } from "../api/api";

// 🧠 Devise dynamique selon le suffixe du ticker
function getCurrencySymbol(ticker) {
  if (ticker.endsWith(".T")) return "¥";
  if (ticker.endsWith(".PA")) return "€";
  return "$";
}

// 📅 Formatage lisible de la date d’extraction
function formatExtractionDate(isoDate) {
  if (!isoDate) return "inconnue";
  const date = new Date(isoDate);
  if (isNaN(date)) return "invalide";
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
        <div className="mt-6 space-y-10 animate-fadeIn">
          {/* 🔹 HEADER */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-400 flex flex-wrap justify-center gap-4">
              <span>{data.sector}</span>
              <span>{data.source_list}</span>
              {data.market_cap && (
                <span>
                  {Math.round(data.market_cap / 1e9)} B {getCurrencySymbol(data.ticker)}
                </span>
              )}
            </p>

            <div className="flex justify-center items-center gap-3 flex-wrap">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                {ticker} — {data.name}
              </h1>
              <Badge text={data.analyst_rating?.recommendation} />
            </div>

            {data.visual_data?.current_price_data?.price && data.extraction_date && (
              <p className="text-sm text-gray-300">
                Prix à la clôture le {formatExtractionDate(data.extraction_date)} :{" "}
                <span className="font-semibold">
                  {data.visual_data.current_price_data.price.toFixed(2)}{" "}
                  {getCurrencySymbol(data.ticker)}
                </span>{" "}
                <span
                  className={
                    data.visual_data.current_price_data.percent_change >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {data.visual_data.current_price_data.percent_change >= 0 ? "+" : ""}
                  {data.visual_data.current_price_data.percent_change}%
                </span>
              </p>
            )}
          </div>

          {/* 🔹 CHART TEMPOREL */}
          {Array.isArray(data.visual_data?.sparkline) && data.visual_data.sparkline.length > 1 && (
            <PriceHistoryChart data={data.visual_data.sparkline} />
          )}

          {/* 🔹 MINI DASHBOARD */}
          <MiniDashboard
            fundamentals={data.fundamentals}
            technicals={data.technical_indicators}
            beta={data.beta}
            volatility={data.volatility}
          />

          {/* 🔹 ANALYSE IA DES NEWS */}
          {data.news_sentiment && (
          <Section title="News AI Analysis">
            <SentimentOverviewCard sentiment={data.news_sentiment} />

            {/* 🔸 Résumé Mistral-7B */}
            <div className="mt-10">
              <h4 className="text-teal-400 font-semibold text-md mb-2">
                Résumé des news par Mistral-7B
              </h4>
              <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                {data.news_sentiment.summary}
              </p>
              <NewsListScored headlines={data.news_sentiment.headlines} />
            </div>
          </Section>
        )}

          {/* 🔹 SCORES INTERNES */}
          <Section title="Scores internes">
            <ProgressBar label="Value Score" value={data.scores?.ValueScore} />
            <ProgressBar label="Quality Score" value={data.scores?.QualityScore} />
            <ProgressBar label="Signal Score" value={data.scores?.SignalScore} />
          </Section>

          {/* 🔹 ANALYSTES */}
          <Section title="Analystes">
            <div className="flex flex-wrap justify-center items-center gap-16">
              <Badge text={data.analyst_rating?.recommendation} />
              <span className="text-sm text-gray-300">
                {data.analyst_rating?.analyst_count ?? "?"} analystes
              </span>
            </div>

            <CurrentTargetPrice
              title="Prix Actuel vs cible analystes"
              current={data.visual_data?.current_price_data?.price}
              target={data.analyst_rating?.target_mean_price}
              currency={getCurrencySymbol(data.ticker)}
            />
          </Section>

          {/* 🔹 ACCORDÉONS */}
          <ToggleSection title="Fondamentaux">
            <StatGrid data={data.fundamentals} />
          </ToggleSection>

          <ToggleSection title="Indicateurs Techniques">
            <StatGrid data={data.technical_indicators} />
          </ToggleSection>

          <ToggleSection title="Performance et Risque">
            <StatGrid
              data={{
                volatility: data.volatility,
                beta: data.beta,
                return_6m: data.return_6m,
              }}
            />
          </ToggleSection>
        </div>
      )}
    </Layout>
  );
}
