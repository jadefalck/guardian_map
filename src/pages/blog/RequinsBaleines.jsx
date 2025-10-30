import React from "react";
import { Link } from "react-router-dom";
import requinBaleineImg from "../../assets/images/articles_blog/requin_baleine_tourisme.jpg";
import NewsletterForm from "../../components/NewsletterForm";

export default function RequinsBaleines() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-100 py-10 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1113a2]">
          Requins-baleines : quand le rêve devient un danger
        </h1>
        <p className="mt-3 text-gray-700 max-w-3xl mx-auto">
          Comprendre les impacts du nourrissage et adopter des rencontres responsables.
        </p>
      </header>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-6 py-10 text-gray-700">
        <img
          src={requinBaleineImg}
          alt="Tourisme autour des requins-baleines"
          className="rounded-2xl shadow mb-8 w-full max-h-[480px] object-cover"
        />

        <p className="mb-4" style={{ textAlign: "justify" }}>
          Qui n’a jamais rêvé de voir un requin-baleine ? Ce géant des océans fascine.
          Avec ses 10 à 12 mètres de long, il est l’un des animaux marins les plus majestueux
          que l’on puisse rencontrer. Mais derrière l’image de carte postale, une question
          dérangeante se cache :{" "}
          <strong>
            que sacrifie-t-on pour garantir aux touristes ce spectacle à 100 % ?
          </strong>
        </p>

        <p className="mb-4" style={{ textAlign: "justify" }}>
          Dans certaines destinations, les requins-baleines sont nourris pour être sûrs
          d’être vus. Résultat : les bateaux affluent, les touristes se pressent dans
          l’eau, et l’animal devient une attraction programmée. Sauf qu’en le nourrissant,
          on bouleverse totalement son mode de vie.
        </p>

        <p className="mb-4" style={{ textAlign: "justify" }}>
          Normalement, un requin-baleine parcourt des{" "}
          <strong>milliers de kilomètres par an</strong> pour chercher sa nourriture. Ces
          déplacements sont essentiels à sa santé et à sa longévité. Mais lorsqu’il est
          nourri toujours au même endroit, il cesse de migrer. Conséquence dramatique :{" "}
          <strong>son espérance de vie peut chuter de manière significative</strong>.
        </p>

        <h2 className="text-xl font-semibold text-[#1113a2] mt-6 mb-3">
          Comment choisir une sortie responsable ?
        </h2>
        <ul className="list-disc list-inside mb-6">
          <li>
            Méfiez-vous des <strong>promesses de garantie</strong> (« remboursement si pas
            de requin-baleine »). Souvent, cela traduit des pratiques de nourrissage.
          </li>
          <li>
            Préférez les opérateurs qui <strong>nourrissent pas</strong> la faune et
            observent discrètement l’animal quand il apparaît naturellement.
          </li>
          <li>
            Respectez les distances, évitez de couper la trajectoire de l’animal et{" "}
            <strong>restez en surface</strong> si c’est la règle locale.
          </li>
        </ul>

        <blockquote className="border-l-4 border-[#1113a2] pl-4 italic text-gray-800 mb-6">
          Le vrai luxe n’est pas de voir un requin-baleine à coup sûr. C’est de le croiser
          libre, sauvage, dans son environnement naturel — sans l’avoir mis en danger pour
          un selfie.
        </blockquote>

        <Link
          to="/blog"
          className="inline-block rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2"
        >
          ← Retour au blog
        </Link>
      </article>

    </div>
  );
}
