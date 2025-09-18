import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log("API key present?", !!process.env.OPENAI_API_KEY);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for HR and education tasks. Be concise and professional.",
        },
        { role: "user", content: prompt || "Say hello" },
      ],
    });

    const answer = completion.choices[0]?.message?.content || "(No answer)";
    return NextResponse.json({ answer });
  } catch (e: any) {
    console.error("OpenAI request failed:", e);
    return NextResponse.json(
      { error: e?.message || JSON.stringify(e, null, 2) || "Unknown error" },
      { status: 500 }
    );
  }
}