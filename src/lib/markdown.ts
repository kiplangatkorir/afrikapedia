export function parseMarkdown(content: string): string {
  let html = content;

  // Escape HTML first
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks (```code```)
  html = html.replace(
    /```([\s\S]*?)```/g,
    '<pre class="bg-gray-100 p-4 rounded my-4 overflow-x-auto"><code>$1</code></pre>',
  );

  // Inline code (`code`)
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm">$1</code>',
  );

  // Headers
  html = html.replace(
    /^#### (.+)$/gm,
    '<h4 class="font-display text-lg font-bold text-ink mt-6 mb-3">$1</h4>',
  );
  html = html.replace(
    /^### (.+)$/gm,
    '<h3 class="font-display text-xl font-bold text-ink mt-8 mb-3">$1</h3>',
  );
  html = html.replace(
    /^## (.+)$/gm,
    '<h2 class="font-display text-2xl font-bold text-ink mt-8 mb-4">$1</h2>',
  );
  html = html.replace(
    /^# (.+)$/gm,
    '<h1 class="font-display text-3xl font-bold text-ink mt-8 mb-4">$1</h1>',
  );

  // Bold and Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/___(.+?)___/g, "<strong><em>$1</em></strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");

  // Blockquotes
  html = html.replace(
    /^&gt; (.+)$/gm,
    '<blockquote class="border-l-4 border-kente-gold pl-4 my-4 italic text-gray-600">$1</blockquote>',
  );

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-accent-teal hover:text-kente-gold underline">$1</a>',
  );

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 mb-1">$1</li>');
  html = html.replace(
    /(<li class="ml-4 mb-1">.*<\/li>\n?)+/g,
    '<ul class="my-4">$&</ul>',
  );

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 mb-1">$1</li>');

  // Horizontal rules
  html = html.replace(
    /^---$/gm,
    '<hr class="my-8 border-t border-gray-300" />',
  );

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p class="my-4">');
  html = '<p class="my-4">' + html + "</p>";

  // Clean up empty paragraphs
  html = html.replace(/<p class="my-4"><\/p>/g, "");
  html = html.replace(/<p class="my-4"><h/g, "<h");
  html = html.replace(/<\/h[1-4]>.*<\/p>/g, (match) => {
    const closingTag = match.match(/<\/h[1-4]>/)?.[0] || "";
    const afterTag = match
      .replace(closingTag, "")
      .replace('<p class="my-4">', "");
    return closingTag + afterTag;
  });

  return html;
}

export function stripMarkdown(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[-*]\s/gm, "")
    .replace(/^\d+\.\s/gm, "")
    .replace(/^>\s/gm, "")
    .replace(/---/g, "");
}
