import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const supabase = createClient();

    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug: oldSlug } = await params;
    const supabase = createClient();
    const { title, excerpt, content, category_id } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 },
      );
    }

    const newSlug = generateSlug(title);

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
      }
    }

    const { data, error } = await supabase
      .from("articles")
      .update({
        title,
        slug: newSlug,
        excerpt: excerpt || "",
        content,
        category_id: actualCategoryId,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", oldSlug)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const supabase = createClient();

    const { error } = await supabase.from("articles").delete().eq("slug", slug);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
