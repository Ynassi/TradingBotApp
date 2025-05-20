import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Overview from './pages/Overview.jsx';
import List from './pages/List.jsx';
import Fiche from './pages/Fiche.jsx';
import NotFound from './pages/NotFound.jsx';
import Fonctionnement from './pages/Fonctionnement.jsx';
import Extraction from './pages/fonctionnement/Extraction.jsx';
import Transformation from './pages/fonctionnement/Transformation.jsx';
import Clustering from './pages/fonctionnement/Clustering.jsx';
import Selection from './pages/fonctionnement/Selection.jsx';
import Enrichissement from './pages/fonctionnement/Enrichissement.jsx';
import Genfiches from './pages/fonctionnement/Genfiches.jsx';
import CompanyDirectory from './pages/CompanyDirectory.jsx';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fonctionnement" element={<Fonctionnement />} />
        <Route path="/fonctionnement/extraction" element={<Extraction />} />
        <Route path="/fonctionnement/transformation" element={<Transformation />} />
        <Route path="/fonctionnement/enrichissement" element={<Enrichissement />} />
        <Route path="/fonctionnement/clustering" element={<Clustering />} />
        <Route path="/fonctionnement/selection" element={<Selection />} />
        <Route path="/fonctionnement/genfiches" element={<Genfiches />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/companies" element={<CompanyDirectory />} />
        <Route path="/list/:type" element={<List />} />
        <Route path="/fiche/:ticker" element={<Fiche />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}