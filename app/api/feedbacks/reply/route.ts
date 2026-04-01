export const runtime = "nodejs";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const { feedback_id, reply_text } = await request.json();

  if (!feedback_id || !reply_text) {
    return Response.json({ error: "Données manquantes" }, { status: 400 });
  }

  const { data: feedback } = await supabase
    .from("feedbacks")
    .select("customer_email, stars, comment, link_id")
    .eq("id", feedback_id)
    .single();

  if (!feedback?.customer_email) {
    return Response.json({ error: "Pas d'email client pour ce feedback" }, { status: 400 });
  }

  const { data: link } = await supabase
    .from("review_links")
    .select("business_name, notification_email")
    .eq("id", feedback.link_id)
    .single();

  if (!resend) {
    return Response.json({ error: "Email non configuré" }, { status: 500 });
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  await resend.emails.send({
    from: `${link?.business_name ?? "ReviewUp"} <${fromEmail}>`,
    replyTo: link?.notification_email ?? undefined,
    to: feedback.customer_email,
    subject: `Réponse de ${link?.business_name ?? "l'établissement"} concernant votre avis`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1f2937;">Bonjour,</h2>
        <p style="color: #4b5563;">
          <strong>${link?.business_name ?? "L'établissement"}</strong> a répondu à votre avis
          (${"★".repeat(feedback.stars)}${"☆".repeat(5 - feedback.stars)}) :
        </p>
        ${feedback.comment ? `
        <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin: 16px 0; border-left: 4px solid #e5e7eb;">
          <p style="margin: 0; color: #6b7280; font-style: italic;">"${feedback.comment}"</p>
        </div>
        ` : ""}
        <div style="background: #f0f4ff; border-radius: 12px; padding: 16px; margin: 16px 0; border-left: 4px solid #667eea;">
          <p style="margin: 0; color: #374151;">${reply_text}</p>
        </div>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
          Merci pour votre retour — ${link?.business_name ?? "L'équipe"}
        </p>
      </div>
    `,
  });

  await supabase.from("feedbacks").update({ status: "traite" }).eq("id", feedback_id);

  return Response.json({ ok: true });
}
