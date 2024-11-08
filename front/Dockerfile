#берем за основу Image node:18, если его нет локально идет скачивание с hub.docker.com
FROM node:18
#контекст внутри container
WORKDIR /application
# Копирование package.json и yarn.lock
COPY package.json yarn.lock ./
# Установка зависимостей
RUN yarn
# Копирование исходного кода приложения
COPY . .
# Компилируем приложение JS
RUN yarn build
# Сборка приложения
# Указание порта, на котором будет работать приложение
EXPOSE 3200
# Запуск приложения
CMD ["yarn", "start"]