import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticle, getLocalSlugs, isAfricaRelevant } from "@/lib/article-service";
import { parseMarkdown } from "@/lib/markdown";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Revalidate articles every hour
export const revalidate = 3600;

// Generate static params from local articles
export async function generateStaticParams() {
  const slugs = getLocalSlugs();
  const defaultSlugs = [
    "mali-empire",
    "ubuntu-philosophy",
    "ancient-egypt",
    "kingdom-of-aksum",
    "timbuktu",
    "mansa-musa",
  ];

  const allSlugs = Array.from(new Set([...slugs, ...defaultSlugs]));
  return allSlugs.map((slug) => ({ slug }));
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch from service (local -> cache -> wikipedia)
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  // Filter for Africa-relevance if it's a new Wikipedia fetch
  if (article.fetchedAt && !isAfricaRelevant(article.title, article.extract)) {
    notFound();
  }

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const readTime = Math.ceil((article.content?.split(" ").length || 0) / 200) + " min read";

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-8 md:py-12">
      <Link
        href="/"
        className="text-[--gold] hover:text-[--gold2] text-sm mb-8 inline-flex items-center gap-2 transition-colors"
      >
        ← Back to Home
      </Link>

      {article.thumbnail && (
        <div className="relative w-full h-[250px] md:h-[400px] mb-8 overflow-hidden rounded-lg border border-[--border]">
          <img
            src={article.thumbnail}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="mb-4">
        <span className="text-[--gold] text-[10px] tracking-[2px] uppercase font-bold">
          {article.isLocal ? "Verified Article" : (article.description || "Encyclopedia Entry")}
        </span>
      </div>

      <h1 className="font-display text-[32px] md:text-[52px] font-bold text-[--text] leading-[1.1] mb-6 tracking-[-0.5px]">
        {article.title}
      </h1>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[--text3] text-[13px] mb-10 pb-6 border-b border-[--border]">
        <span>Source: {article.isLocal ? "Afrikapedia" : "Wikipedia"}</span>
        <span className="opacity-30">•</span>
        <span>{date}</span>
        <span className="opacity-30">•</span>
        <span>{readTime}</span>
      </div>

      <article
        className="prose prose-invert prose-lg max-w-none font-serif text-[--text] leading-[1.8]"
        dangerouslySetInnerHTML={{ __html: parseMarkdown(article.content) }}
      />

      <div className="mt-16 p-6 md:p-10 bg-[--bg2] rounded border border-[--border] relative overflow-hidden">
        <div className="absolute right-[-20px] bottom-[-20px] text-[120px] opacity-[0.03] select-none">
          🌍
        </div>
        
        <h3 className="font-display text-2xl font-bold text-[--text] mb-4">
          Knowledge is Heritage
        </h3>
        <p className="text-[--text2] mb-8 max-w-2xl">
          {article.isLocal 
            ? "This article has been curated by the Afrikapedia community to preserve and celebrate African achievement."
            : "This content is sourced from Wikipedia and is available under CC-BY-SA license. Help us improve it by contributing."}
        </p>
        
        <div className="flex flex-wrap gap-4 relative z-10">
          {!article.isLocal && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[--gold] text-[--bg] px-6 py-3 rounded font-bold text-sm hover:bg-[--gold2] transition-all active:scale-95"
            >
              View on Wikipedia
            </a>
          )}
          <Link
            href={`/edit/${slug}`}
            className="inline-flex items-center justify-center bg-[--bg3] text-[--text] border border-[--border2] px-6 py-3 rounded font-bold text-sm hover:bg-[--border] transition-all active:scale-95"
          >
            Edit this Article
          </Link>
          <Link
            href="/contribute"
            className="inline-flex items-center justify-center text-[--gold] px-6 py-3 rounded font-bold text-sm hover:bg-[--gold-dim] transition-all"
          >
            Learn more about contributing
          </Link>
        </div>
      </div>
    </div>
  );
}
