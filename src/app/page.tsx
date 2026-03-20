import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Afrikapedia — The Free African Encyclopaedia",
};

export default function Home() {
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
          <MainContent />
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block p-[28px_0_40px_28px] sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto">
          <SidebarRight />
        </aside>
      </div>
    </div>
  );
}

function SidebarLeft() {
  const browseItems = [
    { icon: "🏠", label: "Main Page", active: true },
    { icon: "🎲", label: "Random Article" },
    { icon: "⭐", label: "Featured" },
    { icon: "🕐", label: "Recent Changes" },
  ];

  const categories = [
    { icon: "👑", label: "Kingdoms & Empires", count: "41k" },
    { icon: "🏺", label: "Ancient History", count: "34k" },
    { icon: "✍️", label: "Languages & Scripts", count: "51k" },
    { icon: "🌿", label: "Indigenous Science", count: "19k" },
    { icon: "🎶", label: "Music & Arts", count: "28k" },
    { icon: "🧬", label: "Medicine & Healing", count: "17k" },
    { icon: "💡", label: "Modern Innovation", count: "14k" },
    { icon: "🗺️", label: "Geography & Ecology", count: "22k" },
  ];

  const languages = [
    { name: "Kiswahili", native: "سواحيلي" },
    { name: "Yorùbá", native: "Èdè" },
    { name: "አማርኛ", native: "Amharic" },
    { name: "Hausa", native: "هَوْسَ" },
    { name: "isiZulu", native: "Zulu" },
    { name: "Twi", native: "Akan" },
  ];

  return (
    <div className="flex flex-col gap-7">
      {/* Browse Section */}
      <div>
        <div className="font-sans text-[10px] font-bold tracking-[1.8px] uppercase text-[--text3] mb-[10px] pl-3">
          Browse
        </div>
        {browseItems.map((item) => (
          <Link
            key={item.label}
            href="#"
            className={`flex items-center gap-2 p-[7px_12px] rounded text-[13px] font-medium text-[--text2] hover:text-[--text] hover:bg-[--bg3] transition-colors ${item.active ? "text-[--gold] bg-[--gold-dim]" : ""}`}
          >
            <span className="text-sm opacity-70">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="h-px bg-[--border] my-1" />

      {/* Categories */}
      <div>
        <div className="font-sans text-[10px] font-bold tracking-[1.8px] uppercase text-[--text3] mb-[10px] pl-3">
          Categories
        </div>
        {categories.map((cat) => (
          <Link
            key={cat.label}
            href="#"
            className="flex items-center gap-2 p-[7px_12px] rounded text-[13px] font-medium text-[--text2] hover:text-[--text] hover:bg-[--bg3] transition-colors"
          >
            <span className="text-sm opacity-70">{cat.icon}</span>
            {cat.label}
            <span className="ml-auto text-[11px] text-[--text3]">
              {cat.count}
            </span>
          </Link>
        ))}
      </div>

      <div className="h-px bg-[--border] my-1" />

      {/* Languages */}
      <div>
        <div className="font-sans text-[10px] font-bold tracking-[1.8px] uppercase text-[--text3] mb-[10px] pl-3">
          Languages
        </div>
        {languages.map((lang) => (
          <div
            key={lang.name}
            className="p-[6px_12px] rounded hover:bg-[--bg3] cursor-pointer transition-colors"
          >
            <div className="text-[12px] text-[--text2]">{lang.name}</div>
            <div className="text-[11px] text-[--text3]">{lang.native}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div>
      {/* Today's Featured */}
      <div className="flex items-center gap-3 mb-7 pb-5 border-b border-[--border] fade-in">
        <span className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-[--text3]">
          Today&apos;s Featured Article
        </span>
        <span className="ml-auto font-sans text-[12px] text-[--text3]">
          Friday, 20 March 2026
        </span>
      </div>

      {/* Hero Article */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-9 mb-10 pb-9 border-b border-[--border] fade-in delay-1">
        <div>
          <div className="flex items-center gap-3 mb-[14px]">
            <span className="font-sans text-[10px] font-bold tracking-[1.8px] uppercase text-[--gold]">
              Kingdoms & Empires
            </span>
            <span className="font-sans text-[9px] font-bold tracking-[1.5px] uppercase px-[7px] py-[2px] rounded bg-[--gold-dim] text-[--gold] border border-[--gold2]">
              Featured
            </span>
          </div>

          <h1 className="font-display text-[34px] font-bold leading-[1.15] text-[--text] mb-2 tracking-[-0.5px]">
            The Mali Empire
          </h1>
          <p className="font-serif text-[15px] italic text-[--text2] mb-[18px] leading-relaxed">
            The Wealthiest Kingdom the Medieval World Ever Knew
          </p>

          <p className="font-serif text-[15px] leading-[1.8] text-[--text] mb-4">
            <strong className="font-semibold text-white">
              The Mali Empire
            </strong>{" "}
            (c. 1235–1600) was a Mandé state of West Africa, founded by the
            legendary warrior-king{" "}
            <strong className="font-semibold text-white">Sundiata Keita</strong>{" "}
            following the Battle of Kirina in 1235. At its territorial peak
            under{" "}
            <strong className="font-semibold text-white">Mansa Musa</strong> in
            the early 14th century, it covered an estimated 1.29 million
            km²—larger than Western Europe—and controlled nearly half of the
            world&apos;s gold and salt supply.
          </p>

          <p className="font-serif text-[14px] leading-[1.85] text-[--text2] mb-5">
            The empire&apos;s wealth was not merely material. Timbuktu and
            Djenné grew into intellectual capitals of the medieval world. The
            Sankore Madrasah trained tens of thousands of scholars; an estimated
            700,000 manuscripts have been preserved, covering mathematics,
            astronomy, medicine, and Islamic jurisprudence. When Mansa Musa
            departed for his 1324 hajj with 60,000 attendants and twelve tons of
            gold, he arrived in Cairo and inadvertently crashed the Egyptian
            gold market so severely that it did not recover for over a decade.
          </p>

          <Link
            href="/articles/mali-empire"
            className="inline-flex items-center gap-2 mt-5 font-sans text-[12px] font-semibold tracking-[0.5px] text-[--gold] no-underline border-b border-[--gold2] pb-[1px] hover:text-[#e0bf6e] hover:border-[#e0bf6e] transition-colors"
          >
            Read full article <span>→</span>
          </Link>
        </div>

        {/* Infobox */}
        <div className="bg-[--bg3] border border-[--border2] border-t-3 border-t-[--gold] overflow-hidden self-start">
          <div className="bg-[--bg4] p-[14px_18px] border-b border-[--border] text-center">
            <div className="font-display text-[15px] font-bold text-[--text] mb-1">
              Mali Empire
            </div>
            <div className="font-serif text-[12px] italic text-[--text2]">
              Manden Kurufaba
            </div>
          </div>
          <div className="h-40 bg-gradient-to-br from-[#1a1208] via-[#2d1e06] to-[#0d1a0d] flex items-center justify-center text-7xl border-b border-[--border] relative overflow-hidden">
            <span className="relative z-10">🦁</span>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(201,168,76,0.08),transparent_60%),radial-gradient(circle_at_70%_30%,rgba(30,92,53,0.1),transparent_60%)]" />
          </div>
          <div>
            {[
              { key: "Founded", val: "c. 1235 CE" },
              { key: "Peak", val: "c. 1312–1337" },
              { key: "Area", val: "1.29 million km²" },
              { key: "Capital", val: "Niani" },
              { key: "Founder", val: "Sundiata Keita" },
              { key: "Religion", val: "Islam + Mandé" },
              { key: "Language", val: "Manding" },
              { key: "Region", val: "West Africa" },
            ].map((row) => (
              <div
                key={row.key}
                className="grid grid-cols-[110px_1fr] border-b border-[--border] text-[12.5px]"
              >
                <div className="bg-[--bg4] p-[9px_14px] text-[--text3] font-sans font-medium text-[11px] border-r border-[--border]">
                  {row.key}
                </div>
                <div className="p-[9px_14px] text-[--text] font-serif">
                  {row.val}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* In the Encyclopaedia */}
      <div className="flex items-center gap-4 mb-6 fade-in delay-2">
        <span className="font-sans text-[12px] font-bold tracking-[1.8px] uppercase text-[--text3] whitespace-nowrap">
          In the Encyclopaedia
        </span>
        <div className="flex-1 h-px bg-[--border]" />
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[--border] border border-[--border] mb-10 fade-in delay-2">
        <ArticleCell
          category="Indigenous Science"
          categoryColor="text-[#5b9f6a]"
          title="The Dogon's Sirius Knowledge"
          excerpt="The Dogon people of Mali possessed detailed knowledge of Sirius B—a white dwarf star invisible to the naked eye—centuries before Western astronomy confirmed its existence."
          region="Mali · West Africa"
          readTime="6 min"
        />
        <ArticleCell
          category="Philosophy"
          categoryColor="text-[#9b6b9b]"
          title="Ubuntu: A Philosophy of Collective Being"
          excerpt="Umuntu ngumuntu ngabantu—a person is a person through other persons. Ubuntu is a Southern African ethical philosophy centring communal interdependence."
          region="Southern Africa"
          readTime="5 min"
        />
        <ArticleCell
          category="Architecture"
          categoryColor="text-[#5b8abf]"
          title="Great Zimbabwe: Mortarless Stone Masonry"
          excerpt="Built between the 11th and 15th centuries, Great Zimbabwe's granite walls—some reaching 11 metres—were constructed without mortar."
          region="Zimbabwe · Southern Africa"
          readTime="7 min"
        />
        <ArticleCell
          category="Modern Innovation"
          categoryColor="text-[#5bbfbf]"
          title="M-Pesa and the Mobile Money Revolution"
          excerpt="Launched in Kenya by Safaricom in 2007, M-Pesa enabled millions of unbanked citizens to send, receive, and save money through basic mobile phones."
          region="Kenya · East Africa"
          readTime="5 min"
        />
      </div>

      {/* Recently Updated */}
      <div className="flex items-center gap-4 mb-6 fade-in delay-3">
        <span className="font-sans text-[12px] font-bold tracking-[1.8px] uppercase text-[--text3] whitespace-nowrap">
          Recently Updated
        </span>
        <div className="flex-1 h-px bg-[--border]" />
      </div>

      <div className="space-y-0 mb-10 fade-in delay-3">
        <ArticleListItem
          num="01"
          title="The Kingdom of Kush and the Black Pharaohs"
          desc="The Nubian Kingdom of Kush conquered Egypt in 744 BCE, establishing the 25th dynasty—the so-called Black Pharaohs—who ruled for nearly a century."
          tag="Empire"
          tagClass="bg-[rgba(201,168,76,0.12)] text-[--gold]"
        />
        <ArticleListItem
          num="02"
          title="Ge'ez: The Ancient Liturgical Script Still in Daily Use"
          desc="Ge'ez (ግዕዝ), an ancient Semitic language of the Axumite Empire, remains the liturgical script of the Ethiopian Orthodox Church."
          tag="Language"
          tagClass="bg-[rgba(191,138,91,0.12)] text-[#bf8a5b]"
        />
        <ArticleListItem
          num="03"
          title="Nok Terracotta: West Africa's Earliest Sculpture"
          desc="The Nok civilisation of central Nigeria (c. 1500 BCE – 500 CE) produced terracotta figurines of extraordinary sophistication."
          tag="Culture"
          tagClass="bg-[rgba(155,107,155,0.12)] text-[#9b6b9b]"
        />
        <ArticleListItem
          num="04"
          title="Timnit Gebru and the Politics of Ethical AI"
          desc="Ethiopian-American computer scientist Timnit Gebru co-authored the seminal Stochastic Parrots paper on algorithmic bias in AI systems."
          tag="Tech"
          tagClass="bg-[rgba(91,191,191,0.12)] text-[#5bbfbf]"
        />
        <ArticleListItem
          num="05"
          title="The Rift Valley: Cradle of Humankind"
          desc="The East African Rift System stretches 6,000 km. Its fossil beds have yielded some of the oldest known hominin remains."
          tag="Geography"
          tagClass="bg-[rgba(91,138,191,0.12)] text-[#5b8abf]"
        />
      </div>
    </div>
  );
}

function ArticleCell({
  category,
  categoryColor,
  title,
  excerpt,
  region,
  readTime,
}: {
  category: string;
  categoryColor: string;
  title: string;
  excerpt: string;
  region: string;
  readTime: string;
}) {
  return (
    <div className="bg-[--bg] p-[22px_24px] cursor-pointer hover:bg-[--bg2] transition-colors">
      <div
        className={`font-sans text-[10px] font-bold tracking-[1.5px] uppercase ${categoryColor} mb-2`}
      >
        {category}
      </div>
      <div className="font-display text-[17px] font-bold text-[--text] leading-[1.25] mb-2 tracking-[-0.2px]">
        {title}
      </div>
      <div className="font-serif text-[13px] text-[--text2] leading-[1.7] line-clamp-3">
        {excerpt}
      </div>
      <div className="flex items-center gap-[10px] mt-4 pt-3 border-t border-[--border]">
        <span className="font-sans text-[11px] text-[--text3] font-medium">
          {region}
        </span>
        <span className="text-[--text3] text-[10px]">·</span>
        <span className="font-sans text-[11px] text-[--text3]">{readTime}</span>
      </div>
    </div>
  );
}

function ArticleListItem({
  num,
  title,
  desc,
  tag,
  tagClass,
}: {
  num: string;
  title: string;
  desc: string;
  tag: string;
  tagClass: string;
}) {
  return (
    <div className="grid grid-cols-[48px_1fr_auto] gap-5 items-start py-5 border-b border-[--border] cursor-pointer hover:bg-[--bg2]/50 transition-colors">
      <div className="font-display text-[32px] font-bold text-[--border2] leading-none text-right pt-1 transition-colors hover:text-[--gold2]">
        {num}
      </div>
      <div>
        <div className="font-display text-[15px] font-bold text-[--text] mb-1 leading-[1.3] hover:text-[--gold] transition-colors">
          {title}
        </div>
        <div className="font-serif text-[13px] text-[--text2] leading-[1.6] line-clamp-2">
          {desc}
        </div>
      </div>
      <span
        className={`font-sans text-[10px] font-bold tracking-[1.2px] uppercase px-[9px] py-[4px] rounded whitespace-nowrap mt-1 ${tagClass}`}
      >
        {tag}
      </span>
    </div>
  );
}

function SidebarRight() {
  return (
    <div className="flex flex-col gap-8">
      {/* Stats */}
      <div className="fade-in delay-1">
        <div className="font-sans text-[10px] font-bold tracking-[1.8px] uppercase text-[--text3] mb-4 pb-3 border-b border-[--border]">
          Encyclopaedia Stats
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { num: "2.4M", label: "Articles" },
            { num: "54", label: "Nations" },
            { num: "87", label: "Languages" },
            { num: "12k", label: "Editors" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[--bg3] border border-[--border] p-[14px_12px] rounded"
            >
              <div className="font-display text-[20px] font-bold text-[--gold] leading-none mb-1">
                {stat.num}
              </div>
              <div className="font-sans text-[10px] text-[--text3] uppercase font-medium tracking-[0.5px]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* On This Day */}
      <div className="fade-in delay-2">
        <div className="font-sans text-[10px] font-bold tracking-[1.8px] uppercase text-[--text3] mb-4 pb-3 border-b border-[--border]">
          On This Day
        </div>
        <div className="flex flex-col">
          {[
            {
              year: "1897",
              text: "The Benin Punitive Expedition by British forces loots thousands of bronze sculptures from the Royal Palace.",
            },
            {
              year: "1990",
              text: "Namibia achieves independence from South African administration, becoming the last African country to gain independence in the 20th century.",
            },
            {
              year: "1413",
              text: "Completion of the Sankore Mosque library expansion in Timbuktu, housing an estimated 700,000 manuscripts.",
            },
          ].map((item) => (
            <div
              key={item.year}
              className="flex gap-4 py-3 border-b border-[--border] last:border-0"
            >
              <span className="font-display text-[14px] font-bold text-[--gold] flex-shrink-0 w-[38px]">
                {item.year}
              </span>
              <span className="font-serif text-[12.5px] text-[--text2] leading-[1.6]">
                <b className="text-[--text] font-normal">{item.text}</b>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="fade-in delay-2">
        <div className="font-sans text-[10px] font-bold tracking-[1.8px] uppercase text-[--text3] mb-4 pb-3 border-b border-[--border]">
          African Kingdoms Map
        </div>
        <div className="bg-[--bg3] border border-[--border2] rounded h-40 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[--gold2] transition-colors relative overflow-hidden">
          <span className="text-4xl relative z-10">🗺️</span>
          <span className="font-sans text-[11px] text-[--text3] tracking uppercase font-semibold relative z-10">
            Interactive Map
          </span>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.05),transparent_70%)]" />
        </div>
        <p className="font-serif text-[12px] text-[--text3] italic leading-[1.6] mt-3">
          Explore 200+ kingdoms and empires across the continent from 3000 BCE
          to the present day.
        </p>
      </div>

      {/* Did You Know */}
      <div className="fade-in delay-3">
        <div className="font-sans text-[10px] font-bold tracking-[1.8px] uppercase text-[--text3] mb-4 pb-3 border-b border-[--border]">
          Did You Know?
        </div>
        <div className="bg-[--bg3] border border-[--border2] border-l-3 border-l-[--gold] p-4 mb-3">
          <p className="font-serif text-[13px] italic text-[--text] leading-[1.7]">
            That <b className="text-[--gold]">Mansa Musa&apos;</b>s 1324
            pilgrimage was so extravagant that his charitable gold distribution
            in Cairo caused an inflation crisis lasting over a decade.
          </p>
          <div className="font-sans text-[10px] text-[--text3] mt-3">
            — Mali Empire · Mansa Musa
          </div>
        </div>
        <div className="bg-[--bg3] border border-[--border2] border-l-3 border-l-[--green2] p-4">
          <p className="font-serif text-[13px] italic text-[--text] leading-[1.7]">
            That the <b className="text-[--gold]">Ishango bone</b>, found in
            present-day DRC and dated to 25,000 BCE, is considered by some
            scholars to be the earliest known mathematical object.
          </p>
          <div className="font-sans text-[10px] text-[--text3] mt-3">
            — Ishango · Congo Basin
          </div>
        </div>
      </div>
    </div>
  );
}
