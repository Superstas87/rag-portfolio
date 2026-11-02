import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Станислав Рыбаков | RAG/LLM-инженер",
  description: "Портфолио RAG/LLM-инженера. Собираю RAG-системы на Python (Qdrant, LangChain) и разворачиваю их в Linux.",
  keywords: ["RAG", "LLM", "Python", "Qdrant", "LangChain", "AI Engineer", "RAG-инженер", "LLM-инженер"],
  authors: [{ name: "Станислав Рыбаков" }],
  openGraph: {
    title: "Станислав Рыбаков | RAG/LLM-инженер",
    description: "Портфолио RAG/LLM-инженера. Собираю RAG-системы на Python и разворачиваю их в Linux.",
    url: "https://stasrybakov.ru",
    siteName: "Станислав Рыбаков",
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}