import { useEffect, useState } from "react"

export default function HeadlineSummary() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/headline-summary")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur HTTP")
        return res.json()
      })
      .then((data) => {
        setSummary(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Erreur HeadlineSummary :", err)
        setError(true)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 shadow-xl mb-8">
        <h2 className="text-xl font-semibold text-teal-400 mb-4 tracking-wide">
          Résumé stratégique du jour
        </h2>
        <p className="text-sm text-gray-300">Chargement...</p>
      </div>
    )
  }

  if (error || !summary) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 shadow-xl mb-8">
        <h2 className="text-xl font-semibold text-teal-400 mb-4 tracking-wide">
          Résumé stratégique du jour
        </h2>
        <p className="text-sm text-red-400">Résumé indisponible.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-xl mb-8">
      <h2 className="text-xl font-semibold text-teal-400 mb-4 tracking-wide">
        Résumé stratégique du jour
      </h2>
      <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
        {summary.summary}
      </p>
    </div>
  )
}
