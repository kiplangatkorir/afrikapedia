import { notFound } from "next/navigation";
import ArticleEditor from "@/components/ArticleEditor";
import { createClient } from "@/lib/supabase-server";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from("articles")
    .select("id, title, excerpt, content, category_id")
    .eq("id", id)
    .single();

  if (error || !article) {
    notFound();
  }

  return <ArticleEditor mode="edit" initialData={article} />;
}
