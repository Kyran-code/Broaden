import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const DOMAINS = [
  "Economics & Finance",
  "Computer Science & Technology",
  "Biology & Medicine",
  "Physics & Mathematics",
  "History & Geopolitics",
  "Psychology & Behaviour",
  "Philosophy & Ethics",
  "Environment & Climate",
  "Law & Governance",
  "Business & Strategy",
  "Culture & Society",
  "Language & Linguistics",
  "Astronomy & Space",
  "Chemistry & Materials",
  "Neuroscience",
  "Other",
];

export async function POST(req: NextRequest) {
  const { entry } = await req.json();

  if (!entry || entry.trim().length < 10) {
    return NextResponse.json({ error: "Entry too short" }, { status: 400 });
  }

  const prompt = `You are an expert knowledge analyst. A learner has written a journal entry about what they learned today. Your job is to analyse their entry, categorise it into knowledge domains, extract key concepts, and help them retain the information.

The learner wrote:
"${entry}"

Available domains: ${DOMAINS.join(", ")}

Return a JSON object with these exact keys:
{
  "domains": [
    { "name": "Domain name from the list", "relevance": "primary | secondary", "reasoning": "One sentence on why this entry relates to this domain." }
  ],
  "keyConcepts": [
    { "concept": "A specific concept, idea, or fact they mentioned", "explanation": "A precise 1–2 sentence elaboration that deepens their understanding of this concept." }
  ],
  "summary": "A 2–3 sentence synthesis of what they learned, written back to them in second person ('You learned that...'). Be specific — reference their actual content.",
  "retentionQuestions": [
    "A specific question testing recall or deeper understanding of something they wrote about.",
    "A second question, preferably asking them to apply or connect the concept to something else.",
    "A third question that probes a nuance or implication they may not have considered."
  ],
  "connections": "1–2 sentences connecting what they learned today to adjacent ideas, domains, or real-world phenomena they might want to explore next.",
  "gaps": "1–2 sentences identifying what they might be missing or misunderstanding based on their entry — written constructively."
}

Return only valid JSON. Be specific and rigorous — do not give vague or generic responses.`;

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2048,
      messages: [
        {
          role: "system",
          content: "You are an expert knowledge analyst. Return only valid JSON, no markdown or code blocks.",
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
    console.error("Log analysis error:", err);
    return NextResponse.json({ error: "Failed to analyse entry" }, { status: 500 });
  }
}
