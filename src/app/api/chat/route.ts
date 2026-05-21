import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const { context, contextType, messages, question } = await req.json();

  if (!question || !context) {
    return NextResponse.json({ error: "Missing question or context" }, { status: 400 });
  }

  const systemPrompt = contextType === "topic"
    ? `You are a knowledgeable tutor helping a reader go deeper on a topic they just read about. The topic is: "${context.topic}" (${context.category}).

You have access to the full briefing they read. Your role is to answer their follow-up questions with the same intellectual seriousness as the briefing itself — specific, substantive, and clear. Do not be vague. Name real examples, real figures, real mechanisms. If you do not know something, say so.

Keep answers focused: 2–4 paragraphs unless the question requires more. You may use short numbered lists if listing things, but default to prose.`
    : `You are a knowledgeable analyst helping a reader understand a news story more deeply. The story is: "${context.title}".

Your role is to answer their follow-up questions with depth and specificity — go into the history, the mechanisms, the implications. Do not summarise what they already read. Add to it. If they ask about something tangential to the story, answer it fully.

Keep answers focused: 2–4 paragraphs unless the question requires more.`;

  const history: Message[] = messages || [];

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
        { role: "system", content: systemPrompt },
        ...history.map((m: Message) => ({ role: m.role, content: m.content })),
        { role: "user", content: question },
      ],
    });

    const answer = completion.choices[0]?.message?.content;
    if (!answer) throw new Error("Empty response");

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({ error: "Failed to respond" }, { status: 500 });
  }
}
