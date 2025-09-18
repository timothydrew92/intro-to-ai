// app/api/summarize/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { slides = [], icebreakerNotes = "", selectedUseCases = [], transcript = "" } = await req.json();

    const prompt = `
You are an assistant creating a professional summary for an AI Discovery Deck workshop.

Include only these sections:
1. **Icebreaker Insights** – Summarize the participant’s responses:
${icebreakerNotes || "No notes recorded."}

2. **Practical Applications Chosen**
${selectedUseCases.length > 0 
  ? selectedUseCases.map((u: string) => `- ${u}`).join("\n") 
  : "No specific use cases chosen."}

⚡ Deliver the output in Markdown format with clear headers, short paragraphs, and bullet points where appropriate.
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that writes polished professional workshop summaries.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    });

    const summary = completion.choices[0]?.message?.content?.trim() || "No summary generated.";

    return NextResponse.json({ summary });
  } catch (err: any) {
    console.error("Summarize API error:", err);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}