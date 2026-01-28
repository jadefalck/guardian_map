import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    const data = req.body || {};
    console.log("send-dive-abuse payload:", data);

    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASS = process.env.EMAIL_PASS;
    const MAIL_TO = process.env.MAIL_TO || EMAIL_USER;

    if (!EMAIL_USER || !EMAIL_PASS) {
      console.error("Missing env vars", { hasUser: !!EMAIL_USER, hasPass: !!EMAIL_PASS });
      return res.status(500).json({ ok: false, error: "missing_env_vars" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });

    await transporter.verify();

    const abuses = data.abuses || {};
    const abuseList = [
      abuses.feeding ? "Nourrissage" : null,
      abuses.touch ? "Toucher l’animal" : null,
      abuses.chase ? "Poursuite/harcèlement" : null,
      abuses.overcrowded ? "Trop de bateaux" : null,
      abuses.distance ? "Non-respect distances" : null,
    ].filter(Boolean);

    const info = await transporter.sendMail({
      from: `"GuardianMap – Signalement plongée" <${EMAIL_USER}>`,
      to: MAIL_TO,
      subject: `🚩 Signalement non-éthique — ${data.operator || "Centre"}`,
      text: [
        `Nom du centre: ${data.operator || ""}`,
        `Pays: ${data.country || ""}`,
        `Espèce (optionnel): ${data.animal || ""}`,
        ``,
        `Abus signalés: ${abuseList.length ? abuseList.join(", ") : "Non précisé"}`,
        ``,
        `Détails / preuve: ${data.details || ""}`,
        ``,
        `Page: ${data.page || ""}`,
        `Date: ${data.createdAt || ""}`,
      ].join("\n"),
    });

    console.log("Email sent (abuse):", info?.messageId || info);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("SEND_DIVE_ABUSE_ERROR:", e);
    return res.status(500).json({ ok: false, error: e?.code || e?.message || "send_failed" });
  }
}
