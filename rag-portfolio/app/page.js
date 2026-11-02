"use client";

import Image from "next/image";
import { useEffect } from "react";
import Section1 from "@/components/section1";
import Footer from "@/components/Footer";
export default function Page() {

  useEffect(() => {
  fetch(process.env.NEXT_PUBLIC_API_URL)
    .catch(() => {});
}, []);

  /* ---- reveal on load ---- */
  useEffect(() => {
    document.body.classList.add("loaded");
  }, []);

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

{/* ================= HERO ================= */}
<section className="pt-20 lg:pt-28 pb-20 animate-fadeUp">
  <div className="max-w-7xl mx-auto px-6 lg:px-16 grid lg:grid-cols-2 gap-10 items-center">
    
    {/* LEFT */}
    <div className="relative animate-[fadeUp_0.8s_ease-out_forwards]">

      {/* TITLE */}
      <p className="text-sm uppercase tracking-widest text-cyan-400 mb-3">
        RAG/LLM-инженер
      </p>

      {/* NAME */}
      <h1 className="text-4xl sm:text-5xl lg:text-7xl font-sans tracking-tight leading-tight text-white">
        <span className="font-extrabold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent animate-[shimmer_4s_linear_infinite]">
          Станислав Рыбаков
        </span>
      </h1>

      {/* SUBTITLE */}
      <p className="mt-4 text-lg sm:text-xl text-zinc-400 font-sans">
        Собираю{" "}
        <span className="font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent animate-[shimmer_5s_linear_infinite]">
          RAG-системы
        </span>{" "}
        на{" "}
        <span className="font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent animate-[shimmer_5s_linear_infinite]">
          Python
        </span>{" "}
        и разворачиваю в{" "}
        <span className="font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent animate-[shimmer_5s_linear_infinite]">
          Linux
        </span>
      </p>

      {/* MOBILE IMAGE */}
      <div className="mt-8 lg:hidden flex justify-center">
        <div className="relative w-[260px] sm:w-[300px] aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
          <Image
            src="/StanislavImage.jpg"
            alt="Станислав Рыбаков"
            fill
            priority
            className="object-cover object-top bg-black"
          />
        </div>
      </div>

      {/* BUTTONS */}
      <div className="mt-8 flex gap-3 justify-center lg:justify-start">
   <button
  onClick={() => (window.location.href = "/chat")}
  className="px-8 py-3 rounded-lg font-semibold text-white bg-[length:200%_200%] bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 animate-[gradientFlow_3s_linear_infinite] shadow-[0_0_30px_rgba(99,102,241,0.45)] hover:shadow-[0_0_55px_rgba(99,102,241,0.9),0_0_35px_rgba(168,85,247,0.75)] transition-all duration-200 ease-out hover:scale-[1.04] active:scale-[0.96]"
>
  Спросить AI-ассистента →
</button>


        <a
  href="/Stanislav_Rybakov.pdf"
  download
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block px-6 sm:px-7 py-3 rounded-lg border border-white/20 bg-zinc-900/80 text-white transition-all duration-200 hover:bg-zinc-800 hover:border-white/40 hover:scale-[1.03]"
>
  Скачать резюме
</a>

      </div>
      <p className="mt-3 text-sm sm:text-base text-center lg:text-left">
  {/* Desktop text */}
  <span className="hidden sm:inline font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
    AI-ассистент на основе RAG
  </span>

  {/* Mobile text */}
  <span className="inline sm:hidden font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
    AI-ассистент на RAG 
  </span>{" "}
  </p>

    </div>

    {/* RIGHT IMAGE (DESKTOP ONLY) */}
    <div className="relative hidden lg:block">
      <div className="bg-black relative h-[520px] rounded-2xl overflow-hidden">
        <Image
          src="/My.jpg"
          alt="Станислав Рыбаков"
          fill
          priority
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-l" />
      </div>
    </div>

  </div>
</section>

{/* ================= ABOUT ================= */}
<section className="py-16 border-t border-white/10">
  <div className="max-w-4xl mx-auto px-6 lg:px-16">
    <h2 className="text-3xl font-bold text-white mb-6">
      Обо мне
    </h2>
    <p className="text-lg text-zinc-400 leading-relaxed">
      16 лет в IT: от системного администратора до руководителя IT-отдела 
      на 10 человек. Сейчас строю RAG-системы на Python (Qdrant, YandexGPT, LangChain) 
      и разворачиваю их в Docker на Linux. Ищу удалённую работу RAG/LLM-инженером.
    </p>
  </div>
</section>

{/* ================= SKILLS ================= */}
<section className="py-16 border-t border-white/10">
  <div className="max-w-4xl mx-auto px-6 lg:px-16">
    <h2 className="text-3xl font-bold text-white mb-6">
      Стек
    </h2>
    <div className="flex flex-wrap gap-3">
      {["Python", "Qdrant", "LangChain", "FastEmbed", "YandexGPT", "Docker", "Linux", "FastAPI", "RAG", "LLM", "Prompt Engineering", "Node.js", "Next.js", "Express", "Git", "CI/CD"].map((skill) => (
        <span
          key={skill}
          className="px-4 py-2 rounded-lg bg-zinc-900 border border-white/20 text-zinc-300 text-sm"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
</section>

{/* ================= PROJECTS ================= */}
<section className="py-16 border-t border-white/10">
  <div className="max-w-4xl mx-auto px-6 lg:px-16">
    <h2 className="text-3xl font-bold text-white mb-6">
      Проекты
    </h2>
    <div className="grid md:grid-cols-2 gap-6">
      <a
        href="https://github.com/Superstas87/rag-bot"
        target="_blank"
        rel="noopener noreferrer"
        className="block p-6 rounded-xl bg-zinc-900 border border-white/20 hover:border-cyan-400 transition-all"
      >
        <h3 className="text-xl font-bold text-white mb-2">
          RAG-бот по психологии
        </h3>
        <p className="text-zinc-400 text-sm mb-4">
          Telegram-бот, который отвечает на вопросы по книгам 
          с помощью векторного поиска и YandexGPT.
          Отвечает за 2–3 секунды, точность retrieval 85%
        </p>
        <span className="text-cyan-400 text-sm">
          Python · Qdrant · FastEmbed · YandexGPT · Docker
        </span>
      </a>

      <a
        href="https://stasrybakov.ru"
        target="_blank"
        rel="noopener noreferrer"
        className="block p-6 rounded-xl bg-zinc-900 border border-white/20 hover:border-cyan-400 transition-all"
      >
        <h3 className="text-xl font-bold text-white mb-2">
          RAG-портфолио
        </h3>
        <p className="text-zinc-400 text-sm mb-4">
          Сайт с AI-ассистентом, который отвечает на вопросы 
          о моих навыках и опыте.
        </p>
        <span className="text-cyan-400 text-sm">
          Next.js · Node.js · YandexGPT · Qdrant
        </span>
      </a>
    </div>
  </div>
</section>

      {/* ================= TERMINAL + STACK ================= */}
      <Section1 />
      <Footer />
      {/* animations */}
      <style jsx global>{`
        .animate-fadeUp {
          animation: fadeUp 0.9s ease forwards;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </main>
  );
}
