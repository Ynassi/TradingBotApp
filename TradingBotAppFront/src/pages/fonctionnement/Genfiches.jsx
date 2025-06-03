import React from 'react';
import Layout from '../../components/Layout';
import ColabLink from '../../components/ColabLink';
import InfoAccordion from '../../components/InfoAccordion';
import DataCardTable from '../../components/DataCardTable';

export default function Genfiches() {
  const structure = [
    "Identifiant boursier (Ticker) et nom complet de l’entreprise",
    "Secteur d’activité et capitalisation boursière",
    "Scores fondamentaux et techniques (Value, Quality, Signal)",
    "Ratios financiers : PER, PB, ROE, marges",
    "Indicateurs techniques : RSI, MACD, Momentum, Bollinger %B",
    "Volatilité historique (6 mois) et bêta",
    "Résumé analytique généré (le cas échéant)",
    "Recommandations des analystes (Yahoo Finance & Finnhub)",
    "Lien intégré vers le graphique interactif"
  ];

  return (
    <Layout>
      <div className= "mt-6">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 tracking-wider">
        Génération des fiches
      </h1></div>

      <p className="text-gray-300 text-sm leading-relaxed max-w-4xl mx-auto text-center mb-10">
        À l’issue de l’enrichissement des données, chaque entreprise est résumée dans une fiche descriptive automatisée. Ces fiches contiennent toutes les métriques clés — scores, ratios, indicateurs techniques et avis d’analystes — et servent de base à l’affichage interactif des profils d’entreprise dans l’interface.
      </p>

      <DataCardTable title="Contenu type d'une fiche descriptive" items={structure} />

      <InfoAccordion title="Utilité des fiches dans l’application">
        <p className="text-gray-300 text-sm mb-4">
          Les fiches permettent à l’interface de NASTRAD d'afficher rapidement les informations essentielles d'une entreprise. Elles sont générées automatiquement à partir des données du pipeline, standardisées et enrichies via API.
        </p>
        <p className="text-gray-300 text-sm mb-4">
          Chaque fiche est indépendante et peut être utilisée dans plusieurs modules : visualisations, vues détaillées, alertes ou rapports exportables. L’ensemble est stocké localement dans le répertoire <code className="bg-gray-700 px-1 rounded">output/insights_enriched/</code>.
        </p>
        <p className="text-gray-300 text-sm">
          Ce format modulaire permet de <strong>facilement mettre à jour</strong> les contenus affichés en relançant le pipeline, sans perturber l’expérience utilisateur.
        </p>
      </InfoAccordion>

      <ColabLink
        href="https://colab.research.google.com/drive/15cUhwj2for1sz5vhhkSONZZDV0jdZ2-6"
        label="ANALYSIS PIPELINE - GÉNÉRATION FICHES"
      />
    </Layout>
  );
}