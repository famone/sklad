# Используем нормальную стабильную версию Node.js с npx
FROM node:18-alpine

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта
COPY . .

# Генерируем Prisma клиент (обязательно, чтобы избежать ошибок типов)
RUN npx prisma generate

# Собираем NestJS приложение
RUN npm run build

# Открываем порт приложения
EXPOSE 3000

# Запускаем приложение
CMD sh -c "npx prisma db push && npm run start:prod"