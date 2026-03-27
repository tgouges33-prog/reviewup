import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { getSystemPrompt, type BusinessType } from "@/lib/business-prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: Request) {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { reviewText, reviewerName, stars, businessType, businessName } = await request.json();

  if (!reviewText || !businessType) {
    return Response.json({ error: "Données manquantes" }, { status: 400 });
  }

  const systemPrompt = getSystemPrompt(businessType as BusinessType, businessName || "notre établissement");

  const userMessage = `Génère une réponse professionnelle à cet avis Google (${stars}/5 étoiles) :

Auteur : ${reviewerName || "Un client"}
Note : ${"★".repeat(stars)}${"☆".repeat(5 - stars)} (${stars}/5)
Avis : "${reviewText}"`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      messages: [{ role: "user", content: userMessage }],
      system: systemPrompt,
    });

    const response = message.content[0].type === "text" ? message.content[0].text : "";
    return Response.json({ response });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
