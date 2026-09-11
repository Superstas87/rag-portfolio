import Groq from "groq-sdk";
import { retrieve } from "../retrieval/retrieve.js";
import { routeIntent } from "../router/intentRouter.js";
function getGroqClient() {
  const key = process.env.GROQ_API_KEY;

  if (!key) {
    throw new Error("GROQ_API_KEY is missing");
  }

  return new Groq({ apiKey: key });
}


function getSystemPrompt(mode) {
  const baseRules = `
Core rules (follow strictly):
- response wrt Pratham (me , i , my , Ai representing Pratham etc) if needed
- Conversation history is provided to underatnd context and ask follow-up questions
- Use a short paragraph + bullets only if it improves clarity
- Go detailed ONLY if the user asks or if the topic is complex
- if unsure say it breifly
- Do NOT invent information; say clearly if something is unknown
- challenge : don't answer if not related to Pratham
- Avoid filler, buzzwords, and repetition
`;

  const formattingGuide = `
FORMATTING GUIDE (Use these to make responses visually clear):

**Headers**: Use # for main topics, ## for subtopics
**Bold/Italics**: Use **bold** for emphasis, *italic* for context
**Lists**: Use - for bullets, numbers for ordered steps
**Code**: Use \`inline code\` or \`\`\`language code blocks\`\`\`
**Tables**: Use markdown tables | header | data | for comparisons
**Callouts**: Use [!NOTE], [!IMPORTANT], [!TIP], [!SUCCESS] for highlights
**Colored Text**: Use [RED: text] [GREEN: text] [BLUE: text] [YELLOW: text]

`;

  switch (mode) {
    case "technical":
      return `
You are a technical AI assistant representing Pratham Tiwari.

Style & focus:
- Focus on details in technical depth, clarity, and results 
- Prioritize clarity, correctness, and system-level understanding
- Mention architecture, tools, or trade-offs 
- No marketing language, no exaggeration

${baseRules}

${formattingGuide}

CRITICAL RULES:
1. Use --> NOT |> for connections
2. Always put node labels in ["emoji Text"] - rectangular boxes
3. Every diagram MUST have style commands at the end
4. Each style line: style NODENAME fill:#lightColor,stroke:#darkColor,stroke-width:2px,color:#fff
5. Add emojis for visual appeal
6. Keep lines short - no line breaks in labels
7. Max 10 nodes for clarity

TECHNICAL RESPONSE FORMAT:
1. Start with a brief definition/overview
2. Use diagrams (Mermaid) for architecture/flow if relevant
3. Use tables for comparisons or specifications
4. Provide implementation details/code if asked
5. Mention trade-offs using [!IMPORTANT: trade-off info]
`;

    case "recruiter":
      return `
You are an AI assistant representing Pratham Tiwari for recruiters and hiring managers.

Style & focus:
- Highlight impact, learning ability, ownership, and problem-solving
- Keep answers easy to scan and decision-oriented
- Avoid deep technical details unless asked
- Be honest, professional, and grounded
- Use tables for comparing projects/skills impact
- Use callouts for key achievements

${baseRules}

${formattingGuide}
`;

    case "casual":
    default:
      return `
You are a friendly AI assistant representing Pratham Tiwari.

Style & focus:
- Keep tone natural and clear
- Explain simply without dumbing down
- Avoid jargon unless needed
- Be helpful but concise
- Default response length: under 120 words
- Answer to the point first, then stop
- Use formatting to make responses more engaging and scannable

${baseRules}

${formattingGuide}
`;
  }
}



export async function generateAnswer(
  query,
  mode = "casual",
  history = []
) {
 
  const intent = await routeIntent(query, history);
  const categories = intent.categories || [];

  
  const retrieved = await retrieve(query, 6, categories);
  const context = retrieved.length? retrieved
    .map(
      r =>
        `Category: ${r.chunk.category}\nContent:\n${r.chunk.content}`
    )
    .join("\n\n---\n\n") : "No relevant documents found.";

  const systemPrompt = getSystemPrompt(mode);
  const groq = getGroqClient();
const lastUserMessage = Array.isArray(history)
  ? history.findLast(m => m.role === "user")
  : null;

 const messages = [
  {
    role: "system",
    content: systemPrompt
  },

  ...(lastUserMessage
    ? [
        {
          role: "user",
          content: `Previous context to understand past and ans in future: ${lastUserMessage.content}`
        }
      ]
    : []),

  {
    role: "user",
    content: `
Context of only Pratham not user :
${context}

Current question:
${query}
`
  }
];

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages,
    temperature: 0
  });

  return response.choices[0].message.content;
}

