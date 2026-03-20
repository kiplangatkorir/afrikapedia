import { NextResponse } from "next/server";
import { getLocalSlugs } from "@/lib/article-service";

export async function GET() {
  const localSlugs = getLocalSlugs();
  const fallbackSlugs = [
    "mali-empire",
    "ubuntu-philosophy",
    "ancient-egypt",
    "kingdom-of-aksum",
    "timbuktu",
    "mansa-musa",
  ];

  const allSlugs = localSlugs.length > 0 ? localSlugs : fallbackSlugs;
  const randomSlug = allSlugs[Math.floor(Math.random() * allSlugs.length)];

  return NextResponse.redirect(new URL(`/articles/${randomSlug}`, process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
}
