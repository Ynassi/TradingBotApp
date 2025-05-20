import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const steps = [
  {
    title: 'Extraction',
    description: 'Récupération des données brutes financières et techniques.',
    path: '/fonctionnement/extraction'
  },
  {
    title: 'Transformation',
    description: 'Nettoyage, normalisation, et création de scores (Value, Quality, Signal).',
    path: '/fonctionnement/transformation'
  },
  {
    title: 'Clustering',
    description: 'Regroupement des entreprises par profil via KMeans + t-SNE.',
    path: '/fonctionnement/clustering'
  },
  {
    title: 'Sélection stratégique',
    description: 'Filtrage des candidats Short, Midterm, Shortterm selon critères.',
    path: '/fonctionnement/selection'
  },
  {
    title: 'Enrichissement',
    description: 'Ajout de données depuis Finnhub & Yahoo Finance pour chaque entreprise.',
    path: '/fonctionnement/enrichissement'
  },
  {
    title: 'Génération des fiches',
    description: 'Fiches JSON complètes stockées et prêtes à l’affichage.',
    path: '/fonctionnement/genfiches'
  },
];

export default function Fonctionnement() {
  return (
    <Layout>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 tracking-wider">
          Fonctionnement de NASTRAD
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl hover:scale-[1.02] hover:border hover:border-teal-400 transition duration-300"
            >
              <h2 className="text-xl font-semibold text-teal-400 mb-2">
                <span className="text-gray-500 mr-1">#{index + 1}</span>
                {step.title}
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">{step.description}</p>

              <Link
                to={step.path}
                className="text-sm text-teal-400 hover:underline inline-block"
              >
                Voir la fiche complète →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
