FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm ci

# Копируем код
COPY . .

# Собираем Next.js
RUN npm run build

# --- Production stage ---
FROM node:20-alpine

WORKDIR /app

# Копируем standalone-сборку
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]