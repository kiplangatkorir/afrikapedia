import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { title, excerpt, content, category_id } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 },
      );
    }

    const slug = generateSlug(title);
    const supabase = createClient();

    // Get current article for revision tracking
    const { data: currentArticle } = await supabase
      .from("articles")
      .select("content")
      .eq("id", id)
      .single();

    // Update the article
    const { data: article, error } = await supabase
      .from("articles")
      .update({
        title,
        slug,
        excerpt: excerpt || "",
        content,
        category_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { error: "Failed to update article" },
        { status: 500 },
      );
    }

    // Create revision record if content changed
    if (currentArticle && currentArticle.content !== content) {
      await supabase.from("article_revisions").insert({
        article_id: id,
        content: currentArticle.content,
        change_summary: `Updated by author on ${new Date().toLocaleDateString()}`,
      });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = createClient();

    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete article" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
