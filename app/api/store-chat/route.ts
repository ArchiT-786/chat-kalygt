import { pineconeIndex } from "@/lib/pinecone";
import { embedText } from "@/lib/embed";

export const runtime = "nodejs";

async function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

export async function POST(req: Request) {
  try {
    const { question, answer } = await req.json();

    if (!question || !answer) {
      console.warn("Missing question or answer. Skipping store.");
      return Response.json({ ok: false });
    }

    console.log("📝 Storing chat → Pinecone...");
    console.log("Question:", question.slice(0, 60));
    console.log("Answer length:", answer.length);

    const qVec = await embedText(question);
    const aVec = await embedText(answer);

    const id = Date.now().toString();

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await pineconeIndex.upsert([
          {
            id: `q-${id}`,
            values: qVec,
            metadata: { text: question, role: "user", timestamp: id },
          },
          {
            id: `a-${id}`,
            values: aVec,
            metadata: { text: answer, role: "assistant", timestamp: id },
          },
        ]);

        console.log("✅ Pinecone upsert success");
        break;
      } catch (err) {
        console.error(`❌ Upsert failed (attempt ${attempt}):`, err);
        if (attempt === 3) throw err;
        await delay(300 * attempt);
      }
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("❌ store-chat API error:", err);
    return Response.json({ ok: false, error: "Failed to store chat" });
  }
}
