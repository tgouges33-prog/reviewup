import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, businessName, city, score, answers } = body;

  if (!email) {
    return Response.json({ error: "Email requis" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("audit_leads").insert({
      email,
      business_name: businessName,
      city,
      score,
      answers,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.log("[audit-lead] Supabase error (table may not exist yet):", { email, businessName, city, score });
    }
  } catch (err) {
    console.log("[audit-lead] Fallback log:", { email, businessName, city, score }, err);
  }

  return Response.json({ success: true });
}
