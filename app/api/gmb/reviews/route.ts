export const runtime = "nodejs";

import { createClient } from "@/lib/supabase/server";
import { getAccounts, getLocations, getReviews } from "@/lib/gmb";

const STAR_MAP: Record<string, number> = {
  ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5,
};

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `Il y a ${m || 1}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `Il y a ${d}j`;
  return new Date(iso).toLocaleDateString("fr-FR");
}

export async function GET() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return Response.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { data: tokenData } = await supabase
    .from("user_tokens")
    .select("access_token, location_name")
    .eq("user_id", session.user.id)
    .single();

  const accessToken = tokenData?.access_token ?? session.provider_token;

  if (!accessToken) {
    return Response.json({ gmb_required: true, reviews: [] });
  }

  try {
    let locationName: string = tokenData?.location_name ?? "";

    if (!locationName) {
      const accounts = await getAccounts(accessToken);
      const firstAccount = accounts?.accounts?.[0]?.name;
      if (!firstAccount) {
        return Response.json({ gmb_required: true, reviews: [] });
      }
      const locations = await getLocations(accessToken, firstAccount);
      locationName = locations?.locations?.[0]?.name ?? "";
      if (!locationName) {
        return Response.json({ gmb_required: true, reviews: [] });
      }
      await supabase.from("user_tokens").update({ location_name: locationName })
        .eq("user_id", session.user.id);
    }

    const data = await getReviews(accessToken, locationName);
    const reviews = (data.reviews ?? []).map((r: any) => ({
      id: r.reviewId ?? r.name,
      name: r.reviewer?.displayName ?? "Anonyme",
      stars: STAR_MAP[r.starRating] ?? 0,
      text: r.comment ?? "",
      date: relativeDate(r.createTime),
      replied: !!r.reviewReply,
      response: r.reviewReply?.comment ?? "",
      reviewName: r.name,
    }));

    return Response.json({ reviews });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
