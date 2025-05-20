import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import logo from '../assets/logo.svg';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [listesOpen, setListesOpen] = useState(false);

  const handleCloseMenu = () => {
    setMenuOpen(false);
    setListesOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [menuOpen]);

  return (
    <Layout>
      {/* Contenu principal */}
      <main className="flex flex-col items-center justify-center text-center h-screen px-4">
        <img src={logo} alt="Logo NASTRAD" className="w-32 h-32 drop-shadow-xl mb-6" />
        <h2 className="text-3xl font-bold tracking-wider">Bienvenue sur NASTRAD</h2>
        <p className="text-sm mt-2 text-gray-400">
          Plateforme de screening stratégique et d’analyse boursière automatisée
        </p>
      </main>
    </Layout>
  );
}
