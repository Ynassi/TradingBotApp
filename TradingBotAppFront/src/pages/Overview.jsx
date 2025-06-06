import { useEffect, useState } from "react"
import { fetchOverviewData } from "../api/api"
import Layout from "../components/Layout"
import SentimentGauge from "../components/SentimentGauge"
import VixCard from "../components/VixCard"
import SectorHeatmap from "../components/SectorHeatmap"
import SectorPerformanceTable from "../components/SectorPerformanceTable"
import NewsFeed from "../components/NewsFeed"
import IndexesWrapper from "../components/IndexesWrapper"
import HeadlineSummary from "../components/HeadlineSummary"
import SectorOverviewTable from "../components/SectorOverviewTable"
import IndexSparklines from "../components/IndexSparklines"

function Overview() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOverviewData()
      .then((res) => {
        setData(res)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Erreur de chargement overview :", err)
        setLoading(false)
      })
  }, [])

  return (
    <Layout>
      <h1 className="text-3xl md:text-4xl font-bold tracking-wider text-center mb-2">
        Vue d’ensemble des marchés
      </h1>
      <p className="text-gray-300 text-sm max-w-2xl mx-auto text-center mb-2">
        Cette page offre un aperçu synthétique et visuel des dynamiques de marché actuelles : sentiment général, volatilité, performances sectorielles et actualité économique.
      </p>

      {loading ? (
        <p className="p-6 text-white">Chargement des données Overview...</p>
      ) : !data ? (
        <p className="p-6 text-red-500">Erreur lors du chargement des données.</p>
      ) : (

        <div className="p-6 flex flex-col gap-8">
          <HeadlineSummary />

          <SentimentGauge
            score={data.fear_greed_index?.score}
            label={data.fear_greed_index?.label}
          />

          <VixCard vixValue={data.vix.value} />

          <IndexesWrapper />

          <IndexSparklines data={data.index_sparklines} />

          <SectorHeatmap data={data.sector_heatmap} />

          <SectorOverviewTable
            performance={data.sector_performance}
            volatility={data.sector_volatility}
          />

          <SectorPerformanceTable data={data.sector_performance} />

          <NewsFeed articles={data.financial_news} />
        </div>
      )}
    </Layout>
  )
}

export default Overview
