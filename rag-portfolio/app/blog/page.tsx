import Link from 'next/link';

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Блог</h1>
        <Link 
          href="/blog/deploy-on-synology" 
          className="block p-6 rounded-xl bg-zinc-900 border border-white/20 hover:border-cyan-400 transition-all"
        >
          <h2 className="text-2xl font-bold mb-2">Как я задеплоил RAG-портфолио на Synology NAS</h2>
          <p className="text-zinc-400">Пошаговый путь от локальной разработки до работы в проде.</p>
        </Link>
        <Link 
          href="/blog/hybrid-search" 
          className="block p-6 rounded-xl bg-zinc-900 border border-white/20 hover:border-cyan-400 transition-all"
        >
          <h2 className="text-2xl font-bold mb-2">Внедрение Hybrid Search (RRF) в RAG-портфолио</h2>
          <p className="text-zinc-400">Как объединить векторный поиск и TF-IDF для повышения точности.</p>
        </Link>
      </div>
    </main>
  );
}