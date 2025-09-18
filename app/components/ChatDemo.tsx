"use client";
import { useState } from "react";

export default function ChatDemo() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = async () => {
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt:
            input ||
            "Draft a kind, professional rejection email to a candidate who was not selected.",
        }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setAnswer(data.answer);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-xl border border-gray-700 bg-gray-900 p-4 text-left"
      tabIndex={0}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <label className="block text-sm opacity-80 mb-2">Try an HR prompt</label>
      <textarea
        className="w-full rounded-lg bg-gray-800 p-3 outline-none"
        rows={3}
        placeholder='e.g., "Summarize this policy paragraph ..."'
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="mt-3 flex gap-3">
        <button
          onClick={ask}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 disabled:opacity-40"
        >
          {loading ? "Asking..." : "Run with API"}
        </button>
        <button
          onClick={() => {
            setInput("");
            setAnswer(null);
            setError(null);
          }}
          className="px-4 py-2 rounded-lg bg-gray-700"
        >
          Clear
        </button>
      </div>

      {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
      {answer && (
        <div className="mt-4 whitespace-pre-wrap rounded-lg bg-gray-800 p-3">
          {answer}
        </div>
      )}
    </div>
  );
}