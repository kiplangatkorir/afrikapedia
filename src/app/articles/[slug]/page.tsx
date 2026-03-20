import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleSummary, isAfricaRelevant } from "@/lib/wikipedia";
import { parseMarkdown } from "@/lib/markdown";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Convert slug to title case (e.g., "mali-empire" -> "Mali Empire")
function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const title = slugToTitle(slug);

  // Fetch from Wikipedia
  const wikipediaArticle = await getArticleSummary(title);

  if (!wikipediaArticle || !isAfricaRelevant(wikipediaArticle.title, wikipediaArticle.extract)) {
    notFound();
  }

  const article = {
    title: wikipediaArticle.title,
    content: wikipediaArticle.extract,
    thumbnail: wikipediaArticle.thumbnail?.source,
    description: wikipediaArticle.description,
    sourceUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(wikipediaArticle.title)}`,
  };

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const readTime = Math.ceil(article.content.split(" ").length / 200) + " min read";

  return (
    <ArticleContent
      article={article}
      date={date}
      readTime={readTime}
    />
  );
}

function ArticleContent({
  article,
  date,
  readTime,
}: {
  article: {
    title: string;
    content: string;
    thumbnail?: string;
    description?: string;
    sourceUrl: string;
  };
  date: string;
  readTime: string;
}) {
  const contentHtml = parseMarkdown(article.content);

  return (
    <div className="max-w-4xl mx-auto px-10 py-12">
      <Link
        href="/"
        className="text-kente-green hover:text-kente-gold text-sm mb-8 inline-block"
      >
        ← Back to Home
      </Link>

      {article.thumbnail && (
        <img
          src={article.thumbnail}
          alt={article.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}

      <div className="mb-6">
        <span className="text-kente-gold text-xs tracking-widest uppercase font-medium">
          {article.description || "Wikipedia Article"}
        </span>
      </div>

      <h1 className="font-display text-[clamp(32px,5vw,48px)] font-black text-ink leading-tight mb-6">
        {article.title}
      </h1>

      <p className="text-gray-500 text-sm mb-8">
        Source: Wikipedia · {date} · {readTime}
      </p>

      <article
        className="prose prose-lg max-w-none font-serif text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      <div className="mt-16 p-8 bg-sand rounded border border-[#e8dfc8]">
        <h3 className="font-display text-xl font-bold text-ink mb-3">
          About this article
        </h3>
        <p className="text-gray-600 mb-4">
          This article content is from Wikipedia and is available under CC-BY-SA license.
        </p>
        <div className="flex gap-3">
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-kente-green text-white px-6 py-2 rounded font-medium hover:bg-kente-gold transition-colors"
          >
            View on Wikipedia
          </a>
          <Link
            href={`/contribute?article=${encodeURIComponent(article.title)}`}
            className="inline-block bg-white text-kente-green border border-kente-green px-6 py-2 rounded font-medium hover:bg-kente-green hover:text-white transition-colors"
          >
            Contribute
          </Link>
        </div>
      </div>
    </div>
  );
}
