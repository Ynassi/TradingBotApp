import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
// 🌍 Patch global fetch → redirige tous les appels vers le backend Render
const originalFetch = window.fetch;
const baseURL = import.meta.env.VITE_API_URL;  // défini dans .env

window.fetch = async (input, init = {}) => {
  if (typeof input === "string") {
    const apiRoutes = {
      "/overview-data": "/api/overview-data",
      "/headline-summary": "/api/headline-summary",
      "/df_final_merged": "/api/df_final_merged",
      "/companies": "/api/companies",
      "/analyze": "/api/mistral-analyze",
    };

    if (input.startsWith("/data/")) {
      input = `${baseURL}/api${input}`;
    } else if (apiRoutes[input]) {
      input = `${baseURL}${apiRoutes[input]}`;
    } else if (input.startsWith("/")) {
      input = `${baseURL}${input}`;
    }
  }

  return originalFetch(input, init);
};


