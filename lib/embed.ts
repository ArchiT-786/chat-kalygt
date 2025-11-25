import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function embedText(text: string): Promise<number[]> {
  try {
    const response = await client.embeddings.create({
      model: "text-embedding-3-small", // 1536D
      input: text,
    });

    return response.data[0].embedding; // array of 1536 numbers
  } catch (err) {
    console.error("❌ Embedding generation failed:", err);
    throw err;
  }
}
