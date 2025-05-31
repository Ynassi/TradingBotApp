import React, { useEffect } from 'react';

export default function ParticlesBackground() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/particles.min.js';
    script.async = true;
    script.onload = () => {
      window.particlesJS.load('particles-js', '/particles.json', () => {
        console.log('✅ Particules chargées');
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      id="particles-js"
      className="fixed inset-0 -z-10"
      style={{ pointerEvents: 'none' }} // ⛔ empêche tout clic
    />
  );
}
