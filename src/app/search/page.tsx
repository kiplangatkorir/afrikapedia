"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface SearchResult {
  title: string;
  description?: string;
  excerpt: string;
  thumbnail?: string;
  url: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.results || []);
        setLoading(false);
      })
      .catch(() => {
        setResults([]);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <Link
        href="/"
        className="text-kente-green hover:text-kente-gold text-sm mb-8 inline-block"
      >
        ← Back to Home
      </Link>

      <h1 className="font-display text-3xl font-bold text-ink mb-2">Search</h1>
      <p className="text-gray-500 mb-8">
        {query
          ? `Results for "${query}"`
          : "Search for African topics, history, and culture"}
      </p>

      {query && (
        <div className="mb-8">
          <input
            type="text"
            defaultValue={query}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                window.location.href = `/search?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`;
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kente-green"
            placeholder="Search Afrikapedia..."
          />
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-kente-green border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-500 mt-4">Searching Wikipedia...</p>
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <div className="text-center py-12">
          <p className="text-gray-500">No Africa-relevant results found.</p>
          <p className="text-gray-400 text-sm mt-2">
            Try a different search term related to African history, culture, or
            people.
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-6">
          {results.map((result) => (
            <article
              key={result.title}
              className="border border-gray-200 rounded-lg p-5 hover:border-kente-green transition-colors"
            >
              <div className="flex gap-4">
                {result.thumbnail && (
                  <img
                    src={result.thumbnail}
                    alt={result.title}
                    className="w-24 h-24 object-cover rounded flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <Link
                    href={`/articles/${encodeURIComponent(result.title)}`}
                    className="font-display text-xl font-bold text-kente-green hover:text-kente-gold"
                  >
                    {result.title}
                  </Link>
                  {result.description && (
                    <p className="text-gray-500 text-sm mt-1">
                      {result.description}
                    </p>
                  )}
                  <p className="text-gray-600 mt-2 line-clamp-2">
                    {result.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      Source: Wikipedia
                    </span>
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-kente-green hover:underline"
                    >
                      View original
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
