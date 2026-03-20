import { NextRequest, NextResponse } from "next/server";
import { searchPages, isAfricaRelevant } from "@/lib/wikipedia";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({ results: [] });
    }

    // Search Wikipedia
    const results = await searchPages(query, 20);

    // Filter for Africa-relevant content and transform
    const filteredResults = results
      .filter((result) => isAfricaRelevant(result.title, result.extract || ""))
      .map((result) => ({
        title: result.title,
        description: result.description,
        excerpt: result.extract?.slice(0, 200) + "..." || "",
        thumbnail: result.thumbnail?.source,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`,
      }));

    return NextResponse.json({ results: filteredResults });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed", results: [] },
      { status: 500 }
    );
  }
}
