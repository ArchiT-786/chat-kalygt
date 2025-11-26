import { pineconeIndex } from "@/lib/pinecone";
import { embedText } from "@/lib/embed";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { question, answer } = await req.json();

    if (!question || !answer) {
      console.warn("⚠ Missing Q/A — skipping.");
      return Response.json({ ok: false });
    }

    console.log("📝 Storing chat → Pinecone (mapped pair)");

    // Create a single text chunk containing question + answer
    const combinedText = `Q: ${question}\nA: ${answer}`;
    const embedding = await embedText(combinedText);

    const id = Date.now().toString();

    await pineconeIndex.upsert([
      {
        id,
        values: embedding,
        metadata: {
          question,
          answer,
          role: "chat_pair",
          timestamp: id,
        },
      },
    ]);

    console.log("✅ Pinecone upsert success");

    return Response.json({ ok: true });
  } catch (err) {
    console.error("❌ store-chat API error:", err);
    return Response.json({ ok: false, error: "Failed to store chat" });
  }
}
