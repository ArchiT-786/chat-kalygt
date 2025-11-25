// /api/search.ts
import { NextApiRequest, NextApiResponse } from "next";
import { pineconeIndex } from "@/lib/pinecone";
import { embedText } from "@/lib/embed";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  try {
    const { query } = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Invalid query" });
    }

    const vector = await embedText(query);
    const result = await pineconeIndex.query({
      vector,
      topK: 5,
      includeMetadata: true,
    });

    res.status(200).json(result.matches);
  } catch (err) {
    console.error("Pinecone search error:", err);
    res.status(500).json({ error: "Failed to search", details: String(err) });
  }
}
