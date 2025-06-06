import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import logo from '../assets/logo.svg';
import '../index.css';

export default function Home() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <Layout>
      <main className="relative z-20 flex flex-col items-center justify-center text-center min-h-screen pt-32 px-4">
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
