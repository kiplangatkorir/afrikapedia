const WIKIPEDIA_API = "https://en.wikipedia.org/api/rest_v1";
const WIKIPEDIA_SEARCH = "https://en.wikipedia.org/w/rest.php/v1";

export interface WikipediaSummary {
  title: string;
  description?: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  lang: string;
  dir: string;
}

export interface WikipediaSearchResult {
  title: string;
  description?: string;
  extract: string;
  thumbnail?: {
    source: string;
  };
}

export interface WikipediaSearchResponse {
  pages: WikipediaSearchResult[];
}

/**
 * Fetch article summary from Wikipedia
 */
export async function getArticleSummary(title: string): Promise<WikipediaSummary | null> {
  try {
    const response = await fetch(`${WIKIPEDIA_API}/page/summary/${encodeURIComponent(title)}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Search Wikipedia pages
 */
export async function searchPages(query: string, limit = 10): Promise<WikipediaSearchResult[]> {
  try {
    const response = await fetch(
      `${WIKIPEDIA_SEARCH}/search/page?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    if (!response.ok) return [];
    const data: WikipediaSearchResponse = await response.json();
    return data.pages || [];
  } catch {
    return [];
  }
}

/**
 * Get full article content with sections
 */
export async function getArticleSections(title: string): Promise<any[] | null> {
  try {
    const response = await fetch(`${WIKIPEDIA_API}/page/${encodeURIComponent(title)}/sections`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Get full article HTML
 */
export async function getArticleHtml(title: string): Promise<string | null> {
  try {
    const response = await fetch(`${WIKIPEDIA_API}/page/html/${encodeURIComponent(title)}`, {
      headers: {
        Accept: "text/html",
      },
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

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
 * Convert Wikipedia extract to markdown-like format
 */
export function extractToMarkdown(extract: string): string {
  // Basic cleanup - Wikipedia extract is already plain text
  return extract
    .replace(/\n\n+/g, '\n\n')
    .trim();
}
