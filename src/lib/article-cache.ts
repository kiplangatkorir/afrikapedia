import { cache } from "react";
import * as fs from "fs";
import * as path from "path";

// Pre-fetched articles cache
const ARTICLE_CACHE = new Map<string, any>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// In-memory cache for runtime
const runtimeCache = new Map<string, { data: any; timestamp: number }>();

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
 * Load pre-fetched article from JSON file
 */
function loadPrefetchedArticle(slug: string): any | null {
  // Check in-memory cache first
  const cached = ARTICLE_CACHE.get(slug);
  if (cached) return cached;

  try {
    // Try to load from filesystem (Node.js only)
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
        const article = JSON.parse(content);
        ARTICLE_CACHE.set(slug, article);
        return article;
      }
    }
  } catch (error) {
    console.error(`Failed to load pre-fetch for ${slug}:`, error);
  }

  return null;
}

/**
 * Fetch article with caching (prefetch → runtime cache → Wikipedia API)
 */
export async function fetchArticle(slug: string): Promise<any | null> {
  // Convert slug to title case for API calls
  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Check runtime cache
  const cached = runtimeCache.get(slug);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // Try pre-fetched article first
  const prefetched = loadPrefetchedArticle(slug);
  if (prefetched) {
    runtimeCache.set(slug, { data: prefetched, timestamp: Date.now() });
    return prefetched;
  }

  // Fallback to Wikipedia API
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { next: { revalidate: 3600 } } // Revalidate every hour
    );

    if (!res.ok) return null;

    const data = await res.json();

    const article = {
      title: data.title,
      description: data.description,
      extract: data.extract,
      content: data.extract,
      thumbnail: data.thumbnail?.source,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
      fetchedAt: new Date().toISOString(),
    };

    runtimeCache.set(slug, { data: article, timestamp: Date.now() });
    return article;
  } catch (error) {
    console.error(`Failed to fetch article "${title}":`, error);
    return null;
  }
}

/**
 * Get list of all pre-fetched article slugs
 */
export function getPrefetchedSlugs(): string[] {
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
 * Cache wrapper for use in Server Components
 */
export const getCachedArticle = cache(fetchArticle);
