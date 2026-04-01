export const runtime = "nodejs";

import Groq from "groq-sdk";
import { Resend } from "resend";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? "onboarding@resend.dev";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

const SYSTEM_PROMPT = `Tu es l'assistant support de Klevano, un SaaS français d'optimisation Google My Business et de collecte d'avis clients.

Klevano propose deux offres :
- Offre Essentiel (99€/mois) : optimisation de fiche GMB, scoring, checklist, suggestions IA
- Offre Pro (169€/mois) : tout l'Essentiel + collecte d'avis privés, lien marque blanche, QR code, notifications email, réponse aux avis

Fonctionnalités principales :
- Connexion Google My Business via OAuth
- Analyse de la fiche GMB (score, checklist d'optimisation)
- Suggestions IA pour améliorer le référencement local
- Lien de collecte d'avis personnalisé (logo, couleur)
- Filtrage avis : 4-5 étoiles → redirigé vers Google, 1-3 étoiles → feedback privé
- Réponse par email aux clients depuis le dashboard
- Envoi du lien par email ou SMS

Réponds en français, de façon concise et utile. Si la question concerne un problème technique très spécifique, un bug, ou quelque chose que tu ne peux pas résoudre, réponds EXACTEMENT avec ce JSON (et rien d'autre) :
{"escalate": true, "summary": "résumé court du problème en une phrase"}

Sinon réponds normalement en texte.`;

export async function POST(request: Request) {
  const { message, userEmail } = await request.json();

  if (!message?.trim()) {
    return Response.json({ error: "Message vide" }, { status: 400 });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 500,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";

    // Détecter si l'IA demande une escalade
    try {
      const parsed = JSON.parse(text.trim());
      if (parsed.escalate && resend) {
        await resend.emails.send({
          from: `Klevano Support <${FROM_EMAIL}>`,
          to: SUPPORT_EMAIL,
          subject: `[Support Klevano] Nouvelle demande client`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1f2937;">Nouvelle demande support</h2>
              <p><strong>Client :</strong> ${userEmail ?? "non connecté"}</p>
              <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin: 16px 0; border-left: 4px solid #667eea;">
                <p style="margin: 0; color: #374151;"><strong>Message :</strong> ${message}</p>
              </div>
              <p style="color: #6b7280; font-size: 13px;">Résumé : ${parsed.summary}</p>
            </div>
          `,
        });
        return Response.json({
          reply: "Je n'ai pas toutes les informations pour résoudre ça directement. J'ai transmis votre demande à notre équipe, vous recevrez une réponse par email sous 24h. 🙏",
          escalated: true,
        });
      }
    } catch {
      // Pas un JSON, réponse normale
    }

    return Response.json({ reply: text });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
