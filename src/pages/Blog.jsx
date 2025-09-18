import React from "react";
import requinBaleineImg from "../assets/images/articles_blog/requin_baleine_tourisme.jpg";
import NewsletterForm from "../components/NewsletterForm"; // ✅ ajout

export default function Blog() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gray-100 py-12 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1113a2]">
          On ne naît pas bon touriste, on l’apprend
        </h1>
        <p className="mt-3 text-gray-700 max-w-2xl mx-auto">
          Ici, on informe, on sensibilise et on partage : les bonnes pratiques à suivre
          et les mauvaises habitudes à oublier. Le tourisme peut protéger… ou détruire.
        </p>
      </section>

      {/* Article requin baleine */}
      <article className="mx-auto max-w-4xl px-6 py-12">
        <img
          src={requinBaleineImg}
          alt="Tourisme autour des requins-baleines"
          className="rounded-2xl shadow-md mb-8 object-cover w-full max-h-[450px]"
        />
        <h2 className="text-2xl md:text-3xl font-bold text-[#1113a2] mb-4">
          Requins-baleines : quand le rêve devient un danger
        </h2>
        <p className="text-gray-700 mb-4" style={{ textAlign: "justify" }}>
          Qui n’a jamais rêvé de voir un requin-baleine ? Ce géant des océans fascine.
          Avec ses 10 à 12 mètres de long, il est l’un des animaux marins les plus
          majestueux que l’on puisse rencontrer. Mais derrière l’image de carte postale,
          une question dérangeante se cache :{" "}
          <span className="font-semibold text-[#1113a2]">
            que sacrifie-t-on pour garantir aux touristes ce spectacle à 100 % ?
          </span>
        </p>

        <p className="text-gray-700 mb-4" style={{ textAlign: "justify" }}>
          Dans certaines destinations, les requins-baleines sont nourris pour être sûrs
          d’être vus. Résultat : les bateaux affluent, les touristes se pressent dans
          l’eau, et l’animal devient une attraction programmée. Sauf qu’en le nourrissant,
          on bouleverse totalement son mode de vie.
        </p>

        <p className="text-gray-700 mb-4" style={{ textAlign: "justify" }}>
          Normalement, un requin-baleine parcourt des{" "}
          <span className="font-semibold text-[#1113a2]">milliers de kilomètres par an</span>{" "}
          pour chercher sa nourriture. Ces déplacements sont essentiels à sa santé et à
          sa longévité. Mais lorsqu’il est nourri toujours au même endroit, il cesse de
          migrer. Conséquence dramatique :{" "}
          <span className="font-semibold text-[#1113a2]">
            son espérance de vie est divisée par deux
          </span>
          . Moins de temps pour se reproduire, moins de chances de survie pour l’espèce.
        </p>

        <p className="text-gray-700 mb-4" style={{ textAlign: "justify" }}>
          Alors, comment savoir si une activité est respectueuse ? C’est simple :{" "}
          <span className="font-semibold text-[#1113a2]">
            méfiez-vous des promesses de garantie
          </span>
          . Si une sortie vous propose un remboursement de 25 % si vous ne voyez pas de
          requin-baleine, posez-vous la question. Souvent, cela veut dire qu’un guide est
          payé pour nourrir ou perturber les animaux afin d’assurer le spectacle.
        </p>

        <p className="text-gray-700 mb-8" style={{ textAlign: "justify" }}>
          À l’inverse, les véritables opérateurs responsables ne nourrissent pas les
          requins-baleines. Leur rôle est d’<span className="font-semibold text-[#1113a2]">
            observer discrètement
          </span>{" "}
          la mer, de les repérer lorsqu’ils apparaissent naturellement, et de garantir
          que l’expérience reste unique, rare… et surtout respectueuse.
        </p>

        <div className="bg-[#1113a2]/10 border-l-4 border-[#1113a2] p-5 rounded-lg shadow-sm">
          <p className="text-gray-800 font-medium" style={{ textAlign: "justify" }}>
            Le vrai luxe n’est pas de voir un requin-baleine à coup sûr. C’est de pouvoir
            le croiser libre, sauvage, dans son environnement naturel, sans l’avoir mis
            en danger pour un selfie.
          </p>
        </div>
      </article>

      {/* Footer (Contact + Newsletter) */}
      <div className="bg-[#1113a2] py-12 px-6 text-white">
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
            <NewsletterForm /> {/* ✅ fonctionne maintenant */}
          </div>
        </div>
      </div>
    </div>
  );
}
