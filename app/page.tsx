"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ChatDemo from "./components/ChatDemo";

type Slide =
  | { title: string; content: string; img?: string; component?: undefined; table?: boolean }
  | { title: string; content: string; img?: undefined; component: "ChatDemo"; table?: boolean };

const slides: Slide[] = [
  {
    title: "Icebreaker",
    content:
      `• What comes to mind when you hear "Artificial Intelligence"?\n` +
      `• Any personal experiences or thoughts about AI?\n` +
      `• Let's get comfortable sharing and exploring together.`,
  },
  {
    title: "AI Landscape",
    content:
      `AI → Machine Learning → Deep Learning → Generative AI\n` +
      `Examples:\n` +
      `• AI: Rule-based systems like spam filters\n` +
      `• ML: Predictive models like recommendation engines\n` +
      `• DL: Neural nets powering image recognition\n` +
      `• GenAI: Creates text, images, code (e.g., ChatGPT)\n` ,
    img: "/aiuniverse.jpeg",
  },
  {
    title: "Practical Applications",
    content:
      `HR: resume screening, policy summarization, interview prep\n` +
      `Education: auto-grading, personalized learning, content creation\n` +
      `Personal productivity: email drafting, scheduling, brainstorming\n` ,
  },
  {
    title: "ChatGPT: Subscription vs API",
    content:
      `Here’s how ChatGPT can be used depending on your needs:\n\n` +
      `• Subscription: use ChatGPT in the web/app — great for individuals.\n` +
      `• API: connect the same model into custom tools — great for teams & automation.\n\n` +
      `See ChatGPT here:\n[ChatGPT](https://chat.openai.com)`,
    table: true,
  },
  {
    title: "Live Demo: ChatGPT API",
    content:
      `Try a simple HR prompt (e.g., "Draft a polite rejection email" or "Summarize this policy paragraph").`,
    component: "ChatDemo",
  },
  {
    title: "Closing & Next Steps",
    content:
      `Which areas excite you most for work/life?\n` +
      `Sample path:\n` +
      `• Session 1: ChatGPT for productivity & HR use cases\n` +
      `• Session 2: Docs, email automation, chatbots\n` +
      `• Session 3: Intro to data & ML (concepts > code)\n` +
      `• Session 4+: Custom projects (resume scanner, policy Q&A bot)`,
  },
];

export default function Deck() {
  const [index, setIndex] = useState(0);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const nextSlide = () => setIndex(i => Math.min(i + 1, slides.length - 1));
  const prevSlide = () => setIndex(i => Math.max(i - 1, 0));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const current = slides[index];

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-gray-900 text-white">
      {/* Progress bar */}
      <div
        className="absolute top-0 left-0 h-1 bg-blue-600"
        style={{ width: `${((index + 1) / slides.length) * 100}%` }}
      />
      <div className="max-w-4xl w-[92%] text-center p-10 rounded-2xl shadow-lg bg-gray-800">
        <motion.h1
          key={current.title}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-6"
        >
          {current.title}
        </motion.h1>

        <div className="text-xl text-left space-y-4">
          {current.content.split("\n").map((line, i) => {
            if (line.startsWith("•")) {
              return (
                <p key={i} className="leading-relaxed">
                  <span className="ml-4 before:content-['•'] before:mr-2">{line.replace("•", "").trim()}</span>
                </p>
              );
            } else if (line.includes("http")) {
              // Check for markdown link [text](url)
              const mdLinkMatch = line.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/);
              if (mdLinkMatch) {
                const [, text, url] = mdLinkMatch;
                return (
                  <p key={i} className="leading-relaxed">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      {text}
                    </a>
                  </p>
                );
              }
              // fallback plain url
              return (
                <p key={i} className="leading-relaxed">
                  <a
                    href={line.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    {line.trim()}
                  </a>
                </p>
              );
            } else {
              return (
                <p key={i} className="leading-relaxed">
                  {line}
                </p>
              );
            }
          })}
        </div>

        {("table" in current && (current as any).table) && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left border border-gray-700 rounded-lg">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2">Feature</th>
                  <th className="px-4 py-2">Subscription</th>
                  <th className="px-4 py-2">API</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-700">
                  <td className="px-4 py-2">Access</td>
                  <td className="px-4 py-2">ChatGPT website/app</td>
                  <td className="px-4 py-2">Code, integrations, workflows</td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="px-4 py-2">Best for</td>
                  <td className="px-4 py-2">Individuals</td>
                  <td className="px-4 py-2">Businesses, automation</td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="px-4 py-2">Pricing</td>
                  <td className="px-4 py-2">Flat monthly</td>
                  <td className="px-4 py-2">Pay per token (usage‑based)</td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="px-4 py-2">Analogy</td>
                  <td className="px-4 py-2">Netflix subscription</td>
                  <td className="px-4 py-2">Building your own app w/ Netflix engine</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {("img" in current && current.img) ? (
          <div className="mt-6 flex justify-center">
            <button onClick={() => setModalImg(current.img!)} className="focus:outline-none">
              <Image
                src={current.img!}
                alt="AI Landscape diagram"
                width={700}
                height={500}
                className="rounded-lg shadow max-h-[400px] w-auto object-contain cursor-pointer"
                priority={index === 1}
              />
            </button>
          </div>
        ) : null}

        {("component" in current && current.component === "ChatDemo") ? (
          <div className="mt-6">
            <ChatDemo />
          </div>
        ) : null}

        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={prevSlide}
            disabled={index === 0}
            className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-40"
          >
            ← Back
          </button>
          <span className="text-sm opacity-80">Slide {index + 1} / {slides.length}</span>
          <button
            onClick={nextSlide}
            disabled={index === slides.length - 1}
            className="px-4 py-2 bg-blue-600 rounded-lg disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
      {modalImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setModalImg(null)}
        >
          <Image
            src={modalImg}
            alt="Expanded view"
            width={1200}
            height={800}
            className="rounded-lg shadow max-h-[90%] w-auto object-contain"
          />
        </div>
      )}
    </div>
  );
}
