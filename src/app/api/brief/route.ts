import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { title, description } = await req.json();

  if (!title) {
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  }

  const prompt = `You are an expert at making complex news stories accessible to people who have no background knowledge.

News Story: "${title}"
Summary: "${description || "No summary provided"}"

Generate a context brief in JSON format that helps a complete outsider understand this story from the ground up:
{
  "whatsHappening": "2-3 sentences explaining what's happening right now in plain English. No assumed knowledge.",
  "backgroundContext": "2-3 sentences giving the essential history or context someone needs to understand WHY this is happening.",
  "keyPlayers": [
    { "name": "Key person/organization", "role": "Who they are and why they matter in 1 sentence" }
  ],
  "whyItMatters": "2-3 sentences on the real-world implications — who is affected and how.",
  "keyTerms": [
    { "term": "Jargon or technical term", "definition": "Simple plain-English definition" }
  ],
  "biggerPicture": "How does this story connect to broader global trends or ongoing issues? 2 sentences.",
  "whatToWatchNext": "What should readers follow to stay updated on this story? 1-2 sentences."
}

Return only valid JSON. No markdown, no code blocks.`;

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1200,
      messages: [
        {
          role: "system",
          content: "You are an expert educator and journalist. Return only valid JSON, no markdown or code blocks.",
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
