export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  try {
    const { name, email, message } = req.body || {};

    if (!email || !message) {
      return res.status(400).json({ ok: false, error: "Missing email or message" });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO_EMAIL = process.env.TO_EMAIL;
    const FROM_EMAIL = process.env.FROM_EMAIL;

    if (!RESEND_API_KEY || !TO_EMAIL || !FROM_EMAIL) {
      return res.status(500).json({ ok: false, error: "Missing env vars (RESEND_API_KEY, TO_EMAIL, FROM_EMAIL)" });
    }

    const payload = {
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `SVRNOS — Early Access Request${name ? ` — ${name}` : ""}`,
      reply_to: email,
      text: [
        `Name: ${name || "(not provided)"}`,
        `Email: ${email}`,
        "",
        `Message:`,
        message,
      ].join("\n"),
    };

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await r.json();

    if (!r.ok) {
      return res.status(500).json({ ok: false, error: data?.message || "Resend error", data });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
