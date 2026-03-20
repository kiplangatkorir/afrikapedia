"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ArticleEditorProps {
  initialData?: {
    id?: string;
    title: string;
    excerpt: string;
    content: string;
    category_id: string;
  };
  mode: "create" | "edit";
}

const categories = [
  { id: "ancient-civilizations", name: "Ancient Civilizations" },
  { id: "music-arts", name: "Music & Arts" },
  { id: "indigenous-science", name: "Indigenous Science" },
  { id: "kingdoms-empires", name: "Kingdoms & Empires" },
  { id: "geography-land", name: "Geography & Land" },
  { id: "medicine-healing", name: "Medicine & Healing" },
  { id: "languages-scripts", name: "Languages & Scripts" },
  { id: "modern-innovation", name: "Modern Innovation" },
];

export default function ArticleEditor({
  initialData,
  mode,
}: ArticleEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [categoryId, setCategoryId] = useState(
    initialData?.category_id || categories[0].id,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (publish: boolean = false) => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const endpoint =
        mode === "create"
          ? "/api/articles"
          : `/api/articles/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          category_id: categoryId,
          publish,
        }),
      });

      if (!res.ok) throw new Error("Failed to save article");

      const data = await res.json();
      router.push(`/articles/${data.slug}`);
    } catch (err) {
      setError("Failed to save article. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <div className="max-w-4xl mx-auto px-10 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-black text-ink">
          {mode === "create" ? "Create New Article" : "Edit Article"}
        </h1>
        <p className="text-gray-500 mt-2">
          {mode === "create"
            ? "Share your knowledge about African history, culture, or innovation."
            : "Improve this article for the Afrikapedia community."}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Article Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., The Great Mosque of Djenné"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kente-gold focus:border-kente-gold outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            URL: /articles/{title ? generateSlug(title) : "your-article-title"}
          </p>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A brief summary that appears in search results and article previews..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kente-gold focus:border-kente-gold outline-none resize-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kente-gold focus:border-kente-gold outline-none bg-white"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Article Content *{" "}
            <span className="text-gray-400 font-normal">
              (Markdown supported)
            </span>
          </label>

          {/* Toolbar */}
          <div className="flex gap-2 mb-2 p-2 bg-gray-50 border border-b-0 border-gray-300 rounded-t-lg">
            <button
              type="button"
              className="px-3 py-1 text-sm bg-white border border-gray-200 rounded hover:bg-gray-100 font-bold"
            >
              B
            </button>
            <button
              type="button"
              className="px-3 py-1 text-sm bg-white border border-gray-200 rounded hover:bg-gray-100 italic"
            >
              I
            </button>
            <button
              type="button"
              className="px-3 py-1 text-sm bg-white border border-gray-200 rounded hover:bg-gray-100"
            >
              H2
            </button>
            <button
              type="button"
              className="px-3 py-1 text-sm bg-white border border-gray-200 rounded hover:bg-gray-100"
            >
              Quote
            </button>
            <button
              type="button"
              className="px-3 py-1 text-sm bg-white border border-gray-200 rounded hover:bg-gray-100"
            >
              • List
            </button>
            <button
              type="button"
              className="px-3 py-1 text-sm bg-white border border-gray-200 rounded hover:bg-gray-100"
            >
              Link
            </button>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              "Write your article here...\n\n## Section Heading\n\nWrite your content here. You can use **bold**, *italic*, and [links](url).\n\n### Subsection\n\n- List item 1\n- List item 2\n\n> Blockquote for notable quotes\n\nUse Markdown formatting for best results."
            }
            rows={20}
            className="w-full px-4 py-3 border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-kente-gold focus:border-kente-gold outline-none resize-y font-mono text-sm"
          />

          <p className="text-xs text-gray-500 mt-2">
            Pro tip: Use ## for headings, **bold** for emphasis, - for bullet
            points, and {">"} for quotes.
          </p>
        </div>

        {/* Preview */}
        <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-kente-gold">
            👁️ Preview Article
          </summary>
          <div className="mt-4 prose prose-lg max-w-none">
            <h1 className="font-display text-2xl font-bold text-ink">
              {title || "Article Title"}
            </h1>
            {excerpt && <p className="text-gray-600 italic">{excerpt}</p>}
            <div className="mt-4 text-gray-700 whitespace-pre-wrap font-serif">
              {content || "Article content will appear here..."}
            </div>
          </div>
        </details>

        {/* Actions */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-6 py-3 bg-kente-green text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            Publish Article
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors ml-auto"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
