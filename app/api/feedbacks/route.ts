export const runtime = "nodejs";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function GET() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const { data: link } = await supabase
    .from("review_links")
    .select("id")
    .eq("user_id", session.user.id)
    .single();

  if (!link) return Response.json({ feedbacks: [] });

  const { data: feedbacks } = await supabase
    .from("feedbacks")
    .select("*")
    .eq("link_id", link.id)
    .order("created_at", { ascending: false });

  return Response.json({ feedbacks: feedbacks ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { link_id, stars, comment } = await request.json();

  if (!link_id || !stars) {
    return Response.json({ error: "Données manquantes" }, { status: 400 });
  }

  const { error } = await supabase
    .from("feedbacks")
    .insert({ link_id, stars, comment: comment ?? null, status: "nouveau" });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  // Envoyer email de notification si avis négatif (≤ 3)
  if (stars <= 3 && resend) {
    const { data: linkData } = await supabase
      .from("review_links")
      .select("notification_email, business_name")
      .eq("id", link_id)
      .single();

    if (linkData?.notification_email) {
      await resend.emails.send({
        from: "ReviewUp <notifications@reviewup.fr>",
        to: linkData.notification_email,
        subject: `⚠️ Nouvel avis négatif (${stars}/5) — ${linkData.business_name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1f2937;">Nouvel avis négatif reçu</h2>
            <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 12px; padding: 16px; margin: 16px 0;">
              <p style="margin: 0; font-size: 24px;">${"★".repeat(stars)}${"☆".repeat(5 - stars)}</p>
              <p style="margin: 8px 0 0; color: #92400e; font-weight: 600;">${stars}/5 étoiles</p>
            </div>
            ${comment ? `
            <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin: 16px 0;">
              <p style="margin: 0; color: #374151; font-style: italic;">"${comment}"</p>
            </div>
            ` : "<p style='color: #6b7280;'>Aucun commentaire laissé.</p>"}
            <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
              Connectez-vous à votre dashboard ReviewUp pour gérer ce feedback.
            </p>
          </div>
        `,
      }).catch(() => {}); // Ne pas bloquer si l'email échoue
    }
  }

  return Response.json({ ok: true });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const { id, status } = await request.json();

  const { error } = await supabase
    .from("feedbacks")
    .update({ status })
    .eq("id", id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
