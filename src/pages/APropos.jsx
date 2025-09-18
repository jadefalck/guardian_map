import React from "react";

// Images
import JadeFront from "../assets/images/Jade2.jpg";
import JadeBack from "../assets/images/Jade.jpg";
import ThomasFront from "../assets/images/Thomas2.jpg";
import ThomasBack from "../assets/images/Thomas.jpg";
import BgFounders from "../assets/images/fond_a_propos_images.png";

// Newsletter
import NewsletterForm from "../components/NewsletterForm";

function FounderCard({ frontSrc, backSrc, name, role, children }) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Avatar Circle with flip/rotate effect (taille réduite) */}
      <div
        className="
          group relative h-44 w-44 md:h-56 md:w-56
          rounded-full
          border-4 border-white
          shadow-[0_18px_40px_-15px_rgba(0,0,0,0.45)]
          overflow-hidden
          transition-transform duration-500 ease-out
          hover:rotate-6 hover:scale-[1.04]
          bg-white
        "
      >
        {/* Back image (revealed on hover) */}
        <img
          src={backSrc}
          alt={`${name} - back`}
          className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
        />
        {/* Front image (visible by default) */}
        <img
          src={frontSrc}
          alt={`${name} - front`}
          className="absolute inset-0 h-full w-full object-cover opacity-100 group-hover:opacity-0 transition-opacity duration-500 ease-out"
        />
      </div>

      {/* Name / Role */}
      <h3 className="mt-4 text-lg md:text-xl font-semibold text-white">{name}</h3>
      <p className="text-sm text-white/85 font-medium">{role}</p>

      {/* Bio encadrée + texte justifié + contour */}
      <div className="mt-3 max-w-sm rounded-xl bg-white/95 p-4 shadow-md border border-[#1113a2]/30">
        <p className="text-black text-[15px]" style={{ textAlign: "justify" }}>
          {children}
        </p>
      </div>
    </div>
  );
}

export default function APropos() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== Hero (fond gris) ===== */}
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1113a2]">
          À propos de nous
        </h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Derrière GuardianMap, deux passionnés de l’océan qui ont décidé d’agir pour
          protéger ce qu’ils aiment le plus : la vie marine.
        </p>
      </section>

      {/* ===== Founders (fond dégradé bleu -> clair) ===== */}
      <section
        className="relative w-full bg-gradient-to-r from-[#1113a2]/90 via-[#1113a2]/70 to-[#1113a2]/40"
      >
        <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <FounderCard
            frontSrc={ThomasFront}
            backSrc={ThomasBack}
            name="Thomas"
            role="Co-fondateur"
          >
            <span className="text-[#1113a2] font-semibold">Aventurier</span> dans l’âme
            et passionné par la mer, Thomas apporte son{" "}
            <span className="text-[#1113a2] font-semibold">énergie</span> et son sens de
            l’<span className="text-[#1113a2] font-semibold">organisation</span> pour que
            GuardianMap devienne une réalité.
          </FounderCard>

          <FounderCard
            frontSrc={JadeFront}
            backSrc={JadeBack}
            name="Jade"
            role="Co-fondatrice"
          >
            <span className="text-[#1113a2] font-semibold">Plongeuse</span> passionnée et
            amoureuse des voyages, Jade met sa{" "}
            <span className="text-[#1113a2] font-semibold">créativité</span> et sa{" "}
            <span className="text-[#1113a2] font-semibold">vision</span> au service d’un
            tourisme marin plus respectueux.
          </FounderCard>
        </div>
      </section>

      {/* ===== Pourquoi (fond gris + titres bleus, 2 colonnes plein écran) ===== */}
      {/* Bande titre */}
      <section className="w-full bg-gray-100">
        <div className="px-6 py-10 md:py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1113a2]">
            Pourquoi avoir créé GuardianMap ?
          </h2>
        </div>
      </section>

      {/* Deux colonnes : Problème / Solution */}
      <section className="w-full bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Le problème */}
            <div className="rounded-xl border border-[#1113a2]/25 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-[#1113a2] mb-3">Le problème</h3>
              <p className="text-black" style={{ textAlign: "justify" }}>
                Beaucoup de touristes, sans mauvaise intention, ne savent pas toujours
                comment adopter les bons comportements face à l’océan.{" "}
                <span className="italic">On ne naît pas bon touriste, on l’apprend.</span>
                <br />
                <br />
                Mais du coup le paradoxe est cruel : on paie pour voir la beauté marine...
                et on participe à sa destruction.
              </p>
            </div>

            {/* La solution */}
            <div className="rounded-xl border border-[#1113a2]/25 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-[#1113a2] mb-3">La solution</h3>
              <p className="text-black" style={{ textAlign: "justify" }}>
                C’est pour ça que nous avons créé{" "}
                <span className="text-[#1113a2] font-semibold">GuardianMap</span> : la
                plateforme de réservation d’activités touristiques marines qui révolutionne
                la protection des océans. La{" "}
                <span className="text-[#1113a2] font-semibold">sensibilisation</span> ? C’est
                notre deuxième arme secrète ! Notre but :{" "}
                <span className="text-[#1113a2] font-semibold">
                  valoriser les bonnes pratiques de voyage
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer (Contact + Newsletter) ===== */}
      <div className="bg-[#1113a2] py-12 px-6 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12 md:gap-8">
          {/* Contact */}
          <div className="md:w-1/2">
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="mb-2">
              📧 Mail :{" "}
              <a href="mailto:gdm.guardianmap@gmail.com" className="underline hover:text-gray-300">
                gdm.guardianmap@gmail.com
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
      </div>
    </div>
  );
}
