import React from 'react';
import Layout from '../../components/Layout';
import InfoAccordion from '../../components/InfoAccordion';
import ColabLink from '../../components/ColabLink';

export default function Selection() {
  return (
    <Layout>
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 tracking-wider">
       Sélection stratégique
      </h1>

      <p className="text-gray-300 text-sm leading-relaxed max-w-4xl mx-auto text-center mb-10">
        Cette étape permet d’identifier les actions les plus prometteuses pour chaque type de stratégie : court terme (rebond technique), moyen terme (investissement de valeur) ou opportunités spéculatives à shorter. Contrairement au regroupement par clusters, ici les entreprises sont filtrées selon des critères quantitatifs précis, basés sur les scores et indicateurs calculés précédemment.
      </p>

      <InfoAccordion title="Stratégie Short">
        <p className="mb-3 text-sm text-gray-300">
          Cette stratégie vise à détecter les titres en phase de surchauffe spéculative. Ces actions présentent un fort momentum haussier, mais aussi des signaux de fragilité technique ou fondamentale. Le but est d’anticiper un retournement baissier.
        </p>
        <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
          <li>RSI &gt; 62</li>
          <li>Momentum_10 &gt; 16</li>
          <li>ValueScore &gt; 0.76</li>
          <li>SignalScore &lt; 0.44</li>
          <li>Volatility &gt; 0.021</li>
          <li>Beta &gt; 1.1</li>
          <li>PB &gt; 3.5</li>
        </ul>
      </InfoAccordion>

      <InfoAccordion title="Stratégie Midterm">
        <p className="mb-3 text-sm text-gray-300">
          Cette stratégie cible des entreprises fondamentalement solides mais momentanément sous-évaluées. L’objectif est de tirer parti d’une revalorisation progressive du titre.
        </p>
        <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
          <li>ValueScore &gt; 0.68</li>
          <li>QualityScore &gt; 0.62</li>
          <li>PB &lt; 2.5</li>
          <li>Beta &lt; 1.2</li>
          <li>PE &lt; 30</li>
        </ul>
      </InfoAccordion>

      <InfoAccordion title="Stratégie Court Terme">
        <p className="mb-3 text-sm text-gray-300">
          Cette stratégie détecte des entreprises à fort potentiel de rebond dans les jours à venir. Les signaux proviennent principalement d’indicateurs techniques.
        </p>
        <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
          <li>SignalScore &gt; 0.63</li>
          <li>Momentum_10 &gt; 9</li>
          <li>RSI &lt; 58</li>
          <li>Beta &gt; 1</li>
          <li>Volatility &lt; 0.028</li>
        </ul>
      </InfoAccordion>

      <p className="text-gray-300 text-sm leading-relaxed max-w-4xl mx-auto text-center mt-12 mb-8">
        Les seuils appliqués sont réévalués régulièrement. Cette sélection permet de produire chaque jour trois listes distinctes, visibles dans la section "Listes" de l’application.
      </p>

      <ColabLink
        href="https://colab.research.google.com/drive/15cUhwj2for1sz5vhhkSONZZDV0jdZ2-6"
        label="ANALYSIS PIPELINE - SCREENING"
      />
    </Layout>
  );
}
