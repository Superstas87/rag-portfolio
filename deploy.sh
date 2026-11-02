#!/bin/bash
set -e # Остановить скрипт, если где-то будет ошибка

echo "🚀 Начинаем сборку..."
cd ~/RAG-Portfolio

# Пересборка векторов (раскомментируй, если менял chunks.json)
cd rag-server && node rag/embeddings/buildVectors.js && cd ..

echo "📦 Собираем Docker-образы..."
docker compose build --no-cache rag-server rag-portfolio

echo "💾 Сохраняем в tar-архивы..."
docker save rag-portfolio > rag-portfolio.tar
docker save rag-server > rag-server.tar

echo "✅ Готово! Теперь закинь .tar файлы на NAS."