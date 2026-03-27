import Groq from "groq-sdk";
import { getSystemPrompt, type BusinessType } from "@/lib/business-prompts";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(request: Request) {
  const { reviewText, reviewerName, stars, businessType, businessName } = await request.json();

  if (!reviewText || !businessType) {
    return Response.json({ error: "Données manquantes" }, { status: 400 });
  }

  const systemPrompt = getSystemPrompt(
    businessType as BusinessType,
    businessName || "notre établissement"
  );

  const userMessage = `Génère une réponse professionnelle à cet avis Google (${stars}/5 étoiles) :

Auteur : ${reviewerName || "Un client"}
Note : ${"★".repeat(stars)}${"☆".repeat(5 - stars)} (${stars}/5)
Avis : "${reviewText}"`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 300,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    const response = completion.choices[0]?.message?.content ?? "";
    return Response.json({ response });
  } catch (error: any) {
    console.error("Groq error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
