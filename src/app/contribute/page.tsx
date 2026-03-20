"use client";

import { useState } from "react";

export default function ContributePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex-1">
      <div
        className="h-[3px] bg-repeat-x"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--gold) 0, var(--gold) 30px, var(--red) 30px, var(--red) 60px, var(--green2) 60px, var(--green2) 90px, var(--bg3) 90px, var(--bg3) 120px)",
        }}
      />

      {/* Mobile Header */}
      <div className="lg:hidden bg-[--bg3] border-b border-[--border] px-4 py-3 flex items-center justify-between sticky top-[61px] z-40">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 text-[--text2] hover:text-[--text]"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <span className="font-sans text-[12px]">Menu</span>
        </button>
        <div className="flex items-center gap-2">
          <button className="bg-[--green2] text-white text-[11px] font-bold px-3 py-2 rounded">
            Publish
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto">
        <WikiEditor sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Mobile Bottom Toolbar */}
      <MobileToolbar />
    </div>
  );
}

function WikiEditor({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px]">
      {/* Main Editor Area */}
      <div className="lg:border-r border-[--border]">
        {/* Wiki Header - Desktop */}
        <div className="hidden lg:block bg-[--bg3] border-b border-[--border] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-sans text-[11px] text-[--text3] uppercase tracking-wide">
              Create article
            </span>
            <span className="text-[--border]">|</span>
            <span className="font-sans text-[11px] text-[--gold] cursor-pointer hover:underline">
              Visual editor
            </span>
            <span className="font-sans text-[11px] text-[--text2] cursor-pointer">
              Wikitext
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="font-sans text-[11px] text-[--text2] hover:text-[--text] px-3 py-1.5">
              🕐 Auto-saved
            </button>
          </div>
        </div>

        {/* Title Input */}
        <div className="px-4 lg:px-6 py-4 border-b border-[--border]">
          <input
            type="text"
            placeholder="Enter article title"
            className="w-full bg-transparent border-none outline-none font-display text-xl lg:text-[24px] text-[--text] placeholder-[--text3]"
          />
          <div className="flex items-center gap-2 mt-2 overflow-x-auto">
            <span className="font-sans text-[11px] text-[--text3] whitespace-nowrap">
              afrikapedia.org/wiki/
            </span>
            <input
              type="text"
              placeholder="article-title"
              className="font-sans text-[12px] text-[--text2] bg-[--bg3] px-2 py-1 rounded border border-[--border] outline-none focus:border-[--gold2] min-w-[120px]"
            />
          </div>
        </div>

        {/* Wiki Toolbar - Scrollable on mobile */}
        <div className="bg-[--bg2] border-b border-[--border] overflow-x-auto">
          <div className="flex items-center gap-1 p-2 min-w-max">
            <WikiToolbarButton icon="B" title="Bold" />
            <WikiToolbarButton icon="I" title="Italic" />
            <WikiToolbarButton icon="U" title="Underline" />
            <div className="w-px h-8 bg-[--border] mx-1 flex-shrink-0" />
            <WikiToolbarButton icon="H2" title="Heading" />
            <WikiToolbarButton icon="¶" title="Paragraph" />
            <div className="w-px h-8 bg-[--border] mx-1 flex-shrink-0" />
            <WikiToolbarButton icon="•" title="Bullet" />
            <WikiToolbarButton icon="1." title="Numbered" />
            <div className="w-px h-8 bg-[--border] mx-1 flex-shrink-0" />
            <WikiToolbarButton icon="🔗" title="Link" />
            <WikiToolbarButton icon="🖼️" title="Image" />
            <WikiToolbarButton icon="❝" title="Quote" />
            <WikiToolbarButton icon="—" title="Line" />
            <WikiToolbarButton icon="📋" title="Reference" />
          </div>
        </div>

        {/* Editor Content */}
        <div className="p-4 lg:p-6">
          <textarea
            className="w-full min-h-[60vh] lg:min-h-[500px] bg-transparent border-none outline-none font-serif text-[15px] text-[--text] leading-relaxed resize-none"
            placeholder={`Start writing your article here...

== Introduction ==
Write a brief introduction to your topic.

== Section 1 ==
Add more sections as needed.

== See also ==
* [[Related article]]

== References ==
<references/>`}
          />
        </div>

        {/* Edit Summary - Mobile */}
        <div className="lg:hidden bg-[--bg3] border-t border-[--border] p-4">
          <label className="block font-sans text-[10px] font-bold tracking-[1.5px] uppercase text-[--text3] mb-2">
            Edit summary (optional)
          </label>
          <input
            type="text"
            placeholder="Briefly describe your changes"
            className="w-full bg-[--bg] border border-[--border] rounded px-3 py-2 font-sans text-[13px] text-[--text] placeholder-[--text3] outline-none focus:border-[--gold2]"
          />

          {/* Mobile Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button className="flex-1 bg-[--green2] hover:bg-[--green] text-white font-sans text-[12px] font-bold uppercase px-4 py-3 rounded-lg transition-colors">
              Publish
            </button>
            <button className="flex-1 bg-[--gold] hover:bg-[#d4b45a] text-[--bg] font-sans text-[12px] font-bold uppercase px-4 py-3 rounded-lg transition-colors">
              Save Draft
            </button>
            <button className="bg-[--bg] border border-[--border2] text-[--text2] font-sans text-[12px] font-bold uppercase px-4 py-3 rounded-lg hover:bg-[--bg3] transition-colors">
              Preview
            </button>
          </div>
        </div>

        {/* Edit Summary - Desktop */}
        <div className="hidden lg:block bg-[--bg3] border-t border-[--border] px-6 py-4">
          <label className="block font-sans text-[10px] font-bold tracking-[1.5px] uppercase text-[--text3] mb-2">
            Edit summary
          </label>
          <input
            type="text"
            placeholder="Briefly describe your changes (optional)"
            className="w-full bg-[--bg] border border-[--border] rounded px-3 py-2 font-sans text-[13px] text-[--text] placeholder-[--text3] outline-none focus:border-[--gold2]"
          />

          <div className="flex items-center gap-3 mt-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-[--gold]" />
              <span className="font-sans text-[11px] text-[--text3]">
                Minor edit
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[--gold]"
                defaultChecked
              />
              <span className="font-sans text-[11px] text-[--text3]">
                Watch this page
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button className="bg-[--green2] hover:bg-[--green] text-white font-sans text-[12px] font-bold tracking-[0.5px] uppercase px-6 py-2.5 rounded transition-colors">
              Publish page
            </button>
            <button className="bg-[--gold] hover:bg-[#d4b45a] text-[--bg] font-sans text-[12px] font-bold tracking-[0.5px] uppercase px-6 py-2.5 rounded transition-colors">
              Publish & continue
            </button>
            <button className="bg-[--bg] border border-[--border2] text-[--text2] font-sans text-[12px] font-bold tracking-[0.5px] uppercase px-6 py-2.5 rounded hover:bg-[--bg3] transition-colors">
              Save draft
            </button>
            <button className="text-[--text3] font-sans text-[12px] px-4 py-2.5 hover:text-[--text] transition-colors ml-auto">
              Show preview
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Desktop */}
      <aside
        className={`hidden lg:block bg-[--bg2] ${sidebarOpen ? "lg:block" : ""}`}
      >
        <div className="sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-[--bg2] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[--border] flex items-center justify-between">
              <span className="font-sans text-[11px] font-bold uppercase text-[--text3]">
                Tools
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-[--text2] text-xl"
              >
                ×
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarContent() {
  return (
    <>
      {/* Page Info */}
      <div className="border-b border-[--border] p-4">
        <div className="font-sans text-[10px] font-bold tracking-[1.5px] uppercase text-[--text3] mb-3">
          Page
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-[--text2]">Reading</span>
            <a href="#" className="text-[--gold] hover:underline">
              py
            </a>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-[--text2]">Editing</span>
            <a href="#" className="text-[--gold] hover:underline">
              ed
            </a>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-[--text2]">History</span>
            <a href="#" className="text-[--gold] hover:underline">
              hi
            </a>
          </div>
        </div>
      </div>

      {/* Article Information */}
      <div className="border-b border-[--border] p-4">
        <div className="font-sans text-[10px] font-bold tracking-[1.5px] uppercase text-[--text3] mb-3">
          Article information
        </div>

        <div className="space-y-3">
          <div>
            <label className="block font-sans text-[10px] text-[--text3] mb-1">
              Category
            </label>
            <select className="w-full bg-[--bg] border border-[--border] rounded px-2 py-2 text-[12px] text-[--text] cursor-pointer">
              <option value="">No category</option>
              <option value="kingdoms">Kingdoms & Empires</option>
              <option value="ancient">Ancient History</option>
              <option value="languages">Languages</option>
            </select>
          </div>

          <div>
            <label className="block font-sans text-[10px] text-[--text3] mb-1">
              Add category
            </label>
            <input
              type="text"
              placeholder="Start typing..."
              className="w-full bg-[--bg] border border-[--border] rounded px-2 py-2 text-[12px] text-[--text] placeholder-[--text3]"
            />
          </div>
        </div>
      </div>

      {/* Citation Templates */}
      <div className="border-b border-[--border] p-4">
        <div className="font-sans text-[10px] font-bold tracking-[1.5px] uppercase text-[--text3] mb-3">
          Insert citation
        </div>
        <div className="space-y-1">
          {[
            { icon: "📖", label: "Book" },
            { icon: "📰", label: "Journal" },
            { icon: "🌐", label: "Website" },
            { icon: "📰", label: "News" },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-2 px-2 py-2 text-left text-[12px] text-[--text2] hover:bg-[--bg3] hover:text-[--text] rounded transition-colors"
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div className="p-4">
        <div className="font-sans text-[10px] font-bold tracking-[1.5px] uppercase text-[--text3] mb-3">
          Templates
        </div>
        <div className="grid grid-cols-2 gap-1">
          {["Featured", "Stub", "Quote", "Fact", "Citation", "Cleanup"].map(
            (t) => (
              <button
                key={t}
                className="px-2 py-2 text-[11px] text-[--text2] hover:bg-[--bg3] hover:text-[--gold] rounded transition-colors text-left"
              >
                {t}
              </button>
            ),
          )}
        </div>
      </div>
    </>
  );
}

function WikiToolbarButton({ icon, title }: { icon: string; title: string }) {
  return (
    <button
      type="button"
      title={title}
      className="w-10 h-10 lg:w-8 lg:h-8 flex items-center justify-center text-[--text2] hover:text-[--text] hover:bg-[--bg3] rounded transition-colors text-lg lg:text-sm"
    >
      {icon}
    </button>
  );
}

function MobileToolbar() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[--bg2] border-t border-[--border] px-4 py-3 z-50">
      <div className="flex items-center justify-around">
        <MobileToolButton icon="📝" label="Edit" />
        <MobileToolButton icon="💾" label="Drafts" />
        <MobileToolButton icon="📤" label="Upload" />
        <MobileToolButton icon="📋" label="Copy" />
        <MobileToolButton icon="📱" label="Share" />
      </div>
    </div>
  );
}

function MobileToolButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="flex flex-col items-center gap-1 text-[--text2] hover:text-[--gold] transition-colors p-2">
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] font-sans">{label}</span>
    </button>
  );
}
