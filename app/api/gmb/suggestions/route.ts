export const runtime = "nodejs";

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(request: Request) {
  const { title, description, categories, hasPhotos, hasHours, hasPhone, hasWebsite } = await request.json();

  const prompt = `Tu es un expert en référencement local Google Business Profile (GMB).
Analyse cette fiche GMB et donne des suggestions concrètes et courtes pour améliorer son classement local.

Données de la fiche :
- Nom : ${title || "non renseigné"}
- Description : ${description ? `"${description.slice(0, 200)}"` : "non renseignée"}
- Catégories : ${categories?.length ? categories.join(", ") : "non renseignées"}
- Photos : ${hasPhotos ? "oui" : "non"}
- Horaires : ${hasHours ? "oui" : "non"}
- Téléphone : ${hasPhone ? "oui" : "non"}
- Site web : ${hasWebsite ? "oui" : "non"}

Donne exactement 4 suggestions numérotées, courtes (max 2 phrases chacune), actionnables immédiatement. Commence directement par "1."`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });
    const text = completion.choices[0]?.message?.content ?? "";
    const suggestions = text
      .split(/\n+/)
      .filter((l) => /^\d\./.test(l.trim()))
      .map((l) => l.trim());
    return Response.json({ suggestions });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
