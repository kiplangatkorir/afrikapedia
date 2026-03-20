import { NextRequest, NextResponse } from "next/server";
import { searchArticles } from "@/lib/article-service";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({ results: [] });
    }

    // Search Wikipedia (filtered for Africa relevance by the service)
    const results = await searchArticles(query, 20);

    // Transform for the search UI
    const formattedResults = results.map((article) => ({
      title: article.title,
      description: article.description,
      excerpt: article.extract?.slice(0, 200) + "..." || "",
      thumbnail: article.thumbnail,
      url: article.url,
      slug: article.title.toLowerCase().replace(/ /g, "-"),
    }));

    return NextResponse.json({ results: formattedResults });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed", results: [] },
      { status: 500 }
    );
  }
}
