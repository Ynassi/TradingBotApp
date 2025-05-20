export async function fetchOverviewData() {
  try {
    const response = await fetch("/api/overview-data");
    if (!response.ok) throw new Error("Erreur API overview");
    return await response.json();
  } catch (error) {
    console.error("Erreur fetch overview-data:", error);
    return null;
  }
}

export async function fetchFicheData(ticker) {
  try {
    const response = await fetch(`/api/fiche/${ticker}`);
    if (!response.ok) throw new Error("Erreur API fiche");
    return await response.json();
  } catch (error) {
    console.error(`Erreur fetch fiche ${ticker}:`, error);
    return null;
  }
}
