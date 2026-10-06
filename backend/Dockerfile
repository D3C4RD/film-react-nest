# backend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Финальный образ для запуска
FROM node:18-alpine

WORKDIR /app

# Копируем только продакшен-зависимости (если есть отдельный скрипт, например npm ci --omit=dev)
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# Копируем собранный код
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Важно: запускаем именно собранный код, а не dev-режим
CMD ["node", "dist/main.js"]