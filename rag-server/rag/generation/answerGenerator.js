import fetch from "node-fetch";
import { retrieve } from "../retrieval/retrieve.js";
import { routeIntent } from "../router/intentRouter.js";

// ===== НАСТРОЙКИ YANDEXGPT =====
function getYandexConfig() {
  const apiKey = process.env.YA_API_KEY;
  const folderId = process.env.YA_FOLDER_ID;

  if (!apiKey || !folderId) {
    throw new Error("Не заданы YA_API_KEY или YA_FOLDER_ID в .env");
  }

  return { apiKey, folderId };
}

// ===== СИСТЕМНЫЕ ПРОМПТЫ =====
function getSystemPrompt(mode) {
  const baseRules = `
Основные правила (соблюдать строго):
- Отвечай от первого лица, как будто ты — сам Станислав.
- История диалога передаётся, чтобы понимать контекст и отвечать на уточняющие вопросы.
- Используй короткий абзац и маркированный список, только если это улучшает ясность.
- Подробно отвечай ТОЛЬКО если пользователь просит или если тема сложная.
- Если не уверен — скажи об этом кратко.
- НЕ придумывай информацию. Если чего-то не знаешь — честно скажи.
- НЕ отвечай, если вопрос не связан со Станиславом.
- Избегай «воды», рекламных фраз и повторов.
- Если вопрос не связан с профессиональным опытом, ты можешь ответить кратко и дружелюбно, как обычный человек, но не углубляйся в философию.
- Если тебя спрашивают «Где ты работаешь?», «Ты сейчас работаешь?» или «Есть ли у тебя работа?», ты должен четко ответить: "Да, я работаю на Государственном промышленном предприятии в должности Заместителя начальника отдела — руководителя группы. Параллельно я развиваюсь в RAG/LLM и открыт к предложениям по удалённой работе".
- НЕ говори, что ты не трудоустроен или безработный.
`;

  const formattingRules = `
ПРАВИЛА ФОРМАТИРОВАНИЯ:
- Используй Markdown: **жирный**, *курсив*, \`код\`.
- Заголовки (#) для основных тем.
- Маркированные списки (-) для ясности.
- Ответы должны быть краткими и структурированными.
`;

  switch (mode) {
    case "technical":
      return `
Ты — технический AI-ассистент, представляющий Станислава — RAG/LLM-инженера.

Стиль и фокус:
- Техническая глубина, ясность и результаты.
- Упоминай архитектуру, инструменты (Python, Qdrant, LangChain, Docker) и компромиссы.
- Без маркетингового языка и преувеличений.

${baseRules}
${formattingRules}
`;

    case "recruiter":
      return `
Ты — AI-ассистент, представляющий Станислава для рекрутеров и нанимающих менеджеров.

Стиль и фокус:
- Подчёркивай результаты, обучаемость, ответственность и умение решать задачи.
- Ответы должны легко сканироваться и помогать принимать решения.
- Будь честным, профессиональным и сдержанным.

${baseRules}
${formattingRules}
`;

    case "casual":
    default:
      return `
Ты — дружелюбный AI-ассистент, представляющий Станислава.

Стиль и фокус:
- Тон естественный и понятный.
- Объясняй просто, но без упрощений.
- Будь полезным и кратким.
- По умолчанию — не больше 120 слов.
- Сначала отвечай по сути, потом останавливайся.

${baseRules}
${formattingRules}
`;
  }
}

// ===== ОСНОВНАЯ ФУНКЦИЯ =====
export async function generateAnswer(query, mode = "auto", history = []) {
  // 1. Определяем намерение (intent) запроса
  const intent = await routeIntent(query, history);
  const categories = intent.categories || [];

  // 2. Определяем итоговый режим: если фронт передал не "auto" — используем его, иначе — от роутера
  const finalMode = (mode && mode !== "auto") ? mode : (intent.mode || "casual");

  // 3. Ищем релевантные куски в базе
  const retrieved = await retrieve(query, 6, categories);
  console.log("=== RETRIEVED CHUNKS ===");
  retrieved.forEach(r => {
    console.log(`ID: ${r.chunk.id}, Category: ${r.chunk.category}`);
    console.log(`Content: ${r.chunk.content.substring(0, 200)}...`);
  });
  console.log("========================");
  const context = retrieved.length
    ? retrieved
        .map(
          (r) =>
            `Категория: ${r.chunk.category}\nСодержание:\n${r.chunk.content}`
        )
        .join("\n\n---\n\n")
    : "Релевантные документы не найдены.";

  // 4. Формируем системный промпт с finalMode
  const systemPrompt = getSystemPrompt(finalMode);
  const { apiKey, folderId } = getYandexConfig();

  // 5. Достаём последнее сообщение пользователя из истории
  const lastUserMessage = Array.isArray(history)
    ? history.filter((m) => m.role === "user").pop()
    : null;

  // 6. Собираем сообщения для YandexGPT
  const messages = [
    {
      role: "system",
      text: systemPrompt
    },

    ...(lastUserMessage
      ? [
          {
            role: "user",
            text: `Предыдущий контекст: ${lastUserMessage.content}`
          }
        ]
      : []),

    {
      role: "user",
      text: `
Контекст о Станиславе:
${context}

Текущий вопрос:
${query}
`
    }
  ];

  // 7. Отправляем запрос в YandexGPT
  const response = await fetch(
    "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
    {
      method: "POST",
      headers: {
        Authorization: `Api-Key ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        modelUri: `gpt://${folderId}/yandexgpt-lite`,
        completionOptions: {
          stream: false,
          temperature: 0.3,
          maxTokens: 700
        },
        messages: messages
      })
    }
  );

  // 8. Обрабатываем ошибки
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ошибка YandexGPT: ${response.status} — ${errorText}`);
  }

  // 9. Возвращаем ответ
  const data = await response.json();
  return data.result.alternatives[0].message.text;
}