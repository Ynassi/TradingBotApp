import React from 'react';
import Layout from '../../components/Layout';
import ColabLink from '../../components/ColabLink';
import DataCardTable from '../../components/DataCardTable';
import PieChartCard from '../../components/PieChartCard';
import InfoAccordion from '../../components/InfoAccordion';

export default function Extraction() {
  const fondamentales = [
    "PER (Price to Earnings Ratio)",
    "Price-to-Book",
    "ROE",
    "Marge opérationnelle",
    "Capitalisation boursière"
  ];

  const techniques = [
    "RSI (Relative Strength Index)",
    "MACD",
    "Moyennes mobiles",
    "Momentum",
    "Bandes de Bollinger"
  ];

  const historique = [
    "Cours ajustés quotidiens (6 mois)",
    "Volatilité historique",
    "Performance relative",
    "Volume de transaction"
  ];

  const secteur = [
    "Classification sectorielle standardisée (GICS)",
    "Secteurs : Tech, Health, Industrials, etc.",
    "Utilisé pour les comparaisons intra-sectorielles",
    "Regroupement par classe d'actifs"
  ];

  const indicesChartData = [
    { name: 'S&P 500', value: 500 },
    { name: 'CAC 40', value: 40 },
    { name: 'Nikkei 225', value: 225 }
  ];

  const sources = [
    "Yahoo Finance (via yfinance)",
    "Wikipedia (composition des indices)",
    "Finnhub (ratios fondamentaux supplémentaires)"
  ];

  return (
    <Layout>
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 tracking-wider">
        Extraction des données
      </h1>

      <p className="text-gray-300 text-sm leading-relaxed max-w-4xl mx-auto text-center mb-8">
        Cette étape vise à centraliser automatiquement les données financières, techniques et sectorielles des entreprises composant trois indices boursiers majeurs (S&P 500, CAC 40, Nikkei 225). Ces données sont ensuite nettoyées, normalisées et archivées localement afin d’alimenter les étapes suivantes du processus analytique.
      </p>

      <p className="text-gray-300 text-sm leading-relaxed max-w-4xl mx-auto text-center mb-10">
        Vous trouverez ci-dessous une vue d’ensemble des sources, typologies de données extraites, ainsi qu’une répartition représentative des entreprises selon leur indice d’origine.
      </p>

      <div className="flex flex-col space-y-12 mb-8">
        <PieChartCard title="Répartition des entreprises par indice" data={indicesChartData} />
    
    <div className="grid gap-8 lg:grid-cols-2">
        <DataCardTable title="Sources de données" items={sources} />
        <DataCardTable title="Données fondamentales" items={fondamentales} />
        <DataCardTable title="Données techniques" items={techniques} />
        <DataCardTable title="Historique boursier" items={historique} />
        <DataCardTable title="Secteur d'activité" items={secteur} />
    </div>
    </div>

      <InfoAccordion title=" Détails sur les ratios fondamentaux analysés">
            <p className="mb-4">
                Les ratios fondamentaux sont des indicateurs utilisés pour évaluer la valorisation, la rentabilité, l’endettement et l’efficacité d’une entreprise. Voici les principaux extraits dans cette étape :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                <li><strong>PER (Price to Earnings Ratio)</strong> : mesure combien les investisseurs paient pour chaque dollar de bénéfice. Un PER élevé peut indiquer une attente de croissance élevée.</li>
                <li><strong>Price-to-Book (P/B)</strong> : rapport entre la capitalisation boursière et les actifs nets. Permet d’évaluer si une entreprise est sous- ou surévaluée par rapport à sa valeur comptable.</li>
                <li><strong>ROE (Return on Equity)</strong> : mesure la rentabilité des capitaux propres. Un indicateur clé de la performance pour les actionnaires.</li>
                <li><strong>Net Profit Margin</strong> : pourcentage du chiffre d’affaires converti en bénéfice net. Évalue l’efficacité opérationnelle globale.</li>
                <li><strong>Operating Margin</strong> : rapport entre le résultat d’exploitation et les ventes. Donne une vision de la rentabilité avant charges financières et impôts.</li>
                <li><strong>EBITDA Margin</strong> : marge brute avant amortissements. Sert souvent de proxy de rentabilité opérationnelle.</li>
                <li><strong>Debt-to-Equity (D/E)</strong> : évalue le levier financier, c’est-à-dire la proportion de dette dans le financement de l’entreprise.</li>
                <li><strong>Current Ratio</strong> : ratio de liquidité à court terme. Il compare les actifs courts à la dette court terme.</li>
                <li><strong>Market Capitalization</strong> : valeur totale de l’entreprise sur les marchés boursiers. Utilisée pour classer les entreprises (large cap, mid cap, etc.).</li>
            </ul>
            <p className="mt-4">
                Ces données sont extraites en priorité via Yahoo Finance (via yfinance) et Finnhub, puis stockées dans une base SQLite pour analyses ultérieures.
            </p>
        </InfoAccordion>
        <InfoAccordion title=" Détails sur les indicateurs techniques analysés">
            <p className="mb-4">
                Les données techniques sont dérivées de l’analyse graphique et permettent de détecter les dynamiques de marché à court et moyen terme. Elles sont calculées à partir de l’historique de prix des entreprises sur 6 mois.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                <li><strong>RSI (Relative Strength Index)</strong> : mesure la vitesse et l’amplitude des variations de prix récentes. Un RSI élevé (&gt;70) peut signaler une surévaluation ; un RSI bas (&lt;30), une sous-évaluation.</li>
                <li><strong>MACD (Moving Average Convergence Divergence)</strong> : détecte les croisements de tendance en comparant deux moyennes mobiles exponentielles. Utile pour repérer les inversions de tendance.</li>
                <li><strong>Moyennes Mobiles (20j, 50j, 200j)</strong> : suivent la tendance des prix sur différentes périodes. Les croisements (ex. 50j au-dessus du 200j) sont des signaux fréquents en trading.</li>
                <li><strong>Momentum</strong> : mesure la vitesse de variation du prix. Un momentum élevé traduit une tendance forte (haussière ou baissière).</li>
                <li><strong>Bandes de Bollinger</strong> : encadrent le prix à ±2 écarts-types d'une moyenne mobile. Quand le prix touche une bande, cela peut indiquer une tension (surachat/survente).</li>
            </ul>
            <p className="mt-4">
            Ces indicateurs sont calculés localement à partir de l’historique de prix journalier téléchargé via yfinance, en utilisant la bibliothèque ta.
            </p>
        </InfoAccordion>


      <ColabLink
        href="https://colab.research.google.com/drive/15cUhwj2for1sz5vhhkSONZZDV0jdZ2-6#scrollTo=G0yEvb0IVOPu"
        label="PIPELINE ETL - GOOGLE COLAB "
      />
    </Layout>
  );
}
