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

  const prompt = `You are an expert educator whose mission is to take someone from zero knowledge to a solid beginner/intermediate understanding of a topic.

Topic: ${topicTitle}

Generate a structured educational brief in JSON format with these exact keys:
{
  "hook": "One compelling sentence that makes this topic feel urgent or fascinating — something that triggers genuine curiosity",
  "whatIsIt": "2-3 sentences explaining what this is in plain English. No jargon. Pretend you're explaining to a curious 16-year-old.",
  "whyItMatters": "2-3 sentences on why this topic matters to the real world, to the reader's life, or to the future.",
  "keyIdeas": [
    { "term": "Key concept 1", "explanation": "Simple 1-sentence explanation" },
    { "term": "Key concept 2", "explanation": "Simple 1-sentence explanation" },
    { "term": "Key concept 3", "explanation": "Simple 1-sentence explanation" }
  ],
  "realWorldExample": "A concrete, vivid real-world example that makes the concept click. Make it relatable.",
  "commonMisconception": "One thing most people get wrong about this topic, and the truth.",
  "buildingBlocks": "What should someone learn next to go deeper? Name 2-3 related concepts and why they connect.",
  "mindBlower": "One surprising, counterintuitive, or little-known fact about this topic that most people don't know."
}

Return only valid JSON. No markdown, no code blocks, just the JSON object.`;

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1500,
      messages: [
        {
          role: "system",
          content: "You are an expert educator. Return only valid JSON, no markdown or code blocks.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) throw new Error("Empty response");

    const data = JSON.parse(text);
    return NextResponse.json({ topic: topicTitle, category: topic.category, emoji: topic.emoji, ...data });
  } catch (err) {
    console.error("Daily topic error:", err);
    return NextResponse.json({ error: "Failed to generate topic brief" }, { status: 500 });
  }
}
