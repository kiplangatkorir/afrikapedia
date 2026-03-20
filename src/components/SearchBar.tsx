"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  size?: "default" | "large";
}

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
  size = "default",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`${size === "large" ? "max-w-xl" : "max-w-full"} w-full`}
    >
      <div className="flex bg-white rounded-lg md:rounded border-2 border-kente-gold overflow-hidden shadow-lg md:shadow-[0_0_40px_rgba(245,166,35,0.2)]">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 md:px-5 py-3 md:py-4 text-base border-none outline-none text-ink bg-transparent placeholder-gray-400 font-sans"
        />
        <button
          type="submit"
          className="bg-kente-gold px-5 md:px-7 py-3 md:py-4 text-lg md:text-xl border-none cursor-pointer hover:bg-[#e6950f] transition-colors flex items-center active:scale-95"
        >
          <span className="hidden md:inline">🔍</span>
          <span className="md:hidden">Search</span>
        </button>
      </div>
    </form>
  );
}
