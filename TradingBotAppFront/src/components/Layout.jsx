import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [listesOpen, setListesOpen] = useState(false);
  const location = useLocation();

  // Fermer le menu au changement de page
  useEffect(() => {
    setMenuOpen(false);
    setListesOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      
      {/* Header global */}
      <header className="flex justify-between items-center px-4 sm:px-6 py-4 z-30 relative">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-typewritter tracking-wider transition">N a s t r a d</Link>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="space-y-1 z-40"
          aria-label="Menu"
        >
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
      </header>

      {/* Menu latéral global */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-30 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col p-6 space-y-4 text-lg">
          <Link to="/fonctionnement" className="hover:text-teal-300">Fonctionnement</Link>
          <Link to="/overview" className="hover:text-teal-300">Vue d’ensemble</Link>
          <Link to="/companies" className="hover:text-teal-300">Compagnies</Link>

          <button
            onClick={() => setListesOpen(!listesOpen)}
            className="text-left text-white font-medium focus:outline-none hover:text-teal-300"
          >
            Listes {listesOpen ? '▴' : '▾'}
          </button>

          {listesOpen && (
            <div className="flex flex-col pl-4 space-y-2 text-base">
              <Link to="/list/short" className="hover:text-teal-300">Short</Link>
              <Link to="/list/midterm" className="hover:text-teal-300">Call (Moyen Terme)</Link>
              <Link to="/list/shortterm" className="hover:text-teal-300">Call (Court Terme)</Link>
            </div>
          )}

          <Link to="/visualisations" className="hover:text-teal-300">Visualisations</Link>
          <Link to="/alertes" className="hover:text-teal-300">Alertes</Link>
        </nav>
      </div>

      {/* Contenu de la page */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-screen-xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
