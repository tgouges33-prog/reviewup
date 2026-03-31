export const runtime = "nodejs";

import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { link_id, event_type, source } = await request.json();

  if (!link_id || !event_type) {
    return Response.json({ error: "Données manquantes" }, { status: 400 });
  }

  const supabase = await createClient();
  await supabase.from("link_events").insert({ link_id, event_type, source: source ?? "link" });

  return Response.json({ ok: true });
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const { data: link } = await supabase
    .from("review_links")
    .select("id")
    .eq("user_id", session.user.id)
    .single();

  if (!link) return Response.json({ events: [] });

  const { data: events } = await supabase
    .from("link_events")
    .select("event_type, source, created_at")
    .eq("link_id", link.id)
    .order("created_at", { ascending: false });

  return Response.json({ events: events ?? [] });
}
