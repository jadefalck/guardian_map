import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Knowledge from "./pages/Knowledge";
import Partenaires from "./pages/Partenaires";
import { MapContainer, TileLayer } from 'react-leaflet';
import { motion } from "framer-motion";
import 'leaflet/dist/leaflet.css';
import CarteAvecEffet from "./components/CarteAvecEffet";
import TitreSite from './assets/images/titre1.png';
import logo from './assets/images/logo.png';
import SeasonalFish from './components/SeasonalFish';
import ConditionsMeteo from './components/ConditionsMeteo';
import { useState } from "react";
import Philippines from "./pages/pays/Philippines";
import Indonesie from "./pages/pays/Indonesie";
import Thailande from "./pages/pays/Thailande";
import Malaisie from "./pages/pays/Malaisie";
import Japon from "./pages/pays/Japon";
import Vietnam from "./pages/pays/Vietnam";
import Maldives from "./pages/pays/Maldives";
import APropos from "./pages/APropos";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import LabelsCertifications from "./pages/LabelsCertifications";

export default function App() {
  const [selectedMonth, setSelectedMonth] = useState("Janvier");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      {/* Bande bleue foncée avec le titre */}
      <header className="bg-[#1113a2] py-6 flex justify-center items-center">
        <img
          src={TitreSite}
          alt="GDM"
          className="h-12 object-contain"
        />
      </header>

      {/* Barre de navigation responsive */}
      <nav className="sticky top-2 z-[999] bg-white/60 backdrop-blur-md shadow-sm px-4 md:px-6 py-2 rounded-xl mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          {/* Logo + Titre */}
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
            <span className="text-[#1113a2] font-bold text-lg">GuardianMap</span>
          </div>

          {/* Bouton hamburger (mobile) */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#1113a2]"
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {/* Icône burger / croix */}
            {menuOpen ? (
              // Croix
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Burger
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Liens de navigation (desktop) */}
          <div className="hidden md:flex space-x-6 text-sm">
            <Link to="/" className="text-gray-700 hover:text-[#1113a2]">Home</Link>
            <Link to="/labels" className="text-gray-700 hover:text-[#1113a2]">Labels &amp; Certifications</Link>
            <Link to="/services" className="text-gray-700 hover:text-[#1113a2]">Services</Link>
            <Link to="/blog" className="text-gray-700 hover:text-[#1113a2]">Blog</Link>
            <Link to="/apropos" className="text-gray-700 hover:text-[#1113a2]">À propos</Link>
          </div>
        </div>

        {/* Menu déroulant (mobile) */}
        <div
          className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${menuOpen ? "max-h-64" : "max-h-0"}`}
        >
          <div className="mt-2 flex flex-col rounded-lg bg-white/80 shadow-sm text-sm">
            <Link onClick={() => setMenuOpen(false)} to="/" className="px-4 py-3 border-b border-gray-200 hover:text-[#1113a2]">Home</Link>
            <Link onClick={() => setMenuOpen(false)} to="/labels" className="px-4 py-3 border-b border-gray-200 hover:text-[#1113a2]">Labels &amp; Certifications</Link>
            <Link onClick={() => setMenuOpen(false)} to="/services" className="px-4 py-3 border-b border-gray-200 hover:text-[#1113a2]">Services</Link>
            <Link onClick={() => setMenuOpen(false)} to="/blog" className="px-4 py-3 border-b border-gray-200 hover:text-[#1113a2]">Blog</Link>
            <Link onClick={() => setMenuOpen(false)} to="/apropos" className="px-4 py-3 hover:text-[#1113a2]">À propos</Link>
          </div>
        </div>
      </nav>

      {/* Contenu */}
      <main className="pt-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/partenaires" element={<Partenaires />} />
          <Route path="/philippines" element={<Philippines />} />
          <Route path="/indonesie" element={<Indonesie />} />
          <Route path="/thailande" element={<Thailande />} />
          <Route path="/malaisie" element={<Malaisie />} />
          <Route path="/japon" element={<Japon />} />
          <Route path="/vietnam" element={<Vietnam />} />
          <Route path="/maldives" element={<Maldives />} />
          <Route path="/labels" element={<LabelsCertifications />} />
          <Route path="/apropos" element={<APropos />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </main>
    </Router>
  );
}


/*import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
//import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}*/

//export default App
