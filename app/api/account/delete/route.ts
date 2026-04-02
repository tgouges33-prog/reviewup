export const runtime = "nodejs";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";

export async function DELETE() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const userId = session.user.id;

  // Supprimer les données utilisateur
  await supabase.from("review_requests").delete().eq("user_id", userId);
  await supabase.from("review_links").delete().eq("user_id", userId);
  await supabase.from("subscriptions").delete().eq("user_id", userId);
  await supabase.from("profiles").delete().eq("id", userId);
  await supabase.from("user_tokens").delete().eq("user_id", userId);

  // Supprimer le compte auth (nécessite la clé service role)
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  await admin.auth.admin.deleteUser(userId);

  return Response.json({ ok: true });
}
