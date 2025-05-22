import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
// 🌍 Patch global fetch → injecte automatiquement l'URL backend
const originalFetch = window.fetch;
const baseURL = import.meta.env.VITE_API_URL;

window.fetch = async (input, init = {}) => {
  if (typeof input === "string" && input.startsWith("/")) {
    input = `${baseURL}${input}`;
  }
  return originalFetch(input, init);
};

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
