"use client";

import { useEffect, useRef } from "react";
import { AlertCircle, CheckCircle, Info, Lightbulb } from "lucide-react";

// Dynamic Mermaid rendering
const MermaidDiagram = ({ content }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const renderMermaid = async () => {
      if (typeof window === "undefined") return;
      
      // Wait for mermaid to load if needed
      let attempts = 0;
      while (!window.mermaid && attempts < 50) {
        await new Promise(r => setTimeout(r, 100));
        attempts++;
      }

      if (window.mermaid && containerRef.current) {
        try {
          // Clear previous content
          containerRef.current.innerHTML = "";
          
          // Create a unique ID for this diagram
          const diagramId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          // Create diagram element
          const div = document.createElement("div");
          div.className = "mermaid";
          div.id = diagramId;
          div.textContent = content;
          containerRef.current.appendChild(div);
          
          // Render the diagram
          await window.mermaid.run();
        } catch (e) {
          console.warn("Mermaid render error - showing code block instead");
          if (containerRef.current) {
            containerRef.current.innerHTML = `<pre class="text-zinc-400 text-xs p-2 bg-white/5 rounded border border-white/10 overflow-x-auto"><code>${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
          }
        }
      }
    };

    renderMermaid();
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="my-4 p-3 rounded-lg bg-white/5 border border-white/10 overflow-x-auto w-full"
    />
  );
};

// Callout component
const Callout = ({ type, children }) => {
  const styles = {
    note: {
      bg: "bg-blue-900/20",
      border: "border-blue-600/40",
      icon: <Info className="w-4 h-4" />,
      color: "text-blue-300",
      label: "NOTE"
    },
    important: {
      bg: "bg-red-900/20",
      border: "border-red-600/40",
      icon: <AlertCircle className="w-4 h-4" />,
      color: "text-red-300",
      label: "IMPORTANT"
    },
    tip: {
      bg: "bg-green-900/20",
      border: "border-green-600/40",
      icon: <Lightbulb className="w-4 h-4" />,
      color: "text-green-300",
      label: "TIP"
    },
    success: {
      bg: "bg-emerald-900/20",
      border: "border-emerald-600/40",
      icon: <CheckCircle className="w-4 h-4" />,
      color: "text-emerald-300",
      label: "SUCCESS"
    }
  };

  const style = styles[type] || styles.note;

  return (
    <div className={`my-3 p-3 rounded-lg ${style.bg} border ${style.border}`}>
      <div className={`flex gap-2 items-start ${style.color}`}>
        <span className="mt-0.5 shrink-0">{style.icon}</span>
        <div>
          <strong className="text-sm">{style.label}</strong>
          <div className="text-sm mt-1 text-white/90">{children}</div>
        </div>
      </div>
    </div>
  );
};

// Table component with professional styling
const Table = ({ content }) => {
  const lines = content.trim().split("\n").filter(l => l.trim());
  if (lines.length < 2) return <pre className="text-zinc-400 text-xs">{content}</pre>;

  const headerRow = lines[0].split("|").map(cell => cell.trim()).filter(Boolean);
  const dataRows = lines.slice(2).map(line =>
    line.split("|").map(cell => cell.trim()).filter(Boolean)
  );

  return (
    <div className="my-4 rounded-lg border border-white/20 overflow-x-auto w-full">
      <table className="w-full text-sm whitespace-nowrap">
        <thead>
          <tr className="bg-white/5 border-b border-white/20">
            {headerRow.map((cell, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left font-bold text-white/95"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-white/10 ${
                i % 2 === 0 ? "bg-white/2" : "bg-white/1"
              } hover:bg-white/5 transition-colors`}
            >
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-white/85">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Color-coded text component
const ColoredText = ({ color, children }) => {
  const colors = {
    RED: "text-red-400",
    GREEN: "text-green-400",
    BLUE: "text-blue-400",
    YELLOW: "text-yellow-400"
  };

  return <span className={colors[color] || "text-white"}>{children}</span>;
};

// Main enhanced renderer
export default function EnhancedRenderer({ content }) {
  // Split content by mermaid blocks
  const parts = content.split(/```mermaid\n([\s\S]*?)```/);
  
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {parts.map((part, idx) => {
        // Even indices are regular text, odd indices are mermaid diagrams
        if (idx % 2 === 1) {
          return <MermaidDiagram key={idx} content={part} />;
        }
        return <MarkdownText key={idx} content={part} />;
      })}
    </div>
  );
}

// Markdown processing for text content
function MarkdownText({ content }) {
  if (!content || !content.trim()) return null;

  // First, strip any HTML tags that might be in the content
  let cleanContent = content.replace(/<[^>]*>/g, "");

  // Split by lines for processing
  const lines = cleanContent.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      i++;
      continue;
    }

    // Callouts
    if (line.includes("[!NOTE]")) {
      const match = line.match(/\[!NOTE\]:\s*(.*)/);
      elements.push(
        <Callout key={`callout-${i}`} type="note">{match?.[1] || "Note"}</Callout>
      );
      i++;
      continue;
    }

    if (line.includes("[!IMPORTANT]")) {
      const match = line.match(/\[!IMPORTANT\]:\s*(.*)/);
      elements.push(
        <Callout key={`callout-${i}`} type="important">{match?.[1] || "Important"}</Callout>
      );
      i++;
      continue;
    }

    if (line.includes("[!TIP]")) {
      const match = line.match(/\[!TIP\]:\s*(.*)/);
      elements.push(
        <Callout key={`callout-${i}`} type="tip">{match?.[1] || "Tip"}</Callout>
      );
      i++;
      continue;
    }

    if (line.includes("[!SUCCESS]")) {
      const match = line.match(/\[!SUCCESS\]:\s*(.*)/);
      elements.push(
        <Callout key={`callout-${i}`} type="success">{match?.[1] || "Success"}</Callout>
      );
      i++;
      continue;
    }

    // Tables
    if (line.startsWith("|")) {
      const tableLines = [line];
      let j = i + 1;
      while (j < lines.length && lines[j].trim().startsWith("|")) {
        tableLines.push(lines[j].trim());
        j++;
      }
      elements.push(
        <Table key={`table-${i}`} content={tableLines.join("\n")} />
      );
      i = j;
      continue;
    }

    // Headers
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-lg font-bold text-white mt-4 mb-2">
          {renderMarkdownInline(line.replace("### ", ""))}
        </h3>
      );
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-xl font-bold text-white mt-5 mb-3">
          {renderMarkdownInline(line.replace("## ", ""))}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-2xl font-bold text-white mt-6 mb-4">
          {renderMarkdownInline(line.replace("# ", ""))}
        </h1>
      );
      i++;
      continue;
    }

    // Bullet lists
    if (line.startsWith("- ")) {
      const listItems = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        listItems.push(
          <li key={`li-${i}`} className="list-disc ml-4">
            {renderMarkdownInline(lines[i].trim().replace("- ", ""))}
          </li>
        );
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1 my-2">
          {listItems}
        </ul>
      );
      continue;
    }

    // Numbered lists
    const numMatch = line.match(/^\d+\.\s+(.*)/);
    if (numMatch) {
      const listItems = [];
      while (i < lines.length) {
        const numMatch2 = lines[i].trim().match(/^\d+\.\s+(.*)/);
        if (!numMatch2) break;
        listItems.push(
          <li key={`li-${i}`} className="list-decimal ml-4">
            {renderMarkdownInline(numMatch2[1])}
          </li>
        );
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-1 my-2">
          {listItems}
        </ol>
      );
      continue;
    }

    // Code blocks
    if (line.startsWith("```")) {
      const codeLines = [];
      let j = i + 1;
      while (j < lines.length && !lines[j].trim().startsWith("```")) {
        codeLines.push(lines[j]);
        j++;
      }
      elements.push(
        <pre key={`code-${i}`} className="bg-white/5 border border-white/10 rounded-lg p-3 my-3 overflow-x-auto">
          <code className="text-sm text-green-300 font-mono">
            {codeLines.join("\n")}
          </code>
        </pre>
      );
      i = j + 1;
      continue;
    }

    // Regular paragraph
    if (line) {
      elements.push(
        <p key={`p-${i}`} className="text-white/90 leading-relaxed">
          {renderMarkdownInline(line)}
        </p>
      );
    }

    i++;
  }

  return <div className="space-y-3">{elements}</div>;
}

// Render inline markdown elements
function renderMarkdownInline(text) {
  // Create segments for different styles
  const segments = [];
  let remaining = text;
  let index = 0;

  while (remaining.length > 0) {
    // Bold: **text**
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
    if (boldMatch && boldMatch.index === 0) {
      segments.push(
        <strong key={`bold-${index}`} className="font-bold text-white">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.substring(boldMatch[0].length);
      index++;
      continue;
    }

    // Italic: *text*
    const italicMatch = remaining.match(/\*(.*?)\*/);
    if (italicMatch && italicMatch.index === 0) {
      segments.push(
        <em key={`italic-${index}`} className="italic text-white/90">
          {italicMatch[1]}
        </em>
      );
      remaining = remaining.substring(italicMatch[0].length);
      index++;
      continue;
    }

    // Inline code: `text`
    const codeMatch = remaining.match(/`([^`]*)`/);
    if (codeMatch && codeMatch.index === 0) {
      segments.push(
        <code key={`inline-${index}`} className="bg-white/10 px-1.5 py-0.5 rounded text-yellow-300 font-mono text-xs">
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.substring(codeMatch[0].length);
      index++;
      continue;
    }

    // Links
    const linkMatch = remaining.match(/(https?:\/\/[^\s]+)/);
    if (linkMatch && linkMatch.index === 0) {
      segments.push(
        <a
          key={`link-${index}`}
          href={linkMatch[1]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-300"
        >
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.substring(linkMatch[0].length);
      index++;
      continue;
    }

    // Colored text: [RED: text]
    const colorMatch = remaining.match(/\[(RED|GREEN|BLUE|YELLOW):\s*(.*?)\]/);
    if (colorMatch && colorMatch.index === 0) {
      const colors = {
        RED: "text-red-400",
        GREEN: "text-green-400",
        BLUE: "text-blue-400",
        YELLOW: "text-yellow-400"
      };
      segments.push(
        <span key={`color-${index}`} className={colors[colorMatch[1]]}>
          {colorMatch[2]}
        </span>
      );
      remaining = remaining.substring(colorMatch[0].length);
      index++;
      continue;
    }

    // Regular text
    const nextMatch = remaining.match(/(\*\*|`|\[(?:RED|GREEN|BLUE|YELLOW):|https?:\/\/)/);
    if (nextMatch) {
      segments.push(remaining.substring(0, nextMatch.index));
      remaining = remaining.substring(nextMatch.index);
    } else {
      segments.push(remaining);
      remaining = "";
    }
    index++;
  }

  return segments;
}
