  GNU nano 8.7.1                                          Dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./
RUN npm ci

# Копируем исходники и собираем
COPY . .
RUN npm run build

# Финальный образ — просто пустышка, чтобы volume можно было инициализировать
FROM alpine:latest
WORKDIR /app
# Копируем собранные файлы в рабочую директорию
COPY --from=builder /app/dist /app/dist
# При запуске контейнера файлы скопируются в смонтированный volume
CMD ["sh", "-c", "cp -r /app/dist/* /volume/ && tail -f /dev/null"]