"use client";

import { useState } from "react";

export default function OracleChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleAsk = async () => {
    if (!question.trim() || loading) return;

    setLoading(true);
    setShowAnswer(true);
    setAnswer('<span class="typing-cursor"></span>');

    try {
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();

      const text = data.answer || "The Oracle is silent on this matter.";
      setAnswer("");
      let i = 0;
      const typeNext = () => {
        if (i < text.length) {
          setAnswer(
            text.slice(0, i + 1) + '<span class="typing-cursor"></span>',
          );
          i++;
          setTimeout(typeNext, 8);
        } else {
          setAnswer(text);
        }
      };
      typeNext();
    } catch (err) {
      setAnswer("The Oracle encountered an error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-kente-black rounded-lg md:rounded p-4 md:p-6 lg:p-8 mb-8 md:mb-14 border border-[#333] relative overflow-hidden">
      <div className="absolute right-4 md:right-8 top-3 md:top-5 text-4xl md:text-6xl opacity-5">
        ⚡
      </div>

      <div className="flex items-center gap-2 md:gap-3 mb-2">
        <h2 className="font-display text-white text-lg md:text-xl font-bold">
          ✦ Ask the Oracle
        </h2>
        <span className="bg-kente-gold text-kente-black text-[9px] md:text-[10px] font-bold tracking-widest uppercase px-1.5 md:px-2 py-0.5 md:py-1 rounded">
          AI
        </span>
      </div>

      <p className="text-gray-400 text-xs md:text-sm mb-4 md:mb-5 font-serif italic">
        Ask about African history, culture, science...
      </p>

      <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="What was the Mali Empire?"
          className="flex-1 bg-[#1a1a1a] border border-[#444] rounded-lg px-3 md:px-4 py-3 text-sm md:text-base text-white outline-none focus:border-kente-gold placeholder-gray-500"
        />
        <button
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          className="bg-kente-gold text-kente-black px-4 md:px-6 py-3 rounded-lg font-medium text-sm whitespace-nowrap hover:bg-[#e6950f] disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {loading ? "..." : "Ask →"}
        </button>
      </div>

      {showAnswer && (
        <div className="mt-4 md:mt-5 p-3 md:p-5 bg-[#111] rounded-lg border-l-4 border-kente-gold">
          <div className="text-kente-gold text-[9px] md:text-[10px] tracking-widest uppercase mb-2">
            ☥ Response
          </div>
          <div
            className="text-gray-200 text-xs md:text-sm leading-relaxed font-serif"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </div>
      )}
    </div>
  );
}
