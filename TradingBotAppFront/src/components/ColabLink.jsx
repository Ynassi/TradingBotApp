import React from 'react';
import colabLogo from '../assets/images/google_colab_logo.png';

export default function ColabLink({ href, label }) {
  return (
    <div className="mt-10 text-center colab_link">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center font-semibold text-base hover:text-teal-400 transition"
      >
        <img src={colabLogo} alt="Google Colab Logo" className="h-6 mr-3" />
        {label || "Voir le notebook sur Google Colab"}
      </a>
    </div>
  );
}
