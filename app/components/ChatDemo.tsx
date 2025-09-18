"use client";
import { useState, useEffect } from "react";

export default function ChatDemo() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("chatTranscript", JSON.stringify(history));
    }
  }, [history]);

  const ask = async () => {
    setLoading(true);
    setError(null);
    setAnswer(null);
    const userMessage = { role: "user", content: input };
    setHistory((prev) => [...prev, userMessage]);
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
      const assistantMessage = { role: "assistant", content: data.answer };
      setAnswer(data.answer);
      setHistory((prev) => [...prev, assistantMessage]);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-xl border border-gray-700 bg-gray-900 p-4 text-left max-h-[600px] overflow-y-auto"
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
            setHistory([]);
            localStorage.removeItem("chatTranscript");
          }}
          className="px-4 py-2 rounded-lg bg-gray-700"
        >
          Clear
        </button>
      </div>

      {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
      {answer && (
        <div className="mt-4 max-h-96 overflow-y-auto whitespace-pre-wrap rounded-lg bg-gray-800 p-3">
          {answer}
        </div>
      )}
      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm opacity-80 mb-2">Transcript</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history.map((msg, i) => (
              <div key={i} className="text-sm">
                <span className={msg.role === "user" ? "text-blue-400" : "text-green-400"}>
                  {msg.role === "user" ? "You: " : "AI: "}
                </span>
                {msg.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}