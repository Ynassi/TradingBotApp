import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import ParticlesBackground from '../components/ParticlesBackground';
import logo from '../assets/logo.svg';
import '../index.css'; // Assure-toi que ce fichier contient l'animation CSS

export default function Home() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <Layout>
      <ParticlesBackground />
      <main className="flex flex-col items-center justify-center text-center h-screen px-4 relative z-10">
        <img
          src={logo}
          alt="Logo NASTRAD"
          className="w-44 h-44 drop-shadow-xl mb-6 animate-logo-pulse"
        />
        <h2 className="text-3xl font-bold tracking-wider">Bienvenue sur NASTRAD</h2>
        <p className="text-sm mt-2 text-gray-400">
          Plateforme de screening stratégique et d’analyse boursière automatisée
        </p>
      </main>
    </Layout>
  );
}
