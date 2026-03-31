export const runtime = "nodejs";

import { createClient } from "@/lib/supabase/server";

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
