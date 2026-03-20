"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DesktopToolbar() {
  const [showShortcuts, setShowShortcuts] = useState(false);

  const shortcuts = [
    { key: "/ or Ctrl+K", desc: "Search" },
    { key: "Ctrl+S", desc: "All Articles" },
    { key: "Ctrl+C", desc: "Create" },
    { key: "H", desc: "Home" },
    { key: "?", desc: "Help" },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault();
          setShowShortcuts(!showShortcuts);
        }
      }
      if (e.key === "Escape") {
        setShowShortcuts(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showShortcuts]);

  return (
    <>
      {/* Floating Toolbar */}
      <div className="hidden lg:flex fixed bottom-6 right-6 z-40">
        <div className="flex items-center gap-2 bg-[--bg2]/95 backdrop-blur text-[--text] px-4 py-2 rounded-full shadow-xl border border-[--border]">
          <Link
            href="/create"
            className="p-2 hover:bg-[--bg3] rounded-full transition-colors"
            title="Create Article"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Link>

          <div className="w-px h-6 bg-[--border]" />

          <Link
            href="/search"
            className="p-2 hover:bg-[--bg3] rounded-full transition-colors"
            title="Search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </Link>

          <Link
            href="/explore"
            className="p-2 hover:bg-[--bg3] rounded-full transition-colors"
            title="Explore"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </Link>

          <div className="w-px h-6 bg-[--border]" />

          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="p-2 hover:bg-[--bg3] rounded-full transition-colors"
            title="Keyboard Shortcuts (?)"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Shortcuts Modal */}
      {showShortcuts && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className="bg-[--bg2] border border-[--border2] rounded-2xl shadow-2xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-[--text] flex items-center gap-2">
                ⌨️ Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setShowShortcuts(false)}
                className="text-[--text3] hover:text-[--text] text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-2">
              {shortcuts.map((s) => (
                <div
                  key={s.key}
                  className="flex items-center justify-between py-2 border-b border-[--border]"
                >
                  <span className="text-[--text2]">{s.desc}</span>
                  <kbd className="bg-[--bg3] text-[--text] px-3 py-1 rounded-lg text-sm font-mono font-medium">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>

            <p className="text-[--text3] text-xs mt-6 text-center">
              Press <kbd className="bg-[--bg3] px-1 rounded">ESC</kbd> to close
            </p>
          </div>
        </div>
      )}
    </>
  );
}
