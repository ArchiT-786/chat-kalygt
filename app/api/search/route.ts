import { NextRequest, NextResponse } from "next/server";
import { pineconeIndex } from "@/lib/pinecone";
import { embedText } from "@/lib/embed";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const vector = await embedText(query);

    const nsIndex = pineconeIndex.namespace("chat");

    const result = await pineconeIndex.query({
      vector,
      topK: 5,
      includeMetadata: true,
    });

    return NextResponse.json(result.matches);
  } catch (error) {
    console.error("Pinecone search error:", error);
    return NextResponse.json({ error: "Failed to search", details: String(error) }, { status: 500 });
  }
}
