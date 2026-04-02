export const runtime = "nodejs";

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export async function GET(request: Request) {
  // Vérifier le secret Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (!resend) return Response.json({ skipped: "Resend non configuré" });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Trouver les demandes envoyées il y a 3 jours sans relance et sans réponse
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

  const { data: requests } = await supabase
    .from("review_requests")
    .select("*")
    .eq("channel", "email")
    .eq("responded", false)
    .is("reminder_sent_at", null)
    .lte("sent_at", threeDaysAgo);

  if (!requests?.length) return Response.json({ sent: 0 });

  let sent = 0;
  for (const req of requests) {
    try {
      await resend.emails.send({
        from: `${req.business_name} via Klevano <${FROM_EMAIL}>`,
        to: req.recipient,
        subject: `Rappel : votre avis pour ${req.business_name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1f2937;">Bonjour,</h2>
            <p style="color: #4b5563;">Nous n'avons pas encore reçu votre avis pour <strong>${req.business_name}</strong>.</p>
            <p style="color: #4b5563;">Votre retour compte beaucoup — cela prend moins d'une minute :</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${req.link_url}"
                 style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 15px;">
                Laisser mon avis →
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              Si vous ne souhaitez pas recevoir de rappel, ignorez cet email.
            </p>
          </div>
        `,
      });

      await supabase
        .from("review_requests")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", req.id);

      sent++;
    } catch {
      // Continue si un email échoue
    }
  }

  return Response.json({ sent });
}
