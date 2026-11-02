"use client";

import Footer from "@/components/Footer";
import Link from "next/link";

const projects = [
  {
    name: "RAG-бот по психологии",
    desc: "Telegram-бот, который отвечает на вопросы по книгам с помощью векторного поиска в Qdrant и генерации через YandexGPT.",
    stack: ["Python", "Qdrant", "FastEmbed", "YandexGPT", "Docker", "Linux"],
    link: "https://github.com/Superstas87/rag-bot",
    metrics: "Отвечает за 2–3 секунды · точность retrieval 85%",
  },
  {
    name: "RAG-портфолио",
    desc: "Сайт с AI-ассистентом, который отвечает на вопросы о навыках и опыте. Intent-based retrieval, три режима ответа.",
    stack: ["Next.js", "Node.js", "YandexGPT", "Qdrant", "Intent Classification"],
    link: "https://github.com/Superstas87/RAG-Portfolio",
    metrics: "Живой AI-ассистент · три режима · intent-роутер",
  },
];

export default function Projects() {
  return (
    <main className="bg-black text-white min-h-screen">
      <section className="pt-32 pb-16 px-6 lg:px-16 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Проекты</h1>
        <p className="text-zinc-400 text-lg mb-12 max-w-2xl">
          Системы, которые я построил для решения реальных задач.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <Link
              key={p.name}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 rounded-xl bg-zinc-900 border border-white/20 hover:border-cyan-400 transition-all"
            >
              <h2 className="text-2xl font-bold text-white mb-3">{p.name}</h2>
              <p className="text-zinc-400 mb-4">{p.desc}</p>
              <p className="text-cyan-400 text-sm mb-4">{p.metrics}</p>
              <div className="flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 text-xs"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}