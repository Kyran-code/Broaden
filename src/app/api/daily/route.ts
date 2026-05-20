import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { getTodaysTopic } from "@/lib/topics";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function GET(req: NextRequest) {
  const topicId = req.nextUrl.searchParams.get("topic");
  const topic = getTodaysTopic();

  const topicTitle = topicId
    ? topicId.replace(/-/g, " ")
    : topic.title;

  const prompt = `You are a senior writer for a serious intellectual publication — think Foreign Affairs, The Economist, or Aeon. Your task is to write a long-form educational brief on a specialised topic that takes 10–15 minutes to read carefully. The reader is intelligent but has no prior knowledge of this specific subject.

Topic: ${topicTitle}

Write a deep, substantive brief in JSON format with these exact keys. Each section should be multiple paragraphs — do not write thin, surface-level content. Be specific, name real scientists, real dates, real events, real mechanisms.

{
  "openingEssay": "A compelling 3–4 paragraph opening that establishes why this topic matters, what makes it strange or counterintuitive, and what the reader will understand by the end. Do not use bullet points here — write in full prose.",

  "historicalOrigins": "2–3 substantial paragraphs tracing the intellectual or historical origins of this subject. Name the key figures, the era, the context. What problem were people trying to solve? What were the prevailing beliefs before this idea emerged?",

  "coreMechanisms": "3–4 paragraphs explaining precisely how this works. This is the technical heart of the brief. Use analogies where helpful, but do not dumb it down — explain the actual mechanisms, the actual logic, the actual science. Be specific.",

  "keyTermsGlossary": [
    { "term": "Term", "definition": "A precise, 2–3 sentence definition that gives real understanding, not just a dictionary entry." }
  ],

  "keyDebates": [
    { "debate": "Name of the debate or controversy", "explanation": "2–3 paragraphs explaining what the disagreement is, who holds each position, and what evidence or arguments support each side. Name real people and institutions." }
  ],

  "caseStudy": "A detailed, 3–4 paragraph case study or concrete real-world example that illustrates the topic in action. Be specific — name places, dates, outcomes. This should make the abstract concrete.",

  "realWorldImplications": "2–3 paragraphs on the practical stakes. Who is affected? What decisions hinge on this? What industries, governments, or individuals are shaped by this topic?",

  "commonMisconceptions": [
    { "myth": "A commonly held misconception", "reality": "A 2–3 sentence correction with the actual truth and why the misconception persists." }
  ],

  "futureOutlook": "2–3 paragraphs on where this field or topic is heading. What open questions remain? What would change our understanding? What should the reader watch for?",

  "furtherReading": [
    { "title": "Book, paper, or resource title", "author": "Author name", "why": "One sentence on what this adds to your understanding." }
  ]
}

Return only valid JSON. No markdown, no code blocks. Each prose section must be long and substantive — aim for 150–300 words per major prose field.`;

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 4096,
      messages: [
        {
          role: "system",
          content: "You are a senior writer for a serious intellectual publication. Return only valid JSON, no markdown or code blocks. Write long, substantive, specific prose — not bullet-point summaries.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) throw new Error("Empty response");

    const data = JSON.parse(text);
    return NextResponse.json({
      topic: topicTitle,
      category: topic.category,
      ...data,
    });
  } catch (err) {
    console.error("Daily topic error:", err);
    return NextResponse.json({ error: "Failed to generate topic brief" }, { status: 500 });
  }
}
