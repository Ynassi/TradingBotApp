import React from 'react';
import Layout from '../../components/Layout';
import ColabLink from '../../components/ColabLink';
import InfoAccordion from '../../components/InfoAccordion';

export default function Clustering() {
  return (
    <Layout>
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 tracking-wider">
        Regroupement par Cluster
      </h1>

      <p className="text-gray-300 text-sm leading-relaxed max-w-4xl mx-auto text-center mb-10">
        Dans cette étape, les entreprises sont automatiquement regroupées par profil d’investissement à l’aide d’un algorithme de machine learning. Contrairement au filtrage fixe utilisé dans les étapes suivantes, ce regroupement est dynamique : il reflète les similarités observées entre les entreprises à un instant donné, et peut donc évoluer chaque jour.
      </p>

      <InfoAccordion title="Méthode de regroupement utilisée">
        <p className="mb-3">
          Le regroupement est réalisé à l’aide de l’algorithme KMeans, une méthode non supervisée qui identifie des groupes d’entreprises similaires en fonction de caractéristiques financières et techniques.
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
          <li>Les variables utilisées incluent les scores Value, Quality, Signal ainsi que RSI, MACD, Momentum, Volatility et Beta.</li>
          <li>Chaque entreprise est assignée à l’un des 5 clusters générés dynamiquement.</li>
          <li>Ces groupes représentent différents profils : valeurs spéculatives, entreprises stables, dynamiques haussières, etc.</li>
        </ul>
      </InfoAccordion>

      <InfoAccordion title="Utilisation des clusters dans l'application">
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
          <li>Les clusters permettent de contextualiser chaque entreprise dans un ensemble cohérent.</li>
          <li>Ils sont affichés dans la section "Vue d’ensemble" via une carte interactive.</li>
          <li>Pour chaque cluster, une fiche descriptive est automatiquement générée par un modèle de langage afin d’expliquer les tendances et caractéristiques moyennes du groupe.</li>
          <li>Ce regroupement précède les étapes de filtrage stratégique (short/mid/long) appliqué au sein de chaque cluster.</li>
        </ul>
      </InfoAccordion>

      <ColabLink
        href="https://colab.research.google.com/drive/15cUhwj2for1sz5vhhkSONZZDV0jdZ2-6"
        label="ANALYSIS PIPELINE - CLUSTERING"
      />
    </Layout>
  );
}