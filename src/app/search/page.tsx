"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

interface SearchResult {
  title: string;
  description?: string;
  excerpt: string;
  thumbnail?: string;
  url: string;
  slug: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(query);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/"
        className="text-[--gold] hover:text-[--gold2] text-sm mb-8 inline-flex items-center gap-2 transition-colors"
      >
        ← Back to Home
      </Link>

      <h1 className="font-display text-4xl font-bold text-[--text] mb-2 tracking-tight">Search</h1>
      <p className="text-[--text3] mb-10 font-serif italic">
        {query
          ? `Searching the archives for "${query}"`
          : "Discover African history, culture, and innovation"}
      </p>

      <form onSubmit={handleSearch} className="mb-12">
        <div className="relative group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-[--bg2] border border-[--border] rounded-lg px-6 py-4 text-lg text-[--text] placeholder-[--text3] outline-none focus:border-[--gold] transition-all"
            placeholder="Search Afrikapedia..."
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[--gold] text-[--bg] p-2 rounded-md hover:bg-[--gold2] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin w-10 h-10 border-4 border-[--gold] border-t-transparent rounded-full mb-4" />
          <p className="text-[--text3] font-serif">Consulting the records...</p>
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <div className="text-center py-20 bg-[--bg2] rounded-xl border border-dashed border-[--border]">
          <div className="text-5xl mb-4 opacity-20">📜</div>
          <p className="text-[--text2] text-lg font-display mb-2">No relevant entries found</p>
          <p className="text-[--text3] text-sm max-w-sm mx-auto">
            Try searching for broader African topics like "Mali Empire", "Great Zimbabwe", or "Yoruba culture".
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-8">
          {results.map((result) => (
            <article
              key={result.title}
              className="group bg-[--bg2] border border-[--border] rounded-xl p-6 hover:border-[--gold-dim] hover:bg-[--bg3] transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {result.thumbnail && (
                  <div className="w-full md:w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg border border-[--border]">
                    <img
                      src={result.thumbnail}
                      alt={result.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/articles/${result.slug}`}
                    className="font-display text-2xl font-bold text-[--text] group-hover:text-[--gold] transition-colors inline-block mb-1"
                  >
                    {result.title}
                  </Link>
                  {result.description && (
                    <p className="text-[--gold2] text-[11px] font-bold tracking-widest uppercase mb-3">
                      {result.description}
                    </p>
                  )}
                  <p className="text-[--text2] text-[15px] leading-relaxed line-clamp-2 font-serif mb-4">
                    {result.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[--text3] uppercase tracking-wider">
                      Source: Wikipedia
                    </span>
                    <Link
                      href={`/articles/${result.slug}`}
                      className="text-[12px] font-bold text-[--gold] hover:text-[--gold2] transition-colors"
                    >
                      Read Article →
                    </Link>
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

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[--bg] px-6 py-12">
      <Suspense fallback={
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-20">
          <div className="animate-spin w-10 h-10 border-4 border-[--gold] border-t-transparent rounded-full mb-4" />
        </div>
      }>
        <SearchContent />
      </Suspense>
    </div>
  );
}
