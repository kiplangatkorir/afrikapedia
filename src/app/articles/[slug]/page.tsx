import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { parseMarkdown } from "@/lib/markdown";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createClient();

  const { data: article, error } = await supabase
    .from("articles")
    .select(
      `
      *,
      categories (name),
      profiles (username)
    `,
    )
    .eq("slug", slug)
    .single();

  if (error || !article) {
    // Fallback to mock data for demo
    const mockArticles: Record<string, any> = {
      "mali-empire": {
        title: "The Mali Empire: West Africa's Golden Age",
        excerpt:
          "At its height in the 14th century, the Mali Empire was among the largest empires in the world.",
        content: `The Mali Empire (c. 1235 – 1600) was a West African empire that at its height ruled over an area stretching from the Atlantic coast to the Sahara Desert. Founded by Sundiata Keita, the empire is famous for its wealth, trade networks, and cultural achievements.

## Origins and Foundation

The empire emerged from the ruins of the Ghana Empire and was founded by Sundiata Keita, a legendary warrior prince who united the Mandé peoples of western Mali. According to oral tradition, Sundiata overcame great obstacles, including physical disability, to fulfill a prophecy and establish a realm that would become one of history's wealthiest states.

## The Reign of Mansa Musa

Perhaps no African ruler in history is more famous than Mansa Musa, who ruled from 1312 to 1337. His legendary pilgrimage to Mecca in 1324, during which he reportedly carried 60,000 men, 12,000 slaves, and 100 tons of gold, famously disrupted Egypt's gold economy for over a decade. Musa's extravagance was so great that he gave away so much gold that it crashed the value across North Africa.

## Economy and Trade

The Mali Empire controlled the trans-Saharan gold and salt trade, which made it extraordinarily wealthy. The empire's capital, Timbuktu, became a renowned center of learning and commerce, attracting scholars, traders, and merchants from across the Islamic world.

## Legacy

The Mali Empire's legacy extends far beyond its territorial bounds. It established traditions of centralized governance, Islamic scholarship, and economic prosperity that continue to influence West African societies today.`,
        category: { name: "Kingdoms & Empires" },
        profiles: { username: "Dr. Amina Yusuf" },
        created_at: "2026-03-15",
        id: "demo-1",
      },
      "ubuntu-philosophy": {
        title: "Ubuntu: I Am Because We Are",
        excerpt:
          "A philosophical concept originating in Southern African cultures emphasizing collective humanity.",
        content: `Ubuntu is a Nguni Bantu term meaning "humanity" or "I am because we are." It is a philosophical concept that emphasizes community, mutual care, and the interconnectedness of all people.

## Origins

Ubuntu has roots in various Southern African cultures, particularly among the Xhosa, Zulu, and Shona peoples. The concept has been part of African social philosophy for centuries and continues to shape communities across the continent.

## Core Principles

The philosophy of Ubuntu centers on several key ideas:
- **Interconnectedness**: Individuals are defined by their relationships with others
- **Compassion**: Showing empathy and care for fellow community members
- **Reciprocity**: The idea that we give and receive in equal measure
- **Human dignity**: Every person deserves respect regardless of status

## Ubuntu in Practice

In practice, Ubuntu manifests in various ways:
- Extended family structures that care for all members
- Community dispute resolution through dialogue
- Collective responsibility for children's upbringing
- Sharing resources during times of need

## Global Recognition

Ubuntu has gained international recognition, influencing fields from computer science (the Ubuntu Linux operating system) to diplomacy and conflict resolution. The concept offers an alternative to individualistic worldviews, emphasizing that human flourishing occurs within community.`,
        category: { name: "Philosophy" },
        profiles: { username: "Prof. Thabo Mkhize" },
        created_at: "2026-03-10",
        id: "demo-2",
      },
    };

    const mockArticle = mockArticles[slug];
    if (!mockArticle) {
      notFound();
    }

    const date = new Date(mockArticle.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const readTime =
      Math.ceil(mockArticle.content.split(" ").length / 200) + " min read";

    return (
      <ArticleContent article={mockArticle} date={date} readTime={readTime} />
    );
  }

  const date = new Date(article.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const readTime =
    Math.ceil(article.content.split(" ").length / 200) + " min read";

  return (
    <ArticleContent
      article={{
        ...article,
        category: article.categories?.name || "Uncategorized",
        author: article.profiles?.username || "Anonymous",
      }}
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
  article: any;
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

      <div className="mb-6">
        <span className="text-kente-gold text-xs tracking-widest uppercase font-medium">
          {article.category?.name || article.category}
        </span>
      </div>

      <h1 className="font-display text-[clamp(32px,5vw,48px)] font-black text-ink leading-tight mb-6">
        {article.title}
      </h1>

      <p className="text-gray-500 text-sm mb-8">
        By {article.author} · {date} · {readTime}
      </p>

      <article
        className="prose prose-lg max-w-none font-serif text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      <div className="mt-16 p-8 bg-sand rounded border border-[#e8dfc8]">
        <h3 className="font-display text-xl font-bold text-ink mb-3">
          Contribute to this article
        </h3>
        <p className="text-gray-600 mb-4">
          Afrikapedia is built by contributors like you. Help improve this
          article.
        </p>
        <Link
          href={`/edit/${article.id}`}
          className="inline-block bg-kente-green text-white px-6 py-2 rounded font-medium hover:bg-kente-gold transition-colors"
        >
          Edit Article
        </Link>
      </div>
    </div>
  );
}
