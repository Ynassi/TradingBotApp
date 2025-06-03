import React from 'react';
import Layout from '../../components/Layout';
import ColabLink from '../../components/ColabLink';
import InfoAccordion from '../../components/InfoAccordion';

export default function Transformation() {
  return (
    <Layout>
      <div className= "mt-6">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 tracking-wider">
       Transformation des données
      </h1></div>

      <p className="text-gray-300 text-sm leading-relaxed max-w-4xl mx-auto text-center mb-10">
        Une fois les données extraites, elles sont préparées pour l’analyse stratégique. Cette phase comprend le nettoyage des données brutes, leur normalisation et la création de trois scores synthétiques : Value, Quality et Signal. Ces scores sont ensuite utilisés pour prioriser les entreprises les plus prometteuses.
      </p>

      <InfoAccordion title="Étape 1 — Nettoyage des données manquantes">
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
          <li>Suppression des entreprises avec trop de valeurs manquantes sur PE, ROE ou EV/Revenue.</li>
          <li>Imputation des valeurs manquantes par la médiane sectorielle (ex. : ROE, beta, EV/Revenue).</li>
          <li>Nettoyage des doublons, harmonisation des noms de secteurs, uniformisation des catégories.</li>
        </ul>
      </InfoAccordion>

      <InfoAccordion title="Étape 2 — Normalisation avec MinMaxScaler">
        <p className="mb-3">
          Afin d’unifier les échelles de mesure, certaines variables sont mises à l’échelle entre 0 et 1 à l’aide du MinMaxScaler de scikit-learn. Cette opération est appliquée uniquement aux groupes de variables utilisées dans la construction des scores.
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
          <li>Les ratios fondamentaux bruts sont conservés pour l’analyse directe (ex. : market cap, volume).</li>
          <li>Les variables de scoring (PE, PB, ROE, RSI, etc.) sont normalisées pour éviter les biais d’échelle.</li>
          <li>La normalisation précède l’agrégation dans un score synthétique.</li>
        </ul>
      </InfoAccordion>

      <InfoAccordion title="Étape 3 — Construction des scores">
        <p className="mb-4">
          Trois scores sont calculés pour chaque entreprise afin de synthétiser sa valorisation, sa solidité financière et son signal de marché :
        </p>
        <ul className="list-disc list-inside space-y-4 text-sm text-gray-300">
          <li>
            <strong>Value Score</strong> : Basé sur PE, PB et EV/Revenue. Un score élevé signifie que l’entreprise est sous-évaluée par rapport à ses fondamentaux.
          </li>
          <li>
            <strong>Quality Score</strong> : Moyenne de ROE, marge brute et marge nette. Le score est ajusté si le beta est supérieur à 1, afin de pénaliser les entreprises trop volatiles.
          </li>
          <li>
            <strong>Signal Score</strong> : Inverse de la moyenne de RSI, MACD et Momentum. Plus ces indicateurs sont hauts, plus l’effet est déjà intégré dans le prix, ce qui réduit l’opportunité.
          </li>
        </ul>
      </InfoAccordion>

      <ColabLink
        href="https://colab.research.google.com/drive/15cUhwj2for1sz5vhhkSONZZDV0jdZ2-6"
        label="PIPELINE ETL - GOOGLE COLAB"
      />
    </Layout>
  );
}
