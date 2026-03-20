import LanguageCard from "@/components/LanguageCard";
import { getArticle, Article } from "@/lib/article-service";
import Link from "next/link";

export const revalidate = 3600;

export default async function LanguagesPage() {
  const languages = [
    { name: "Swahili", nativeName: "Kiswahili" },
    { name: "Yoruba", nativeName: "Èdè Yorùbá" },
    { name: "Amharic", nativeName: "አማርኛ" },
    { name: "Hausa", nativeName: "Harshen Hausa" },
    { name: "Zulu", nativeName: "isiZulu" },
    { name: "Igbo", nativeName: "Asụsụ Igbo" },
    { name: "Somali", nativeName: "Af Soomaali" },
    { name: "Wolof", nativeName: "Wolof" },
    { name: "Twi", nativeName: "Akan Twi" },
    { name: "Oromo", nativeName: "Afaan Oromoo" },
    { name: "Luganda", nativeName: "Oluganda" },
    { name: "Shona", nativeName: "chiShona" }
  ];

  const scriptSlugs = [
    "ge-ez-script",
    "nsibidi",
    "adinkra-symbols",
    "egyptian-hieroglyphs",
    "tifinagh",
    "vai-syllabary"
  ];

  const scripts = (await Promise.all(scriptSlugs.map(s => getArticle(s)))).filter(Boolean) as Article[];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-16">
        <h1 className="font-display text-5xl font-bold text-[--text] mb-4 tracking-tight">
          Voices <span className="text-[--gold]">&</span> Scripts
        </h1>
        <p className="text-[--text2] text-xl font-serif max-w-2xl leading-relaxed">
          From ancient Ge&apos;ez to modern Swahili, Africa is home to thousands of languages and unique systems of writing.
        </p>
      </div>

      <section className="mb-20">
        <div className="flex items-center gap-3 mb-10">
          <h2 className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-[--gold]">
            Linguistic Diversity
          </h2>
          <div className="h-px bg-[--border] flex-1" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {languages.map((lang) => (
            <LanguageCard
              key={lang.name}
              name={lang.name}
              nativeName={lang.nativeName}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-10">
          <h2 className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-[--gold]">
            Ancient & Indigenous Scripts
          </h2>
          <div className="h-px bg-[--border] flex-1" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {scripts.map((script) => (
            <Link
              key={script.title}
              href={`/articles/${script.title.toLowerCase().replace(/ /g, "-")}`}
              className="group bg-[--bg2] border border-[--border] rounded-2xl p-6 hover:border-[--gold-dim] hover:bg-[--bg3] transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-[--gold-dim] text-[--gold] rounded-lg text-2xl group-hover:bg-[--gold] group-hover:text-[--bg] transition-colors">
                  🖋️
                </div>
                <h3 className="font-display text-xl font-bold text-[--text] group-hover:text-[--gold] transition-colors">
                  {script.title}
                </h3>
              </div>
              <p className="text-[--text2] text-sm font-serif leading-relaxed line-clamp-3">
                {script.extract}
              </p>
              <div className="mt-4 pt-4 border-t border-[--border2] text-[12px] font-bold text-[--gold] text-right">
                Learn Script →
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-20 p-8 border border-[--border] rounded-2xl text-center bg-[--bg3] shadow-inner">
        <p className="text-[--text3] font-serif italic max-w-lg mx-auto">
          &ldquo;When a language dies, a library burns down.&rdquo; — Help us document endangered African languages and scripts.
        </p>
      </div>
    </div>
  );
}
