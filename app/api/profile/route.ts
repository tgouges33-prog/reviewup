export const runtime = "nodejs";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", session.user.id)
    .single();

  return Response.json({ profile: data ?? null });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json();

  await supabase.from("profiles").upsert({
    user_id: session.user.id,
    ...body,
  });

  return Response.json({ success: true });
}
