import { notFound } from "next/navigation";
import ArticleEditor from "@/components/ArticleEditor";
import { createClient } from "@/lib/supabase-server";
import { getArticle } from "@/lib/article-service";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createClient();

  // 1. Try to find the article in Supabase by slug
  const { data: dbArticle } = await supabase
    .from("articles")
    .select("id, title, excerpt, content, category_id, slug")
    .eq("slug", slug)
    .single();

  if (dbArticle) {
    return <ArticleEditor mode="edit" initialData={dbArticle} />;
  }

  // 2. If not in Supabase, try to fetch from article-service (local or Wikipedia)
  const serviceArticle = await getArticle(slug);

  if (!serviceArticle) {
    notFound();
  }

  // 3. Prepare data for "creation" (importing into Supabase)
  const initialData = {
    title: serviceArticle.title,
    excerpt: serviceArticle.description || "",
    content: serviceArticle.content,
    category_id: "ancient-civilizations", // Default category
  };

  return <ArticleEditor mode="create" initialData={initialData} />;
}
