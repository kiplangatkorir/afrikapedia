import Link from "next/link";
import { getArticle, Article } from "@/lib/article-service";

export const revalidate = 3600;

export default async function KingdomsPage() {
  const kingdomSlugs = [
    "mali-empire",
    "kingdom-of-aksum",
    "kingdom-of-kush",
    "songhai-empire",
    "ghana-empire",
    "benin-empire",
    "ashanti-empire",
    "zulu-kingdom",
    "ethiopian-empire",
    "mutapa-empire",
    "kanem-bornu-empire",
    "kilwa-sultanate"
  ];

  const kingdoms = (await Promise.all(kingdomSlugs.map(s => getArticle(s)))).filter(Boolean) as Article[];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <h1 className="font-display text-5xl md:text-6xl font-bold text-[--text] mb-6 tracking-tight">
          Great Kingdoms <span className="text-[--gold]">&</span> Empires
        </h1>
        <p className="text-[--text2] text-lg font-serif leading-relaxed">
          From the gold-rich plains of Mali to the stone-hewn cities of Aksum, explore the sovereign states that shaped the course of world history.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {kingdoms.map((kingdom) => (
          <Link
            key={kingdom.title}
            href={`/articles/${kingdom.title.toLowerCase().replace(/ /g, "-")}`}
            className="group relative flex flex-col md:flex-row gap-8 p-6 bg-[--bg2] border border-[--border] rounded-2xl hover:bg-[--bg3] hover:border-[--gold-dim] transition-all duration-300"
          >
            {kingdom.thumbnail && (
              <div className="w-full md:w-48 h-48 flex-shrink-0 rounded-xl overflow-hidden border border-[--border2]">
                <img
                  src={kingdom.thumbnail}
                  alt={kingdom.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="text-[--gold] text-[10px] font-bold tracking-[3px] uppercase mb-2">
                Imperial Heritage
              </div>
              <h2 className="font-display text-2xl font-bold text-[--text] mb-3 group-hover:text-[--gold] transition-colors">
                {kingdom.title}
              </h2>
              <p className="text-[--text2] text-sm font-serif leading-relaxed line-clamp-4 mb-4">
                {kingdom.extract}
              </p>
              <span className="text-[12px] font-bold text-[--gold] group-hover:translate-x-1 transition-transform inline-block">
                Enter the Archive →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Hero Section for unknown kingdoms */}
      <div className="mt-24 p-12 bg-gradient-to-br from-[--bg2] to-[--bg3] rounded-3xl border border-[--border] text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[--gold] opacity-[0.03] blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full" />
        <h3 className="font-display text-3xl font-bold text-[--text] mb-4">
          Discover More Sovereignties
        </h3>
        <p className="text-[--text2] max-w-xl mx-auto mb-8">
          The history of African statehood is vast. Help us document smaller polities, city-states, and confederations.
        </p>
        <Link
          href="/search?q=african+kingdoms"
          className="inline-flex items-center justify-center bg-[--gold] text-[--bg] px-8 py-4 rounded-xl font-bold hover:bg-[--gold2] transition-all active:scale-95"
        >
          Search All Empires
        </Link>
      </div>
    </div>
  );
}
