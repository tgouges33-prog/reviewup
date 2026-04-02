import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.session) {
      const { provider_token, provider_refresh_token, user } = data.session;
      if (provider_token) {
        await supabase.from("user_tokens").upsert({
          user_id: user.id,
          access_token: provider_token,
          refresh_token: provider_refresh_token ?? null,
          updated_at: new Date().toISOString(),
        });
      }

      // Email de bienvenue si premier login
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single();

      if (!profile && resend && user.email) {
        await resend.emails.send({
          from: `Klevano <${FROM_EMAIL}>`,
          to: user.email,
          subject: "Bienvenue sur Klevano 🎉",
          html: `
            <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
              <div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 32px;">
                <h1 style="color: white; font-size: 28px; margin: 0 0 8px;">Bienvenue sur Klevano 👋</h1>
                <p style="color: rgba(255,255,255,0.85); margin: 0; font-size: 16px;">Votre outil d'optimisation Google My Business</p>
              </div>
              <p style="color: #374151; font-size: 15px; line-height: 1.6;">Bonjour,</p>
              <p style="color: #374151; font-size: 15px; line-height: 1.6;">
                Merci de nous faire confiance ! Votre compte est prêt. Voici les 3 premières étapes pour bien démarrer :
              </p>
              <div style="background: #f8f9ff; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
                  <span style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-radius: 50%; width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold; flex-shrink: 0; margin-right: 12px;">1</span>
                  <div>
                    <p style="margin: 0; font-weight: 600; color: #111827;">Connectez votre fiche Google My Business</p>
                    <p style="margin: 4px 0 0; color: #6b7280; font-size: 13px;">Klevano analysera votre fiche et votre score d'optimisation</p>
                  </div>
                </div>
                <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
                  <span style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-radius: 50%; width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold; flex-shrink: 0; margin-right: 12px;">2</span>
                  <div>
                    <p style="margin: 0; font-weight: 600; color: #111827;">Générez votre lien de collecte d'avis</p>
                    <p style="margin: 4px 0 0; color: #6b7280; font-size: 13px;">Un lien unique + QR code à partager à vos clients</p>
                  </div>
                </div>
                <div style="display: flex; align-items: flex-start;">
                  <span style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-radius: 50%; width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold; flex-shrink: 0; margin-right: 12px;">3</span>
                  <div>
                    <p style="margin: 0; font-weight: 600; color: #111827;">Envoyez votre premier lien à un client</p>
                    <p style="margin: 4px 0 0; color: #6b7280; font-size: 13px;">Par email ou SMS directement depuis le dashboard</p>
                  </div>
                </div>
              </div>
              <div style="text-align: center; margin: 32px 0;">
                <a href="https://klevano.com/dashboard" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 600; font-size: 15px; display: inline-block;">
                  Accéder à mon dashboard →
                </a>
              </div>
              <p style="color: #9ca3af; font-size: 13px; text-align: center;">
                Une question ? Répondez à cet email ou contactez-nous à <a href="mailto:contact@klevano.com" style="color: #667eea;">contact@klevano.com</a>
              </p>
            </div>
          `,
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
