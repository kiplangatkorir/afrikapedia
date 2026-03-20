import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-sand flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">📡</div>
        <h1 className="font-display text-3xl font-black text-ink mb-4">
          You're Offline
        </h1>
        <p className="text-gray-600 mb-8 font-serif">
          Don't let connectivity stop your learning. Browse cached articles or
          check back when you're back online.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-kente-gold text-kente-black py-3 px-6 rounded-lg font-medium hover:bg-[#e6950f] transition-colors"
          >
            ← Back to Home
          </Link>

          <p className="text-xs text-gray-500">
            💡 Pro tip: Bookmark articles while online to read offline later
          </p>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg border border-[#e8dfc8]">
          <h2 className="font-display text-lg font-bold text-ink mb-3">
            While you wait...
          </h2>
          <p className="text-sm text-gray-600 font-serif italic">
            "Until the lion learns to write, every story will glorify the
            hunter."
          </p>
          <p className="text-xs text-gray-400 mt-2">— African Proverb</p>
        </div>
      </div>
    </div>
  );
}
