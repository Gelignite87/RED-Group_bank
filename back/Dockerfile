#берем за основу Image node:18, если его нет локально идет скачивание с hub.docker.com
FROM node:18
#контекст внутри container
WORKDIR /application
#откуда копируем (. текущая папка) и куда (. в /application)
COPY . .
#RUN при сборке, устанавливаем node_modules
RUN yarn
# Компилируем приложение NestJS
RUN yarn build
#добавляем ENV переменные
# ENV PORT 3000
#используемый порт (можно взять из ENV $PORT)
EXPOSE 4300
#CMD при запуске, запускаем приложение командой node app.js
CMD npx prisma migrate deploy && yarn start:prod