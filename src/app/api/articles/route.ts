import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { title, excerpt, content, category_id } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 },
      );
    }

    const slug = generateSlug(title);

    // If category_id is a slug, try to find the UUID
    let actualCategoryId = category_id;
    if (category_id && !category_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      const { data: catData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category_id)
        .single();
      
      if (catData) {
        actualCategoryId = catData.id;
      } else {
        // If not found, use null or a default
        actualCategoryId = null;
      }
    }

    const { data, error } = await supabase
      .from("articles")
      .insert([
        {
          title,
          slug,
          excerpt: excerpt || "",
          content,
          category_id: actualCategoryId,
          featured: false,
          language_code: 'en'
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
