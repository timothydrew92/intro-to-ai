"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ChatDemo from "./components/ChatDemo";
import { jsPDF } from "jspdf";

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
    title: "AI History & Ethics",
    content:
      `History Highlights:\n` +
      `• 1956: “Artificial Intelligence” coined at the Dartmouth Conference.\n` +
      `• 1960s–70s: Rule-based expert systems explored (symbolic “if-then” logic).\n` +
      `• 1997: IBM Deep Blue defeats world chess champion Garry Kasparov.\n` +
      `• 2012: Deep Learning breakthrough (AlexNet wins ImageNet competition).\n` +
      `• 2017: Transformer models introduced, paving the way for ChatGPT.\n\n` +
      `Ethics Matters:\n` +
      `• ⚖️ AI reflects biases in training data (hiring, policing, healthcare).\n` +
      `• 🔒 Privacy and data protection are central concerns.\n` +
      `• 🕵️ Transparency: models can act like “black boxes.”\n` +
      `• 🌍 Responsibility: AI should amplify human potential, not harm it.`,
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
  const [icebreakerNotes, setIcebreakerNotes] = useState("");
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);
  const [loadingTranscript, setLoadingTranscript] = useState(false);

  const toggleUseCase = (useCase: string) => {
    setSelectedUseCases((prev) =>
      prev.includes(useCase) ? prev.filter((u) => u !== useCase) : [...prev, useCase]
    );
  };

  const nextSlide = async () => {
    // If transitioning from slide 6 ("Live Demo: ChatGPT API", index 5) to slide 7 ("Closing & Next Steps", index 6)
    if (index === 5) {
      setLoadingTranscript(true);
      // Get chat transcript from localStorage and send to /api/summarize, along with notes and use cases
      const chatTranscript = localStorage.getItem("chatTranscript") || "";
      try {
        await fetch('/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatTranscript,
            icebreakerNotes,
            selectedUseCases,
          }),
        });
      } catch (err) {
        // Fail silently, do not block navigation
      } finally {
        setLoadingTranscript(false);
      }
    }
    setIndex(i => Math.min(i + 1, slides.length - 1));
  };
  const prevSlide = () => setIndex(i => Math.max(i - 1, 0));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const current = slides[index];
      const targetTag = (e.target as HTMLElement).tagName.toLowerCase();
      if (current.title === "Icebreaker" && (targetTag === "textarea" || targetTag === "input")) {
        // do not advance slides on spacebar when typing in textarea or input on Icebreaker slide
        if (e.key === "ArrowRight") nextSlide();
        if (e.key === "ArrowLeft") prevSlide();
        return;
      }
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index]);

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
          {current.title === "Practical Applications" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {[
                { key: "HR", emoji: "👩‍💼", title: "HR", scenario: "Upload 200 resumes, get a ranked shortlist." },
                { key: "Education", emoji: "📚", title: "Education", scenario: "Paste 30 essays, get summaries + auto-grades." },
                { key: "Productivity", emoji: "📅", title: "Productivity", scenario: "Draft automated emails while you focus on interviews." },
              ].map((card) => (
                <div
                  key={card.key}
                  onClick={() => toggleUseCase(card.key)}
                  className={`p-6 rounded-lg shadow cursor-pointer transition ${
                    selectedUseCases.includes(card.key)
                      ? "bg-blue-700 border-2 border-blue-400"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  <div className="text-4xl mb-4">{card.emoji}</div>
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <p className="text-sm opacity-90">{card.scenario}</p>
                </div>
              ))}
            </div>
          ) : (
            current.content.split("\n").map((line, i) => {
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
            })
          )}
          {current.title === "Icebreaker" && (
            <textarea
              value={icebreakerNotes}
              onChange={(e) => setIcebreakerNotes(e.target.value)}
              placeholder="Type participant's responses here..."
              className="w-full mt-4 p-2 rounded bg-gray-700 text-white"
              rows={4}
            />
          )}
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
            disabled={index === 0 || loadingTranscript}
            className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-40"
          >
            ← Back
          </button>
          <span className="text-sm opacity-80">Slide {index + 1} / {slides.length}</span>
          <button
            onClick={async () => { await nextSlide(); }}
            disabled={index === slides.length - 1 || loadingTranscript}
            className="px-4 py-2 bg-blue-600 rounded-lg disabled:opacity-40"
          >
            Next →
          </button>
        </div>
        {loadingTranscript && (
          <div className="mt-4 text-blue-300 text-center">Preparing summary and transcript...</div>
        )}

        {current.title === "Closing & Next Steps" && (
          <div className="mt-6">
            <button
              onClick={async () => {
                setExporting(true);
                try {
                  const chatTranscript = localStorage.getItem("chatTranscript") || "";
                  const response = await fetch('/api/summarize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      slides,
                      icebreakerNotes,
                      selectedUseCases,
                      chatTranscript,
                    }),
                  });
                  const { summary } = await response.json();
                  const summaryText = summary;

                  const doc = new jsPDF();
                  const margin = 10;
                  const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
                  const pageHeight = doc.internal.pageSize.getHeight() - margin * 2;
                  const lineHeight = 7;
                  let y = margin;

                  doc.setFontSize(12);
                  const lines = doc.splitTextToSize(summaryText, pageWidth);
                  for (let i = 0; i < lines.length; i++) {
                    if (y + lineHeight > pageHeight) {
                      doc.addPage();
                      y = margin;
                    }
                    doc.text(lines[i], margin, y);
                    y += lineHeight;
                  }

                  // Load AI Landscape image and add to PDF
                  await new Promise<void>((resolve, reject) => {
                    const img = new window.Image();
                    img.crossOrigin = "anonymous";
                    img.src = "/aiuniverse.jpeg";
                    img.onload = () => {
                      const imgWidth = pageWidth;
                      const imgHeight = (img.height / img.width) * imgWidth;
                      if (y + imgHeight > pageHeight) {
                        doc.addPage();
                        y = margin;
                      }
                      doc.addImage(img, "JPEG", margin, y, imgWidth, imgHeight);
                      y += imgHeight + lineHeight;
                      resolve();
                    };
                    img.onerror = (e) => {
                      // If image fails to load, just resolve without adding image
                      resolve();
                    };
                  });

                  // Always start transcript on a new page
                  doc.addPage();
                  y = margin;
                  // Add ChatGPT Demo Transcript section header
                  doc.setFontSize(14);
                  doc.text("ChatGPT Demo Transcript", margin, y);
                  y += lineHeight * 1.5;
                  doc.setFontSize(12);

                  let parsedTranscript: { role: string; content: string }[] = [];
                  try {
                    if (chatTranscript) {
                      parsedTranscript = JSON.parse(chatTranscript);
                    }
                  } catch (e) {
                    // Ignore parse errors, leave transcript empty
                  }
                  // Only show up to 3 exchanges (user + assistant)
                  // Assume format: [{role: "user", content}, {role: "assistant", content}, ...]
                  // Group as pairs: user, assistant
                  const exchanges: { user: string; ai: string }[] = [];
                  for (let i = 0; i < parsedTranscript.length - 1 && exchanges.length < 3; i++) {
                    if (
                      parsedTranscript[i].role === "user" &&
                      parsedTranscript[i + 1].role === "assistant"
                    ) {
                      exchanges.push({
                        user: parsedTranscript[i].content,
                        ai: parsedTranscript[i + 1].content,
                      });
                      i++; // skip assistant, next i will be next user
                    }
                  }
                  // Write exchanges to PDF
                  exchanges.forEach((ex, idx) => {
                    // User message
                    const userLines = doc.splitTextToSize(`You: ${ex.user}`, pageWidth);
                    userLines.forEach((line: string) => {
                      if (y + lineHeight > pageHeight) {
                        doc.addPage();
                        y = margin;
                      }
                      doc.text(line, margin, y);
                      y += lineHeight;
                    });
                    // AI message
                    const aiLines = doc.splitTextToSize(`AI: ${ex.ai}`, pageWidth);
                    aiLines.forEach((line: string) => {
                      if (y + lineHeight > pageHeight) {
                        doc.addPage();
                        y = margin;
                      }
                      doc.text(line, margin, y);
                      y += lineHeight;
                    });
                    // Add spacing between exchanges
                    y += lineHeight * 0.5;
                  });

                  doc.save("AI_Discovery_Session.pdf");
                } finally {
                  setExporting(false);
                }
              }}
              className="px-4 py-2 bg-green-600 rounded-lg"
              disabled={exporting}
            >
              {exporting ? "Exporting..." : "Export PDF"}
            </button>
          </div>
        )}
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
