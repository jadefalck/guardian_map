import React, { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [trap, setTrap] = useState(""); // honeypot 'website'

  const onSubmit = async (e) => {
    e.preventDefault();
    if (trap) return; // bot

    const value = email.trim().toLowerCase();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!re.test(value)) {
      setStatus("error");
      setMessage("Adresse e-mail invalide.");
      return;
    }

    try {
      setStatus("loading");
      const res = await fetch("https://guardianmap.com/api/newsletter.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });

      const payload = await res.json().catch(() => ({}));

      if (res.ok && payload?.ok) {
        setStatus("success");
        setMessage("Merci ! (déjà inscrit·e si c’était le cas) ✅");
        setEmail("");
      } else {
        // Erreurs prévues par le PHP: 400 avec {error: "..."} ou 500
        setStatus("error");
        setMessage(payload?.error || "Erreur serveur.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Erreur réseau.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-4">
      {/* Honeypot anti-bot (même nom que le PHP) */}
      <input
        type="text"
        name="website"
        value={trap}
        onChange={(e) => setTrap(e.target.value)}
        className="hidden"
        tabIndex="-1"
        autoComplete="off"
      />

      <input
        type="email"
        placeholder="Ton adresse e-mail"
        className="w-full sm:w-auto px-4 py-2 rounded-lg text-black focus:outline-none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-white text-[#1113a2] px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Envoi…" : "S'inscrire"}
      </button>

      {message && (
        <p
          className={`text-sm mt-1 ${
            status === "error" ? "text-red-500" : "text-green-600"
          } sm:ml-2`}
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  );
}
