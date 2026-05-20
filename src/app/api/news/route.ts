import { NextRequest, NextResponse } from "next/server";

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = "https://newsapi.org/v2";

const categoryQueries: Record<string, string> = {
  world: "world politics international",
  tech: "technology artificial intelligence software",
  ai: "artificial intelligence machine learning OpenAI",
  business: "business economy markets finance",
  science: "science research discovery breakthrough",
};

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") || "world";

  if (!NEWS_API_KEY) {
    return NextResponse.json({ error: "NEWS_API_KEY not configured" }, { status: 500 });
  }

  const query = categoryQueries[category] || categoryQueries.world;
  const url = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=12&apiKey=${NEWS_API_KEY}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (data.status !== "ok") {
      throw new Error(data.message || "NewsAPI error");
    }

    const articles = data.articles
      .filter((a: { title: string; description: string; url: string }) => a.title && a.description && a.url)
      .map((a: {
        title: string;
        description: string;
        url: string;
        urlToImage: string;
        publishedAt: string;
        source: { name: string };
      }) => ({
        title: a.title,
        description: a.description,
        url: a.url,
        image: a.urlToImage,
        publishedAt: a.publishedAt,
        source: a.source.name,
      }));

    return NextResponse.json({ articles });
  } catch (err) {
    console.error("News fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
