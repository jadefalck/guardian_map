// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

// Pages principales
import Accueil from "./pages/Accueil";
import APropos from "./pages/APropos";
import Blog from "./pages/Blog";
import Circuits from "./pages/Circuits";
import Especes from "./pages/Especes";
import Voyages from "./pages/Voyages";
import Zones from "./pages/Zones_protegees";

import Afrique from "./pages/continents/Afrique";

// Blog articles
import RequinsBaleines from "./pages/blog/RequinsBaleines";
import WorldMaritimeDay from "./pages/blog/WorldMaritimeDay";
import Oman from "./pages/blog/Oman";
import TortuesVertes from "./pages/blog/TortuesVertes";
import CorauxBlancs from "./pages/blog/CorauxBlancs";
import AileronsRequinsADN from "./pages/blog/AileronsRequinsADN";

// Activités
import Activites from "./pages/activites/Activités";
import Plongée from "./pages/activites/Plongée";
import Observation from "./pages/activites/Observation";

// Espèces
import RequinBaleine from "./pages/especes/RequinBaleine";

import GuideVoyage from "./pages/Guide_Voyage";

// Assets
import logo from "./assets/images/logo.png";

// i18n
import { useTranslation } from "react-i18next";
import drapeauFR from "./assets/images/drapeau_france.svg.png";
import drapeauEN from "./assets/images/drapeau_anglais.svg.png";

/** ✅ Scroll to top on route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { t, i18n } = useTranslation();
  const changeLanguage = (lang) => i18n.changeLanguage(lang);

  return (
    <>
      <ScrollToTop />

      {/* ===== HEADER — CLIQUABLE ===== */}
      <header className="bg-[#1113a2] py-6 flex justify-center items-center">
        <Link to="/" aria-label="Retour à l’accueil" className="flex justify-center items-center">
          <h1 className="text-white font-extrabold text-3xl tracking-normal">
            <span className="text-4xl">G</span>UARDIAN
            <span className="text-4xl">M</span>AP
          </h1>
        </Link>
      </header>

      {/* ===== NAVBAR (menu simplifié) ===== */}
      <nav className="sticky top-2 z-[999] bg-white/60 backdrop-blur-md shadow-sm px-4 md:px-6 py-2 rounded-xl mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Logo + nom */}
            <Link to="/" aria-label="Accueil" className="flex items-center space-x-2 group">
              <img src={logo} alt="Logo GuardianMap" className="h-8 w-8 object-contain" />
              <span className="text-[#1113a2] font-bold text-lg group-hover:underline">GuardianMap</span>
            </Link>

            {/* Sélecteur FR/EN (desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <div
                onClick={() => changeLanguage("fr")}
                className={`h-7 w-7 rounded-full flex items-center justify-center cursor-pointer border 
                  ${i18n.language === "fr" ? "border-[#1113a2]" : "border-gray-300 opacity-60"} 
                  hover:opacity-100 bg-white shadow-sm`}
                aria-label="Français"
                role="button"
                tabIndex={0}
              >
                <img src={drapeauFR} alt="FR" className="h-4 w-4 rounded-full" />
              </div>

              <div
                onClick={() => changeLanguage("en")}
                className={`h-7 w-7 rounded-full flex items-center justify-center cursor-pointer border 
                  ${i18n.language === "en" ? "border-[#1113a2]" : "border-gray-300 opacity-60"} 
                  hover:opacity-100 bg-white shadow-sm`}
                aria-label="English"
                role="button"
                tabIndex={0}
              >
                <img src={drapeauEN} alt="EN" className="h-4 w-4 rounded-full" />
              </div>
            </div>
          </div>

          {/* Hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-900 hover:bg-white/70"
            aria-label="Ouvrir le menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Menu Desktop : Accueil, Voyages, Blog, A propos */}
          <div className="hidden md:flex space-x-6 text-sm">
            <Link to="/" className="text-gray-700 hover:text-[#1113a2]">
              {t("menu.home")}
            </Link>
            <Link to="/voyages" className="text-gray-700 hover:text-[#1113a2]">
              {t("menu.voyages")}
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-[#1113a2]">
              {t("menu.blog")}
            </Link>
            <Link to="/apropos" className="text-gray-700 hover:text-[#1113a2]">
              {t("menu.about")}
            </Link>
          </div>
        </div>

        {/* Menu Mobile : Accueil, Voyages, Blog, A propos + langue */}
        <div
          className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${
            menuOpen ? "max-h-[70vh]" : "max-h-0"
          }`}
        >
          <div className="mt-2 flex flex-col rounded-lg bg-white shadow-md text-base text-gray-800">
            <Link
              onClick={() => setMenuOpen(false)}
              to="/"
              className="px-4 py-3 border-b border-gray-200 hover:bg-gray-50"
            >
              {t("menu.home")}
            </Link>

            <Link
              onClick={() => setMenuOpen(false)}
              to="/voyages"
              className="px-4 py-3 border-b border-gray-200 hover:bg-gray-50"
            >
              {t("menu.voyages")}
            </Link>

            <Link
              onClick={() => setMenuOpen(false)}
              to="/blog"
              className="px-4 py-3 border-b border-gray-200 hover:bg-gray-50"
            >
              {t("menu.blog")}
            </Link>

            <Link
              onClick={() => setMenuOpen(false)}
              to="/apropos"
              className="px-4 py-3 border-b border-gray-200 hover:bg-gray-50"
            >
              {t("menu.about")}
            </Link>

            {/* Sélecteur de langue mobile */}
            <div className="flex gap-3 px-4 py-3 border-t border-gray-200">
              <img
                src={drapeauFR}
                alt="FR"
                onClick={() => changeLanguage("fr")}
                className={`h-6 w-6 cursor-pointer ${i18n.language === "fr" ? "opacity-100" : "opacity-50"}`}
              />
              <img
                src={drapeauEN}
                alt="EN"
                onClick={() => changeLanguage("en")}
                className={`h-6 w-6 cursor-pointer ${i18n.language === "en" ? "opacity-100" : "opacity-50"}`}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* ===== ROUTES ===== */}
      <main className="pt-0">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/apropos" element={<APropos />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/requins-baleines" element={<RequinsBaleines />} />
          <Route path="/blog/world-maritime-day" element={<WorldMaritimeDay />} />
          <Route path="/blog/ailerons-requins-adn" element={<AileronsRequinsADN />} />
          <Route path="/blog/oman" element={<Oman />} />
          <Route path="/circuits" element={<Circuits />} />
          <Route path="/activites" element={<Activites />} />
          <Route path="/plongée" element={<Plongée />} />
          <Route path="/observation" element={<Observation />} />
          <Route path="/especes" element={<Especes />} />
          <Route path="/blog/tortues-vertes" element={<TortuesVertes />} />
          <Route path="/blog/coraux-blancs" element={<CorauxBlancs />} />
          <Route path="/voyages" element={<Voyages />} />
          <Route path="/activites/observation" element={<Observation />} />
          <Route path="/activites/plongée" element={<Plongée />} />
          <Route path="/especes/requin_baleine" element={<RequinBaleine />} />
          <Route path="/guide-voyage" element={<GuideVoyage />} />
          <Route path="/zones" element={<Zones />} />
          <Route path="/continents/afrique" element={<Afrique />} />
        </Routes>
      </main>

      {/* ===== FOOTER (sans newsletter, avec navigation) ===== */}
      <footer className="bg-[#1113a2] py-12 px-6 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          {/* Contact */}
          <div className="md:w-1/2">
            <h3 className="text-xl font-bold mb-4">{t("footer.contact.title")}</h3>
            <p className="mb-2">
              {t("footer.contact.email")} :{" "}
              <a href="mailto:contact@guardianmap.com" className="underline hover:text-gray-300">
                contact@guardianmap.com
              </a>
            </p>
            <p>
              {t("footer.contact.instagram")} :{" "}
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

          {/* Navigation du site */}
          <div className="md:w-1/2">
            <h3 className="text-xl font-bold mb-4">Navigation</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Link to="/" className="hover:underline">
                {t("menu.home")}
              </Link>
              <Link to="/voyages" className="hover:underline">
                {t("menu.voyages")}
              </Link>
              <Link to="/blog" className="hover:underline">
                {t("menu.blog")}
              </Link>
              <Link to="/apropos" className="hover:underline">
                {t("menu.about")}
              </Link>

              {/* Liens utiles internes (optionnels) */}

            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => changeLanguage("fr")}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                  i18n.language === "fr" ? "border-white bg-white/10" : "border-white/40 hover:bg-white/10"
                }`}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => changeLanguage("en")}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                  i18n.language === "en" ? "border-white bg-white/10" : "border-white/40 hover:bg-white/10"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/20 text-xs text-white/80 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} GuardianMap — Tous droits réservés.</p>
          <p className="opacity-90">Plongée & observation responsables • Cartes & guides éthiques</p>
        </div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
