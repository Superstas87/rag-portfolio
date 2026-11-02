import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-8 mb-6">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-bold text-white mt-10 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl md:text-2xl font-semibold text-white mt-8 mb-3">{children}</h3>,
    p: ({ children }) => <p className="text-zinc-300 leading-relaxed mb-6 text-base md:text-lg">{children}</p>,
    ul: ({ children }) => <ul className="list-disc list-outside ml-6 text-zinc-300 mb-6 space-y-2 text-base md:text-lg">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-outside ml-6 text-zinc-300 mb-6 space-y-2 text-base md:text-lg">{children}</ol>,
    li: ({ children }) => <li className="pl-1">{children}</li>,
    a: ({ href, children }) => (
      <a href={href} className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors">
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
    code: ({ children }) => <code className="bg-zinc-800 text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
    pre: ({ children }) => <pre className="bg-[#0d1117] border border-white/10 p-4 rounded-xl overflow-x-auto mb-6 text-sm font-mono text-zinc-300">{children}</pre>,
    img: (props) => (
      <Image 
        {...(props as any)} 
        className="rounded-xl border border-white/10 my-8 w-full h-auto" 
        width={800} 
        height={400} 
      />
    ),
    ...components,
  };
}