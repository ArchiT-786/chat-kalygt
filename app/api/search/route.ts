// /app/api/search/route.ts
import { NextRequest } from "next/server";
import { pineconeIndex } from "@/lib/pinecone";
import { embedText } from "@/lib/embed";

export const runtime = "nodejs"; // ensures Serverless Node runtime

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "Invalid query" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const vector = await embedText(query);
    const result = await pineconeIndex.query({
      vector,
      topK: 5,
      includeMetadata: true,
    });

    return new Response(JSON.stringify(result.matches), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Pinecone search error:", err);
    return new Response(JSON.stringify({ error: "Failed to search" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
