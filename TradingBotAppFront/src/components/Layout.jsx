import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [listesOpen, setListesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setListesOpen(false);
  }, [location]);

  return (
    <div className="relative min-h-screen w-full text-white overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 fade-scroll-mask">
      
      {/* HEADER FIXE */}
      <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-br from-gray-900 to-gray-800 px-4 sm:px-6 py-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-typewritter tracking-wider">
              N a s t r a d
            </Link>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="space-y-1 z-50"
            aria-label="Menu"
          >
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </button>
        </div>
      </header>

      {/* MENU LATÉRAL AMÉLIORÉ */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 z-40 transition-all duration-500 ease-in-out
        ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"} shadow-lg pt-16`}
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

      {/* CONTENU */}
      <main className="pt-24 relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
