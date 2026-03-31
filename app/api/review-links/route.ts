export const runtime = "nodejs";

import { createClient } from "@/lib/supabase/server";

function generateSlug(businessName: string): string {
  const base = businessName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 20);
  const rand = Math.random().toString(36).slice(2, 7);
  return `${base}-${rand}`;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const { data } = await supabase
    .from("review_links")
    .select("*")
    .eq("user_id", session.user.id)
    .single();

  return Response.json({ link: data ?? null });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const { business_name, google_review_url } = await request.json();

  // Vérifier si un lien existe déjà
  const { data: existing } = await supabase
    .from("review_links")
    .select("id, slug")
    .eq("user_id", session.user.id)
    .single();

  if (existing) {
    // Mettre à jour
    const { data, error } = await supabase
      .from("review_links")
      .update({ business_name, google_review_url })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ link: data });
  }

  // Créer
  const slug = generateSlug(business_name || "mon-etablissement");
  const { data, error } = await supabase
    .from("review_links")
    .insert({ user_id: session.user.id, slug, business_name, google_review_url })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ link: data });
}
