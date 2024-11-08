const express = require('express');
const path = require('path');
const app = express();

// Обслуживаем статические файлы из папки dist
app.use(express.static(path.join(__dirname, 'dist')));

// Обработка всех маршрутов
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = 3300;
// Указываем IP 0.0.0.0, чтобы разрешить внешние подключения
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});