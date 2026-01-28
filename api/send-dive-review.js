// api/send-dive-review.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    const data = req.body || {};

    console.log("send-dive-review payload:", data);

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

    await transporter.verify(); // 🔥 si ça passe pas, tu le sauras

    const info = await transporter.sendMail({
      from: `"GuardianMap – Avis plongée" <${EMAIL_USER}>`,
      to: MAIL_TO,
      subject: `Nouvel avis plongée — ${data.centerName || "Centre"}`,
      text: [
        `Centre: ${data.centerName || ""}`,
        `Pays: ${data.country || ""}`,
        `Nom: ${data.userName || ""}`,
        `Note: ${data.rating || ""}`,
        `Commentaire: ${data.comment || ""}`,
        `Page: ${data.page || ""}`,
        `Date: ${data.createdAt || ""}`,
      ].join("\n"),
    });

    console.log("Email sent:", info?.messageId || info);

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("SEND_DIVE_REVIEW_ERROR:", e);
    return res.status(500).json({
      ok: false,
      error: e?.code || e?.message || "send_failed",
    });
  }
}
