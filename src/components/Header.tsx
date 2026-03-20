"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleOpenSearch = () => setSearchOpen(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" || (e.metaKey && e.key === "k")) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };

    window.addEventListener("openSearch", handleOpenSearch);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("openSearch", handleOpenSearch);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="bg-[--bg2] border-b border-[--border] sticky top-0 z-[200]">
        <div className="max-w-[1440px] mx-auto h-[58px] flex items-center gap-10 px-8">
          <Link
            href="/"
            className="flex items-baseline gap-2 no-underline flex-shrink-0"
          >
            <span className="font-display text-[21px] font-bold text-[--text] tracking-[-0.3px]">
              <span className="text-[--gold]">Afrika</span>pedia
            </span>
          </Link>

          <div
            className="flex-1 max-w-[480px] cursor-pointer"
            onClick={() => setSearchOpen(true)}
          >
            <input
              type="text"
              placeholder="Search articles, kingdoms, people…"
              readOnly
              className="w-full bg-[--bg3] border border-[--border2] rounded px-[14px] py-2 text-[13px] text-[--text] placeholder-[--text3] outline-none cursor-pointer"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[--text3] text-sm pointer-events-none">
              ⌕
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1 ml-auto">
            <Link
              href="/explore"
              className="font-sans text-[12px] font-medium text-[--text2] no-underline px-3 py-2 rounded hover:text-[--text] hover:bg-[--bg3] transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/kingdoms"
              className="font-sans text-[12px] font-medium text-[--text2] no-underline px-3 py-2 rounded hover:text-[--text] hover:bg-[--bg3] transition-colors"
            >
              Kingdoms
            </Link>
            <Link
              href="/languages"
              className="font-sans text-[12px] font-medium text-[--text2] no-underline px-3 py-2 rounded hover:text-[--text] hover:bg-[--bg3] transition-colors"
            >
              Languages
            </Link>
            <Link
              href="/contribute"
              className="font-sans text-[12px] font-medium text-[--gold] no-underline px-3 py-2 rounded border border-[--gold2] hover:bg-[--gold-dim] transition-colors"
            >
              Contribute
            </Link>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[--text] p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[300] md:hidden">
          <div
            className="absolute inset-0 bg-black/80"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 w-72 h-full bg-[--bg2] shadow-2xl p-6 pt-20">
            <nav className="flex flex-col gap-1">
              {[
                { href: "/", label: "🏠 Main Page" },
                { href: "/explore", label: "🌍 Explore" },
                { href: "/kingdoms", label: "👑 Kingdoms" },
                { href: "/languages", label: "🗣️ Languages" },
                { href: "/contribute", label: "✏️ Contribute" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-4 text-[--text2] hover:text-[--text] hover:bg-[--bg3] rounded transition-colors font-sans text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black/85 z-[500] flex items-start justify-center pt-32 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="bg-[--bg2] border border-[--border2] rounded w-full max-w-[640px] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center gap-4 p-[18px_22px] border-b border-[--border]">
                <span className="text-[--text3] text-lg">⌕</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Afrikapedia…"
                  className="flex-1 bg-none border-none outline-none font-serif text-lg text-[--text] placeholder-[--text3]"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="font-sans text-[11px] text-[--text3] bg-[--bg3] border border-[--border2] rounded px-2 py-1"
                >
                  esc
                </button>
              </div>
            </form>
            <div className="p-4 text-center text-[--text3] text-sm">
              Search Wikipedia for African topics (e.g., "Mali Empire", "Ubuntu", "Ancient Egypt")
            </div>
          </div>
        </div>
      )}
    </>
  );
}
