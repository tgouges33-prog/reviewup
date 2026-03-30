export const runtime = "nodejs";

import { createClient } from "@/lib/supabase/server";
import { replyToReview } from "@/lib/gmb";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return Response.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { reviewName, comment } = await request.json() as { reviewName: string; comment: string };

  if (!reviewName || !comment) {
    return Response.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const { data: tokenData } = await supabase
    .from("user_tokens")
    .select("access_token")
    .eq("user_id", session.user.id)
    .single();

  const accessToken = tokenData?.access_token ?? session.provider_token;

  if (!accessToken) {
    return Response.json({ error: "Compte Google non connecté" }, { status: 400 });
  }

  try {
    await replyToReview(accessToken, reviewName, comment);
    return Response.json({ success: true });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
