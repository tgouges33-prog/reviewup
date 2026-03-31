export const runtime = "nodejs";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const { channel, recipient, link_url, business_name } = await request.json();

  if (!channel || !recipient || !link_url) {
    return Response.json({ error: "Données manquantes" }, { status: 400 });
  }

  if (channel === "email") {
    if (!resend) {
      return Response.json({ error: "Email non configuré (RESEND_API_KEY manquant)" }, { status: 500 });
    }
    await resend.emails.send({
      from: "ReviewUp <onboarding@resend.dev>",
      to: recipient,
      subject: `Votre avis compte pour ${business_name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1f2937;">Bonjour,</h2>
          <p style="color: #4b5563;">Votre avis est précieux pour <strong>${business_name}</strong>.</p>
          <p style="color: #4b5563;">Cela prend moins d'une minute — cliquez ci-dessous :</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${link_url}"
               style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 15px;">
              Laisser mon avis →
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            Ou copiez ce lien : ${link_url}
          </p>
        </div>
      `,
    });
    return Response.json({ ok: true });
  }

  if (channel === "sms") {
    const brevoKey = process.env.BREVO_API_KEY;
    if (!brevoKey) {
      return Response.json({ error: "SMS non configuré (BREVO_API_KEY manquant)" }, { status: 500 });
    }

    const phone = recipient.replace(/\s/g, "").replace(/^0/, "+33");

    const res = await fetch("https://api.brevo.com/v3/transactionalSMS/sms", {
      method: "POST",
      headers: {
        "api-key": brevoKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: business_name.slice(0, 11),
        recipient: phone,
        content: `Bonjour, votre avis compte pour ${business_name} ! Notez votre expérience ici : ${link_url}`,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return Response.json({ error: err?.message ?? "Erreur envoi SMS" }, { status: 500 });
    }

    return Response.json({ ok: true });
  }

  return Response.json({ error: "Canal inconnu" }, { status: 400 });
}
