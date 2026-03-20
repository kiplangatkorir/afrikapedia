"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Article {
  title: string;
  extract: string;
  thumbnail?: string;
  description?: string;
}

export default function Home() {
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [randomArticles, setRandomArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      // Fetch featured Africa-related articles from Wikipedia
      const topics = [
        "Mali Empire",
        "Ubuntu (philosophy)",
        "Ancient Egypt",
        "Kingdom of Aksum",
        "Timbuktu",
        "Mansa Musa",
      ];

      const randomTopic = topics[Math.floor(Math.random() * topics.length)];

      try {
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(randomTopic)}`
        );
        const data = await res.json();
        setFeaturedArticle({
          title: data.title,
          extract: data.extract,
          thumbnail: data.thumbnail?.source,
          description: data.description,
        });
      } catch (e) {
        console.error("Failed to fetch featured article", e);
      }

      // Fetch random articles for sidebar
      const otherTopics = topics.filter((t) => t !== randomTopic);
      const shuffled = otherTopics.sort(() => 0.5 - Math.random()).slice(0, 5);

      const articles = await Promise.all(
        shuffled.map(async (topic) => {
          try {
            const res = await fetch(
              `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`
            );
            const data = await res.json();
            return {
              title: data.title,
              extract: data.extract?.slice(0, 100) + "...",
              thumbnail: data.thumbnail?.source,
            };
          } catch {
            return null;
          }
        })
      );

      setRandomArticles(articles.filter(Boolean) as Article[]);
      setLoading(false);
    }

    fetchContent();
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex-1">
      {/* Ribbon */}
      <div
        className="h-[3px] bg-repeat-x"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--gold) 0, var(--gold) 30px, var(--red) 30px, var(--red) 60px, var(--green2) 60px, var(--green2) 90px, var(--bg3) 90px, var(--bg3) 120px)",
        }}
      />

      {/* Page Grid */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[220px_1fr_280px] min-h-[calc(100vh-61px)]">
        {/* Left Sidebar */}
        <aside className="hidden lg:block border-r border-[--border] p-[28px_20px_40px_0] sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto">
          <SidebarLeft />
        </aside>

        {/* Main Content */}
        <main className="p-8 lg:p-9 border-r border-[--border] min-w-0">
          <MainContent
            featuredArticle={featuredArticle}
            randomArticles={randomArticles}
            loading={loading}
            today={today}
          />
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block p-[28px_0_40px_28px] sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto">
          <SidebarRight articles={randomArticles} loading={loading} />
        </aside>
      </div>
    </div>
  );
}

function SidebarLeft() {
  const browseItems = [
    { icon: "🏠", label: "Main Page", active: true },
    { icon: "🎲", label: "Random Article", href: "/articles/" + encodeURIComponent(["Mali Empire", "Ubuntu (philosophy)", "Ancient Egypt"][Math.floor(Math.random() * 3)]) },
    { icon: "⭐", label: "Featured" },
    { icon: "🕐", label: "Recent Changes" },
  ];

  const categories = [
    { icon: "👑", label: "Kingdoms & Empires", href: "/search?q=african+kingdoms" },
    { icon: "🏺", label: "Ancient History", href: "/search?q=ancient+africa" },
    { icon: "✍️", label: "Languages & Scripts", href: "/search?q=african+languages" },
    { icon: "🌿", label: "Indigenous Science", href: "/search?q=african+science" },
    { icon: "🎶", label: "Music & Arts", href: "/search?q=african+music" },
    { icon: "🧬", label: "Medicine & Healing", href: "/search?q=african+medicine" },
    { icon: "💡", label: "Modern Innovation", href: "/search?q=african+innovation" },
    { icon: "🗺️", label: "Geography & Ecology", href: "/search?q=african+geography" },
  ];

  return (
    <div className="flex flex-col gap-7">
      <div>
        <div className="font-sans text-[10px] font-bold tracking-[1.8px] uppercase text-[--text3] mb-[10px] pl-3">
          Browse
        </div>
        {browseItems.map((item) => (
          <Link
            key={item.label}
            href={item.href || "#"}
            className={`flex items-center gap-2 p-[7px_12px] rounded text-[13px] font-medium text-[--text2] hover:text-[--text] hover:bg-[--bg3] transition-colors ${item.active ? "text-[--gold] bg-[--gold-dim]" : ""}`}
          >
            <span className="text-sm opacity-70">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="h-px bg-[--border] my-1" />

      <div>
        <div className="font-sans text-[10px] font-bold tracking-[1.8px] uppercase text-[--text3] mb-[10px] pl-3">
          Categories
        </div>
        {categories.map((cat) => (
          <Link
            key={cat.label}
            href={cat.href}
            className="flex items-center gap-2 p-[7px_12px] rounded text-[13px] font-medium text-[--text2] hover:text-[--text] hover:bg-[--bg3] transition-colors"
          >
            <span className="text-sm opacity-70">{cat.icon}</span>
            {cat.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MainContent({
  featuredArticle,
  randomArticles,
  loading,
  today,
}: {
  featuredArticle: Article | null;
  randomArticles: Article[];
  loading: boolean;
  today: string;
}) {
  if (loading || !featuredArticle) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-kente-green border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-7 pb-5 border-b border-[--border]">
        <span className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-[--text3]">
          Today&apos;s Featured Article
        </span>
        <span className="ml-auto font-sans text-[12px] text-[--text3]">
          {today}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-9 mb-10 pb-9 border-b border-[--border]">
        <div>
          <div className="flex items-center gap-3 mb-[14px]">
            <span className="font-sans text-[10px] font-bold tracking-[1.8px] uppercase text-[--gold]">
              Featured
            </span>
          </div>

          <h1 className="font-display text-[34px] font-bold leading-[1.15] text-[--text] mb-2 tracking-[-0.5px]">
            {featuredArticle.title}
          </h1>
          {featuredArticle.description && (
            <p className="font-serif text-[15px] italic text-[--text2] mb-[18px] leading-relaxed">
              {featuredArticle.description}
            </p>
          )}

          <p className="font-serif text-[15px] leading-[1.8] text-[--text] mb-5">
            {featuredArticle.extract}
          </p>

          <Link
            href={`/articles/${encodeURIComponent(featuredArticle.title)}`}
            className="inline-flex items-center gap-2 mt-5 font-sans text-[12px] font-semibold tracking-[0.5px] text-[--gold] no-underline border-b border-[--gold2] pb-[1px] hover:text-[#e0bf6e] hover:border-[#e0bf6e] transition-colors"
          >
            Read full article <span>→</span>
          </Link>
        </div>

        {featuredArticle.thumbnail && (
          <div className="bg-[--bg3] border border-[--border2] overflow-hidden self-start">
            <img
              src={featuredArticle.thumbnail}
              alt={featuredArticle.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <p className="text-[11px] text-[--text3]">
                Image: {featuredArticle.title}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Search */}
      <div className="bg-[--bg3] border border-[--border2] rounded-lg p-6 mb-10">
        <h2 className="font-display text-xl font-bold text-[--text] mb-4">
          Search Afrikapedia
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = (e.currentTarget.elements[0] as HTMLInputElement).value;
            if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
          }}
          className="flex gap-3"
        >
          <input
            type="text"
            placeholder="Search African topics..."
            className="flex-1 px-4 py-3 bg-[--bg] border border-[--border] rounded text-[--text] placeholder-[--text3] focus:outline-none focus:ring-2 focus:ring-[--gold]"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[--gold] text-[--bg] font-semibold rounded hover:bg-[--gold2] transition-colors"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

function SidebarRight({
  articles,
  loading,
}: {
  articles: Article[];
  loading: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="font-sans text-[10px] font-bold tracking-[1.8px] uppercase text-[--text3] mb-[10px] pl-3">
          Random Articles
        </div>
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-[--bg3] rounded" />
            ))}
          </div>
        ) : (
          articles.map((article) => (
            <Link
              key={article.title}
              href={`/articles/${encodeURIComponent(article.title)}`}
              className="block p-[10px] rounded hover:bg-[--bg3] transition-colors"
            >
              <div className="font-display text-[13px] font-bold text-[--text] mb-1">
                {article.title}
              </div>
              <div className="font-serif text-[11px] text-[--text2] line-clamp-2">
                {article.extract}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
