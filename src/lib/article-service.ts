import { cache } from "react";
import * as fs from "fs";
import * as path from "path";

// --- Types ---

export interface Article {
  title: string;
  description?: string;
  extract: string;
  content: string;
  thumbnail?: string;
  url: string;
  fetchedAt?: string;
  isLocal?: boolean;
}

export interface WikipediaSearchResult {
  title: string;
  description?: string;
  extract: string;
  thumbnail?: {
    source: string;
  };
}

// --- Configuration ---

const WIKIPEDIA_API = "https://en.wikipedia.org/api/rest_v1";
const WIKIPEDIA_SEARCH = "https://en.wikipedia.org/w/rest.php/v1";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// --- Caching ---

const localCache = new Map<string, { data: Article; timestamp: number }>();

// --- Helpers ---

/**
 * Check if content is Africa-relevant
 */
export function isAfricaRelevant(title: string, extract: string): boolean {
  const africaKeywords = [
    "africa", "african", "afro",
    "egypt", "egyptian", "pharaoh",
    "ethiopia", "ethiopian", "abyssinia",
    "ghana", "mali", "songhai", "ashanti",
    "zulu", "xhosa", "masai", "swahili",
    "bantus", "nilotic", "nilo-saharan",
    "sahara", "sub-saharan", "north africa", "west africa",
    "east africa", "southern africa", "central africa",
    "colonial", "decolonization", "pan-african",
    "african union", "organization of african unity",
    // African countries
    "algeria", "angola", "benin", "botswana", "burkina faso", "burundi",
    "cameroon", "cape verde", "central african republic", "chad", "comoros",
    "congo", "cote d'ivoire", "djibouti", "equatorial guinea", "eritrea",
    "eswatini", "gabon", "gambia", "guinea", "guinea-bissau", "kenya",
    "lesotho", "liberia", "libya", "madagascar", "malawi", "mauritania",
    "mauritius", "morocco", "mozambique", "namibia", "niger", "nigeria",
    "rwanda", "sao tome", "senegal", "seychelles", "sierra leone",
    "somalia", "south africa", "south sudan", "sudan", "tanzania", "togo",
    "tunisia", "uganda", "zambia", "zimbabwe",
    // African cities
    "cairo", "lagos", "kinshasa", "johannesburg", "nairobi", "addis ababa",
    "casablanca", "accra", "dakar", "kampala", "dar es salaam",
    // African people/culture
    "mandela", "gandhi", "lumumba", "nkrumah", "kenyatta", "senghor",
    "tutu", "biko", "fanon", "cabral", "sankara", "mugabe",
    "ubuntu", "harambee", "ujamaa", "negritude",
    // African history
    "trans-atlantic", "middle passage", "scramble for africa",
    "berlin conference", "aparthied", "rhodesia",
  ];

  const searchText = `${title} ${extract}`.toLowerCase();
  return africaKeywords.some(keyword => searchText.includes(keyword));
}

/**
 * Get pre-fetched slugs from filesystem
 */
export function getLocalSlugs(): string[] {
  if (typeof window !== "undefined") return [];

  try {
    const articlesDir = path.join(process.cwd(), "src", "data", "articles");
    if (!fs.existsSync(articlesDir)) return [];

    const files = fs.readdirSync(articlesDir);
    return files
      .filter((file) => file.endsWith(".json"))
      .map((file) => file.replace(".json", ""));
  } catch {
    return [];
  }
}

/**
 * Load a local article by slug
 */
function loadLocalArticle(slug: string): Article | null {
  try {
    if (typeof window === "undefined") {
      const filePath = path.join(
        process.cwd(),
        "src",
        "data",
        "articles",
        `${slug}.json`
      );

      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        const data = JSON.parse(content);
        return {
          ...data,
          slug,
          isLocal: true,
        };
      }
    }
  } catch (error) {
    console.error(`Failed to load local article for ${slug}:`, error);
  }
  return null;
}

// --- Main Service Functions ---

/**
 * Fetch article (local -> cache -> wikipedia)
 */
export const getArticle = cache(async (slug: string): Promise<Article | null> => {
  // 1. Check runtime cache
  const cached = localCache.get(slug);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // 2. Try local file
  const local = loadLocalArticle(slug);
  if (local) {
    localCache.set(slug, { data: local, timestamp: Date.now() });
    return local;
  }

  // 3. Fallback to Wikipedia
  const title = slug.replace(/-/g, " ");
  try {
    const res = await fetch(`${WIKIPEDIA_API}/page/summary/${encodeURIComponent(title)}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const article: Article = {
      title: data.title,
      description: data.description,
      extract: data.extract,
      content: data.extract,
      thumbnail: data.thumbnail?.source,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
      fetchedAt: new Date().toISOString(),
    };

    localCache.set(slug, { data: article, timestamp: Date.now() });
    return article;
  } catch (error) {
    console.error(`Failed to fetch article "${title}":`, error);
    return null;
  }
});

/**
 * Search Wikipedia pages
 */
export async function searchArticles(query: string, limit = 10): Promise<Article[]> {
  try {
    const response = await fetch(
      `${WIKIPEDIA_SEARCH}/search/page?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    if (!response.ok) return [];
    const data = await response.json();
    const pages: WikipediaSearchResult[] = data.pages || [];

    return pages
      .filter((page) => isAfricaRelevant(page.title, page.extract || ""))
      .map((page) => ({
        title: page.title,
        description: page.description,
        extract: page.extract || "",
        content: page.extract || "",
        thumbnail: page.thumbnail?.source,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
      }));
  } catch {
    return [];
  }
}
