export const runtime = "nodejs";

import { createClient } from "@/lib/supabase/server";
import { getAccounts, getLocations, getLocation, updateLocation } from "@/lib/gmb";

async function getTokenAndLocation(supabase: any, userId: string, session: any) {
  const { data: tokenData } = await supabase
    .from("user_tokens")
    .select("access_token, location_name")
    .eq("user_id", userId)
    .single();

  const accessToken = tokenData?.access_token ?? session?.provider_token;
  let locationName: string = tokenData?.location_name ?? "";

  if (!accessToken) return { accessToken: null, locationName: "" };

  if (!locationName) {
    const accounts = await getAccounts(accessToken);
    const firstAccount = accounts?.accounts?.[0]?.name;
    if (!firstAccount) return { accessToken, locationName: "" };
    const locations = await getLocations(accessToken, firstAccount);
    locationName = locations?.locations?.[0]?.name ?? "";
    if (locationName) {
      await supabase.from("user_tokens").update({ location_name: locationName }).eq("user_id", userId);
    }
  }

  return { accessToken, locationName };
}

export async function GET() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return Response.json({ error: "Non authentifié" }, { status: 401 });

  try {
    const { accessToken, locationName } = await getTokenAndLocation(supabase, session.user.id, session);
    if (!accessToken) return Response.json({ gmb_required: true });
    if (!locationName) return Response.json({ gmb_required: true });

    const location = await getLocation(accessToken, locationName);
    return Response.json({ location });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const { fields, updateMask } = await request.json() as { fields: Record<string, any>; updateMask: string };

  try {
    const { accessToken, locationName } = await getTokenAndLocation(supabase, session.user.id, session);
    if (!accessToken || !locationName) return Response.json({ error: "GMB non connecté" }, { status: 400 });

    const updated = await updateLocation(accessToken, locationName, fields, updateMask);
    return Response.json({ location: updated });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
