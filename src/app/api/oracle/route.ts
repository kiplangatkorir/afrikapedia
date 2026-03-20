import { askOracle } from "@/lib/anthropic";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 },
      );
    }

    const answer = await askOracle(question);

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Oracle error:", error);
    return NextResponse.json(
      { error: "Failed to get answer" },
      { status: 500 },
    );
  }
}
