import Link from "next/link";
import { getLocalSlugs, getArticle, Article } from "@/lib/article-service";
import CategoryCard from "@/components/CategoryCard";

export const revalidate = 3600;

export default async function ExplorePage() {
  const slugs = getLocalSlugs();
  const articles = (await Promise.all(slugs.slice(0, 12).map(s => getArticle(s)))).filter(Boolean) as Article[];

  const categories = [
    { name: "Ancient Civilizations", icon: "🏺", count: "42", color: "gold", href: "/search?q=ancient+africa" },
    { name: "Music & Arts", icon: "🎶", count: "128", color: "red", href: "/search?q=african+music" },
    { name: "Indigenous Science", icon: "🌿", count: "64", color: "green", href: "/search?q=african+science" },
    { name: "Kingdoms & Empires", icon: "👑", count: "89", color: "clay", href: "/kingdoms" },
    { name: "Geography & Land", icon: "🗺️", count: "215", color: "teal", href: "/search?q=african+geography" },
    { name: "Medicine & Healing", icon: "🧪", count: "37", color: "green", href: "/search?q=african+medicine" },
    { name: "Languages & Scripts", icon: "🖋️", count: "156", color: "gold", href: "/languages" },
    { name: "Modern Innovation", icon: "💡", count: "92", color: "red", href: "/search?q=african+innovation" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="font-display text-5xl font-bold text-[--text] mb-4 tracking-tight">
          Explore the Continent
        </h1>
        <p className="text-[--text2] text-xl font-serif max-w-2xl leading-relaxed">
          Journey through the vast history, diverse cultures, and groundbreaking innovations of Africa.
        </p>
      </div>

      {/* Categories Grid */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-[--gold]">
            Knowledge Categories
          </h2>
          <div className="h-px bg-[--border] flex-1" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.name}
              name={cat.name}
              icon={cat.icon}
              count={cat.count}
              color={cat.color as any}
              href={cat.href}
            />
          ))}
        </div>
      </section>

      {/* Featured Articles Grid */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <h2 className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-[--gold]">
            Curated Highlights
          </h2>
          <div className="h-px bg-[--border] flex-1" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.title}
              href={`/articles/${article.title.toLowerCase().replace(/ /g, "-")}`}
              className="group bg-[--bg2] border border-[--border] rounded-xl overflow-hidden hover:border-[--gold-dim] transition-all duration-300 flex flex-col"
            >
              {article.thumbnail && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-display text-xl font-bold text-[--text] mb-2 group-hover:text-[--gold] transition-colors">
                  {article.title}
                </h3>
                <p className="text-[--text2] text-sm font-serif line-clamp-3 mb-4 leading-relaxed">
                  {article.extract}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-[--border2]">
                  <span className="text-[10px] text-[--text3] uppercase tracking-wider">
                    {article.isLocal ? "Verified" : "Archive"}
                  </span>
                  <span className="text-[12px] font-bold text-[--gold] group-hover:translate-x-1 transition-transform">
                    Read More →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
