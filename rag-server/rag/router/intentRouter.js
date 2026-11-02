import fetch from "node-fetch";

// ===== НАСТРОЙКИ YANDEXGPT =====
function getYandexConfig() {
  const apiKey = process.env.YA_API_KEY;
  const folderId = process.env.YA_FOLDER_ID;

  if (!apiKey || !folderId) {
    throw new Error("Не заданы YA_API_KEY или YA_FOLDER_ID в .env");
  }

  return { apiKey, folderId };
}

// ===== ОСНОВНАЯ ФУНКЦИЯ =====
export async function routeIntent(query, history = []) {
  const { apiKey, folderId } = getYandexConfig();

  const conversationContext = history
    .map(
      (m) => `${m.role === "user" ? "Пользователь" : "Ассистент"}: ${m.content}`
    )
    .join("\n");

  const prompt = `
Ты — классификатор намерений для персонального AI-портфолио Станислава.

Разрешённые категории:
about, resume, education, skills, project, achievement,
journey, interests, current_focus, future_goals,
why_hire_me, work_preferences, contact

Режимы ответа:
- recruiter: вопрос от рекрутера (опыт, навыки, почему нанять, достижения)
- technical: технический вопрос (как работает, стек, архитектура, реализация)
- casual: обычный вопрос (привет, расскажи о себе, чем занимаешься)

Правила:
- Возвращай ТОЛЬКО самые релевантные категории.
- Определи режим по тону вопроса.
- Если сомневаешься — ставь casual.
- Отвечай СТРОГО в формате JSON.

История диалога:
${conversationContext || "Нет"}

Текущий запрос:
"${query}"

Формат ответа:
{
  "categories": [],
  "mode": "casual"
}
`;

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
          temperature: 0,
          maxTokens: 200
        },
        messages: [
          {
            role: "user",
            text: prompt
          }
        ]
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ошибка YandexGPT: ${response.status} — ${errorText}`);
  }

  const data = await response.json();
  let raw = data.result.alternatives[0].message.text;

  // Очищаем от markdown-обёртки
  raw = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

  console.log("\nКатегории определены:", raw);

  try {
    const parsed = JSON.parse(raw);
    return {
      categories: parsed.categories || [],
      mode: parsed.mode || "casual"
    };
  } catch (err) {
    console.error("НЕ УДАЛОСЬ РАСПАРСИТЬ JSON:", raw);
    return { categories: [], mode: "casual" };
  }
}