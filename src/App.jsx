import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";

// Pages principales
import Accueil from "./pages/Accueil";
import Knowledge from "./pages/Knowledge";
import Partenaires from "./pages/Partenaires";
import APropos from "./pages/APropos";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import LabelsCertifications from "./pages/LabelsCertifications";
import Circuits from "./pages/Circuits";

// Blog articles
import RequinsBaleines from "./pages/blog/RequinsBaleines";
import WorldMaritimeDay from "./pages/blog/WorldMaritimeDay";
import Oman from "./pages/blog/Oman";

// Activités
import Activites from "./pages/activites/Activités";
import Plongée from "./pages/activites/Plongée";

// Pays
import Philippines from "./pages/pays/Philippines";
import Indonesie from "./pages/pays/Indonesie";
import Thailande from "./pages/pays/Thailande";
import Malaisie from "./pages/pays/Malaisie";
import Japon from "./pages/pays/Japon";
import Vietnam from "./pages/pays/Vietnam";
import Maldives from "./pages/pays/Maldives";

// Autres routes
import ContinentRouter from "./pages/ContinentRouter";
import CountryPage from "./pages/pays2/CountryPage";

// Components
import NewsletterForm from "./components/NewsletterForm";

// Assets
import logo from "./assets/images/logo.png";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [activitiesOpenMobile, setActivitiesOpenMobile] = useState(false);

  return (
    <Router>
      {/* ======= HEADER ======= */}
      <header className="bg-[#1113a2] py-6 flex justify-center items-center">
        <h1 className="text-white font-extrabold text-3xl tracking-normal">
          <span className="text-4xl">G</span>UARDIAN
          <span className="text-4xl">M</span>AP
        </h1>
      </header>

      {/* ======= NAVBAR ======= */}
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
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Liens desktop */}
          <div className="hidden md:flex space-x-6 text-sm">
            <Link to="/" className="text-gray-700 hover:text-[#1113a2]">Accueil</Link>

            {/* Activités */}
            <div
              className="relative"
              onMouseEnter={() => setActivitiesOpen(true)}
              onMouseLeave={() => setActivitiesOpen(false)}
            >
              <Link
                to="/activites"
                className="text-gray-700 hover:text-[#1113a2] inline-flex items-center gap-1"
              >
                Activités
                <span className={`transition-transform ${activitiesOpen ? "rotate-180" : ""}`}>▾</span>
              </Link>

              {activitiesOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-lg bg-white shadow-lg ring-1 ring-black/5 py-2">
                  <Link
                    to="/plongée"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Plongée
                  </Link>
                </div>
              )}
            </div>

            <Link to="/circuits" className="text-gray-700 hover:text-[#1113a2]">Circuits</Link>
            <Link to="/blog" className="text-gray-700 hover:text-[#1113a2]">Blog</Link>
            <Link to="/apropos" className="text-gray-700 hover:text-[#1113a2]">À propos</Link>
          </div>
        </div>

        {/* Menu mobile */}
        <div className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${menuOpen ? "max-h-96" : "max-h-0"}`}>
          <div className="mt-2 flex flex-col rounded-lg bg-gray-50/95 shadow-sm text-sm">
            <Link onClick={() => setMenuOpen(false)} to="/" className="px-4 py-3 border-b border-gray-200 text-gray-800 hover:text-[#1113a2]">Accueil</Link>
            <Link onClick={() => setMenuOpen(false)} to="/services" className="px-4 py-3 border-b border-gray-200 text-gray-800 hover:text-[#1113a2]">Services</Link>
            <Link onClick={() => setMenuOpen(false)} to="/blog" className="px-4 py-3 border-b border-gray-200 text-gray-800 hover:text-[#1113a2]">Blog</Link>
            <Link onClick={() => setMenuOpen(false)} to="/apropos" className="px-4 py-3 text-gray-800 hover:text-[#1113a2]">À propos</Link>

            {/* Sous-menu Activités */}
            <button
              className="px-4 py-3 text-left border-t border-gray-200 text-gray-800 flex items-center justify-between"
              onClick={() => setActivitiesOpenMobile(v => !v)}
            >
              <span>Activités</span>
              <span className={`transform transition ${activitiesOpenMobile ? "rotate-180" : ""}`}>▾</span>
            </button>
            {activitiesOpenMobile && (
              <div className="pl-6 pb-2">
                <Link
                  onClick={() => { setMenuOpen(false); setActivitiesOpenMobile(false); }}
                  to="/plongée"
                  className="block px-2 py-2 text-gray-700 hover:text-[#1113a2]"
                >
                  Plongée
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ======= ROUTES ======= */}
      <main className="pt-0">
        <Routes>
          <Route path="/" element={<Accueil />} />
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
          <Route path="/blog/requins-baleines" element={<RequinsBaleines />} />
          <Route path="/blog/world-maritime-day" element={<WorldMaritimeDay />} />
          <Route path="/circuits" element={<Circuits />} />
          <Route path="/activites" element={<Activites />} />
          <Route path="/plongée" element={<Plongée />} />
          <Route path="/continents/:slug" element={<ContinentRouter />} />
          <Route path="/pays2/:slug" element={<CountryPage />} />
          <Route path="/blog/oman" element={<Oman />} />
        </Routes>
      </main>

      {/* ======= FOOTER GLOBAL ======= */}
      <footer className="bg-[#1113a2] py-12 px-6 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12 md:gap-8">
          {/* Contact */}
          <div className="md:w-1/2">
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="mb-2">
              📧 Mail :{" "}
              <a href="mailto:contact@guardianmap.com" className="underline hover:text-gray-300">
                contact@guardianmap.com
              </a>
            </p>
            <p>
              📸 Instagram :{" "}
              <a
                href="https://instagram.com/guardianmap"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-300"
              >
                @guardianmap
              </a>
            </p>
          </div>

          {/* Séparateur */}
          <div className="hidden md:block w-px h-28 bg-white/30" />

          {/* Newsletter */}
          <div className="md:w-1/2">
            <h3 className="text-xl font-bold mb-4 text-white">Reste informé(e)</h3>
            <p className="mb-4">Inscris-toi pour suivre le développement de GuardianMap.</p>
            <NewsletterForm />
          </div>
        </div>
      </footer>
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
