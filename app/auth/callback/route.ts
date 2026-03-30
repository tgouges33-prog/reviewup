import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

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
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
