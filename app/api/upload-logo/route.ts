export const runtime = "nodejs";

import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) return Response.json({ error: "Aucun fichier" }, { status: 400 });

  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) return Response.json({ error: "Fichier trop lourd (max 2 Mo)" }, { status: 400 });

  const allowed = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
  if (!allowed.includes(file.type)) return Response.json({ error: "Format non supporté" }, { status: 400 });

  const ext = file.name.split(".").pop() ?? "png";
  const path = `${session.user.id}/logo.${ext}`;

  const bytes = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from("logos")
    .upload(path, bytes, { contentType: file.type, upsert: true });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from("logos").getPublicUrl(path);

  return Response.json({ url: publicUrl });
}
