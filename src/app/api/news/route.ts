import { NextRequest, NextResponse } from "next/server";

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = "https://newsapi.org/v2";

// Singapore uses domain filtering via /everything since ST isn't a NewsAPI source ID
const SINGAPORE_DOMAINS = "straitstimes.com,channelnewsasia.com,todayonline.com,businesstimes.com.sg";
const SINGAPORE_QUERY = "Singapore";

// Whitelisted reputable sources per category (NewsAPI source IDs)
const categorySources: Record<string, string[]> = {
  world: [
    "reuters",
    "associated-press",
    "bbc-news",
    "al-jazeera-english",
    "the-guardian-uk",
    "foreign-policy",
    "time",
    "the-washington-post",
    "the-new-york-times",
  ],
  tech: [
    "ars-technica",
    "wired",
    "the-verge",
    "techcrunch",
    "mit-technology-review",
    "hacker-news",
    "engadget",
    "ieee-spectrum",
  ],
  ai: [
    "wired",
    "mit-technology-review",
    "ars-technica",
    "techcrunch",
    "the-verge",
    "new-scientist",
    "engadget",
  ],
  business: [
    "bloomberg",
    "financial-times",
    "the-economist",
    "reuters",
    "fortune",
    "business-insider",
    "the-wall-street-journal",
    "cnbc",
  ],
  science: [
    "new-scientist",
    "national-geographic",
    "ars-technica",
    "wired",
    "mit-technology-review",
    "the-guardian-uk",
    "reuters",
  ],
};

interface RawArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
}

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") || "world";

  if (!NEWS_API_KEY) {
    return NextResponse.json({ error: "NEWS_API_KEY not configured" }, { status: 500 });
  }

  // Singapore: use /everything with domain filter (ST has no NewsAPI source ID)
  if (category === "singapore") {
    const url = `${BASE_URL}/everything?q=${encodeURIComponent(SINGAPORE_QUERY)}&domains=${SINGAPORE_DOMAINS}&language=en&sortBy=publishedAt&pageSize=15&apiKey=${NEWS_API_KEY}`;
    try {
      const res = await fetch(url, { next: { revalidate: 1800 } });
      const data = await res.json();
      if (data.status !== "ok") throw new Error(data.message || "NewsAPI error");
      const articles = data.articles
        .filter((a: RawArticle) => a.title && a.description && a.url && !a.title.includes("[Removed]") && a.description.length > 60)
        .map((a: RawArticle) => ({
          title: a.title,
          description: a.description,
          url: a.url,
          image: a.urlToImage,
          publishedAt: a.publishedAt,
          source: a.source.name,
        }));
      return NextResponse.json({ articles });
    } catch (err) {
      console.error("Singapore news error:", err);
      return NextResponse.json({ error: "Failed to fetch Singapore news" }, { status: 500 });
    }
  }

  const sources = (categorySources[category] || categorySources.world).join(",");

  // top-headlines with explicit sources gives curated, current stories from real outlets
  const url = `${BASE_URL}/top-headlines?sources=${sources}&pageSize=15&apiKey=${NEWS_API_KEY}`;

  try {
    const res = await fetch(url, { next: { revalidate: 1800 } });
    const data = await res.json();

    if (data.status !== "ok") {
      // Some source combos aren't available on the free tier — fall back to top-headlines by category keyword
      throw new Error(data.message || "NewsAPI error");
    }

    const articles = data.articles
      .filter((a: RawArticle) =>
        a.title &&
        a.description &&
        a.url &&
        !a.title.includes("[Removed]") &&
        a.description.length > 60
      )
      .map((a: RawArticle) => ({
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

    // Fallback: top-headlines with language filter, no source restriction
    const fallbackKeywords: Record<string, string> = {
      world: "politics OR diplomacy OR conflict OR election",
      tech: "technology OR semiconductor OR cybersecurity OR software",
      ai: "artificial intelligence OR machine learning OR OpenAI OR LLM",
      business: "economy OR markets OR trade OR Federal Reserve OR earnings",
      science: "climate OR research OR space OR biology OR physics",
    };

    const fallbackUrl = `${BASE_URL}/everything?q=${encodeURIComponent(
      fallbackKeywords[category] || fallbackKeywords.world
    )}&language=en&sortBy=publishedAt&pageSize=15&domains=reuters.com,bbc.com,theguardian.com,apnews.com,bloomberg.com,ft.com,wired.com,arstechnica.com,techcrunch.com,economist.com,newscientist.com,technologyreview.com,foreignpolicy.com,wsj.com&apiKey=${NEWS_API_KEY}`;

    try {
      const fallbackRes = await fetch(fallbackUrl, { next: { revalidate: 1800 } });
      const fallbackData = await fallbackRes.json();

      if (fallbackData.status !== "ok") {
        return NextResponse.json({ error: fallbackData.message || "Failed to fetch news" }, { status: 500 });
      }

      const articles = fallbackData.articles
        .filter((a: RawArticle) =>
          a.title &&
          a.description &&
          a.url &&
          !a.title.includes("[Removed]") &&
          a.description.length > 60
        )
        .map((a: RawArticle) => ({
          title: a.title,
          description: a.description,
          url: a.url,
          image: a.urlToImage,
          publishedAt: a.publishedAt,
          source: a.source.name,
        }));

      return NextResponse.json({ articles });
    } catch (fallbackErr) {
      console.error("Fallback news fetch error:", fallbackErr);
      return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
    }
  }
}
