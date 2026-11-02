import fs from "fs";
import path from "path";
import { embedText } from "../embeddings/embed.js";
import { cosineSimilarity } from "./cosine.js";
import { buildTfIdf } from "./tfidf.js";
import { tokenize } from "./tokenizer.js";

const VECTORS_PATH = path.join(process.cwd(), "rag/embeddings/vectors.json");
const CHUNKS_PATH = path.join(process.cwd(), "rag/chunks/chunks.json");

// Функция для объединения двух списков (RRF)
function reciprocalRankFusion(vectorResults, lexicalResults, k = 60) {
  const scores = new Map();

  // Добавляем очки от векторного поиска
  vectorResults.forEach((item, index) => {
    const id = item.chunk.id;
    scores.set(id, (scores.get(id) || 0) + 1 / (k + index + 1));
  });

  // Добавляем очки от лексического поиска
  lexicalResults.forEach((item, index) => {
    const id = item.chunk.id;
    scores.set(id, (scores.get(id) || 0) + 2 / (k + index + 1));
  });

  return scores;
}

export async function retrieve(query, topK = 5, allowedCategories = []) {
  // 1. Загружаем данные
  const vectors = JSON.parse(fs.readFileSync(VECTORS_PATH, "utf-8"));
  const chunks = JSON.parse(fs.readFileSync(CHUNKS_PATH, "utf-8"));

  // 2. Фильтруем по категориям
  let filteredVectors = vectors;
  let filteredChunks = chunks;

  if (allowedCategories.length > 0) {
    filteredVectors = filteredVectors.filter(v => allowedCategories.includes(v.category));
    filteredChunks = filteredChunks.filter(c => allowedCategories.includes(c.category));
  }

  // 3. Векторный поиск
  const queryEmbedding = await embedText(query);
  const vectorResults = filteredVectors.map(v => ({
    chunk: v,
    score: cosineSimilarity(queryEmbedding, v.embedding)
  })).sort((a, b) => b.score - a.score);

  // 4. Лексический поиск (TF-IDF)
  const tfidfDocs = buildTfIdf(filteredChunks); // Считаем TF-IDF для всех чанков
  const queryTokens = tokenize(query);
  
  const lexicalResults = filteredChunks.map((chunk, index) => {
    const docTfidf = tfidfDocs[index];
    let score = 0;
    queryTokens.forEach(token => {
      if (docTfidf[token]) {
        score += docTfidf[token];
      }
    });
    return { chunk, score };
  }).sort((a, b) => b.score - a.score);

  // 5. Объединяем результаты (RRF)
  const fusedScores = reciprocalRankFusion(vectorResults, lexicalResults);

  // 6. Формируем итоговый ответ
  const allChunksMap = new Map(filteredChunks.map(c => [c.id, c]));
  const finalResults = Array.from(fusedScores.entries())
    .map(([id, score]) => ({
      chunk: allChunksMap.get(id),
      score: score
    }))
    .filter(item => item.chunk) // Убираем пустые
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return finalResults;
}