import React from 'react';
import Layout from '../../components/Layout';
import ColabLink from '../../components/ColabLink';
import InfoAccordion from '../../components/InfoAccordion';
import DataCardTable from '../../components/DataCardTable';

export default function Enrichissement() {
  const informationsAjoutees = [
    "Nom complet de l'entreprise",
    "Secteur et industrie",
    "Prix cible moyen (analystes)",
    "Note de recommandation (achat / neutre / vente)",
    "Nombre d'analystes",
    "Forward PE / Trailing PE",
    "Beta (volatilité relative)",
    "Rendement du dividende",
    "Résumé analytique généré (si disponible)",
    "Lien interactif vers TradingView"
  ];

  return (
    <Layout>
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 tracking-wider">
      Enrichissement des données
      </h1>

      <p className="text-gray-300 text-sm leading-relaxed max-w-4xl mx-auto text-center mb-10">
        Cette étape vise à enrichir les informations disponibles pour chaque entreprise sélectionnée à partir de sources externes reconnues telles que Yahoo Finance et Finnhub. L’objectif est de fournir un contexte plus détaillé pour chaque titre retenu dans les stratégies d’investissement (Short, Midterm, Shortterm).
      </p>

      <DataCardTable title="Informations ajoutées pour chaque entreprise" items={informationsAjoutees} />

      <InfoAccordion title="Données récupérées via Yahoo Finance">
        <p className="text-sm text-gray-300">
          Grâce à l’API non-officielle de Yahoo Finance (yfinance), plusieurs données contextuelles sont extraites, incluant le secteur d’activité, les évaluations d’analystes, des ratios fondamentaux (PE), le beta ou encore le rendement du dividende. Ces informations permettent d’ajouter un regard externe à nos scores internes.
        </p>
      </InfoAccordion>

      <InfoAccordion title="Données récupérées via Finnhub">
        <p className="text-sm text-gray-300">
          Pour les entreprises nord-américaines, l’API Finnhub complète les données fondamentales avec des indicateurs avancés (Net Debt/EBITDA, etc.) et des notations d’analystes. Les tickers européens et japonais sont exclus de cette étape en raison de la couverture partielle de Finnhub.
        </p>
      </InfoAccordion>

      <p className="text-gray-300 text-sm leading-relaxed max-w-4xl mx-auto text-center mt-10 mb-8">
        L’enrichissement ne s’applique qu’aux entreprises issues d’au moins une stratégie (Short, Midterm ou Court Terme) afin de garantir la pertinence et d’optimiser l’utilisation des ressources externes.
      </p>

      <ColabLink
        href="https://colab.research.google.com/drive/1VqRcqUl-ITWrWJ2faKjczWUMmcoUCVM4"
        label="INSIGHTS NOTEBOOK - GOOGLE COLAB"
      />
    </Layout>
  );
}
