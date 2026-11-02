FROM node:20-slim

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm ci --only=production

# Копируем код
COPY . .

# Порт, который слушает сервер
EXPOSE 4000

# Запуск
CMD ["npm", "start"]