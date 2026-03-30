export const runtime = "nodejs";

import { createClient } from "@/lib/supabase/server";
import { getLocationPerformance } from "@/lib/gmb";

export async function GET() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const { data: tokenData } = await supabase
    .from("user_tokens")
    .select("access_token, location_name")
    .eq("user_id", session.user.id)
    .single();

  const accessToken = tokenData?.access_token ?? session.provider_token;
  const locationName = tokenData?.location_name;

  if (!accessToken || !locationName) {
    return Response.json({ gmb_required: true });
  }

  try {
    const data = await getLocationPerformance(accessToken, locationName);
    return Response.json({ stats: data });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
