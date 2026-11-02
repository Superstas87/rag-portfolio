import { retrieve } from "./retrieve.js";

const queries = [
  "Кто ты?",
  "Где ты работал?",
  "Какие у тебя навыки в Docker?",
  "Что такое EAI_AGAIN?",
  "Расскажи про Qdrant",
  "Где ты работал?"
];

for (const q of queries) {
  console.log(`\nQUERY: ${q}`);
  const results = await retrieve(q, 3); // topK = 3

  if (results.length === 0) {
    console.log("→ Ничего не найдено");
  } else {
    results.forEach(r => {
      console.log(
        `→ [${r.chunk.category}] ${r.chunk.id} (score: ${r.score.toFixed(4)})`
      );
    });
  }
}