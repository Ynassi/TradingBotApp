import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';
import ParticlesBackground from '../components/ParticlesBackground';

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [listesOpen, setListesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hasScrolledOnce, setHasScrolledOnce] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    setMenuOpen(false);
    setListesOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (scrolled && !hasScrolledOnce) {
      setHasScrolledOnce(true);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [scrolled]);

  const hideAnimals =
    location.pathname === '/' || location.pathname.startsWith('/fiche');

  const forceHeaderShrunk =
    location.pathname === '/' ||
    location.pathname.startsWith('/fiche') ||
    location.pathname === '/fonctionnement' ||
    location.pathname.startsWith('/fonctionnement/');

  const childArray = React.Children.toArray(children);
  const headerElements = [];
  const contentElements = [...childArray];

  while (contentElements.length > 0) {
    const next = contentElements[0];
    if (
      (headerElements.length === 0 && next.type === 'h1') ||
      (headerElements.length > 0 &&
        next.type === 'p' &&
        !next.props.children?.toString().toLowerCase().includes('chargement') &&
        !next.props.children?.toString().toLowerCase().includes('erreur'))
    ) {
      headerElements.push(contentElements.shift());
    } else {
      break;
    }
  }

  return (
    <div className="relative min-h-screen w-full text-white overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 fade-scroll-mask">
      {/*  Image de fond sur la page Home uniquement */}
      {isHome && (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/background_home.png')" }}
        />
      )}

      {/*  Particules toujours visibles au-dessus du fond */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <ParticlesBackground />
      </div>

      {/*  Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
          scrolled || forceHeaderShrunk
            ? 'h-16 py-0 bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg'
            : 'h-[300px] sm:h-[300px] md:h-[300px] bg-cover bg-center shadow-md'
        }`}
        style={
          !(scrolled || forceHeaderShrunk)
            ? {
                backgroundImage: 'url(/images/header_back.jpg)',
                backgroundColor: 'rgba(0,0,0,0.3)',
                backgroundBlendMode: 'overlay',
                boxShadow: isHome
                  ? '0 1px 6px rgba(0, 0, 0, 0.2)' 
                  : '0 2px 6px rgba(0, 0, 0, 0.2)',
              }
            : isHome
            ? {
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
              }
            : {}
        }
      >
        <div className="flex flex-col h-full px-4 sm:px-6 pt-4 pb-6">
          <div className="flex justify-between items-center w-full h-full px-4 sm:px-6 mt-[5px]">
            <Link to="/" className="transition-all duration-500">
              {scrolled || forceHeaderShrunk ? (
                <span className="text-xl font-typewritter tracking-wider mt-[3px]">
                  N a s t r a d
                </span>
              ) : (
                <img
                  src="/images/Nastrad_full_logo.png"
                  alt="Nastrad Logo"
                  className="mt-[-100px] h-36 sm:h-44 object-contain"
                />
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`space-y-1 z-[100] ${scrolled || forceHeaderShrunk ? '' : 'mt-[-95px]'}`}
              aria-label="Menu"
            >
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
            </button>
          </div>

          {!scrolled && !forceHeaderShrunk && headerElements.length > 0 && (
            <div className="flex flex-col mt-[-65px] justify-center items-center text-center h-full px-4 animate-fade-in">
              <div className="max-w-4xl">
                {headerElements.map((el, i) =>
                  React.cloneElement(el, {
                    key: i,
                    className: `${el.props.className || ''} ${
                      el.type === 'h1'
                        ? 'mb-10 text-3xl md:text-4xl font-bold tracking-wider'
                        : 'mb-10 text-gray-300 text-sm leading-relaxed'
                    }`.trim(),
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/*  Animaux (taureau / ours) */}
      {!hideAnimals && (scrolled || forceHeaderShrunk) && (
        <>
          <div className="hidden lg:flex fixed inset-0 mt-24 items-center justify-between pointer-events-none z-0 transition-opacity duration-1000 opacity-100">
            <img
              src="/images/taureau.png"
              alt="Taureau"
              className="h-auto max-h-[70vh] glow-animal opacity-70"
            />
            <img
              src="/images/ours.png"
              alt="Ours"
              className="h-auto max-h-[70vh] glow-animal opacity-70"
            />
          </div>
          <div className="lg:hidden fixed inset-x-0 top-[45vh] flex flex-col items-center gap-16 z-0 pointer-events-none transition-opacity duration-1000 opacity-100">
            <img
              src="/images/taureau.png"
              alt="Taureau"
              className="w-[300px] sm:w-[340px] md:w-[380px] h-auto glow-animal opacity-70"
            />
            <img
              src="/images/ours.png"
              alt="Ours"
              className="w-[160px] sm:w-[200px] md:w-[240px] h-auto glow-animal opacity-70"
            />
          </div>
        </>
      )}

      {/*  Menu latéral */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 z-[60] transition-all duration-500 ease-in-out ${
          menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } shadow-lg pt-16`}
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

      {/*  Main */}
      <main className={`relative z-20 px-4 sm:px-6 lg:px-8 ${scrolled || forceHeaderShrunk ? 'pt-24' : 'pt-[350px]'}`}>
        <div className="max-w-screen-xl mx-auto">{contentElements}</div>
      </main>
    </div>
  );
}
