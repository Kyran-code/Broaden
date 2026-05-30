import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { title, description, publishedAt } = await req.json();

  if (!title) {
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  }

  // Format the article date clearly so the AI knows the temporal anchor
  const articleDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "recent";

  const todayDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const prompt = `You are a senior analyst and writer who specialises in making complex news stories fully intelligible to an educated but non-specialist reader. Your context briefs are known for their depth — you do not just summarise what happened, you explain the full picture: the history, the science or mechanics behind it, the key actors, and the broader implications.

IMPORTANT DATE CONTEXT:
- This article was published on: ${articleDate}
- Today's date is: ${todayDate}
- The timeline you generate MUST reflect these real dates. The most recent timeline entry should be dated ${articleDate} or earlier. Do NOT label recent events as years-old or vice versa. Be precise.

News Story: "${title}"
Summary: "${description || "No summary provided"}"

Write a deep context brief in JSON format. Each section should be substantive — multiple paragraphs where warranted. Be specific: name real people, dates, institutions, mechanisms. Do not be vague.

{
  "situation": "2–3 paragraphs describing precisely what is happening as of ${articleDate}. Who are the actors? What actions have been taken? What is the immediate sequence of events leading to this story?",

  "historicalBackground": "3–4 paragraphs giving the full historical context a reader needs. Go back as far as necessary — if this is about Ebola, explain the history of Ebola outbreaks since 1976. If it is about a trade war, explain the relevant trade history. Name the key turning points, dates, and figures.",

  "howItWorks": "2–3 paragraphs explaining the underlying mechanism, science, or system at play. If the story is about a virus, explain how the virus works. If it is about a financial crisis, explain the financial mechanism. If it is a geopolitical dispute, explain the structural forces at play. Make the non-obvious intelligible.",

  "timeline": [
    { "date": "Use the actual year or specific date — must be accurate and consistent with the article date of ${articleDate}", "event": "What happened — 1–2 sentences of specific detail. The final entry should be the current news story dated ${articleDate}." }
  ],

  "keyPlayers": [
    { "name": "Person, country, or organisation", "role": "Their position and what they want or have done — 2–3 sentences." }
  ],

  "whyItMatters": "2–3 paragraphs on the real stakes. Who is affected and how severely? What are the downstream consequences — economic, political, humanitarian, scientific? Why should someone who does not live in the affected region care?",

  "globalContext": "2 paragraphs placing this story inside a larger global trend or pattern. What larger forces does this reflect? Is this part of a cycle, a structural shift, or a one-off event?",

  "expertPerspectives": [
    { "perspective": "A specific analytical viewpoint or school of thought", "reasoning": "2–3 sentences explaining this perspective and the evidence or logic behind it." }
  ],

  "keyTerms": [
    { "term": "Technical or specialist term", "definition": "A clear, 2-sentence plain-English definition." }
  ],

  "whatToWatch": "1–2 paragraphs on what developments will be most consequential to follow after ${articleDate}, and why they will signal which direction this story is heading."
}

Return only valid JSON. No markdown, no code blocks. Write with the depth and seriousness of a Foreign Affairs analysis piece.`;

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 4096,
      messages: [
        {
          role: "system",
          content: `You are a senior analyst and long-form journalist. Today is ${todayDate}. Return only valid JSON, no markdown or code blocks. All dates in the timeline must be accurate and anchored to the article's publication date. Write substantively and specifically — never vague.`,
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) throw new Error("Empty response");

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Brief generation error:", err);
    return NextResponse.json({ error: "Failed to generate brief" }, { status: 500 });
  }
}
