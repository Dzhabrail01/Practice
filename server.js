const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

// Пример данных: ключевые слова и соответствующие URL
const keywords = {
    'javascript': ['https://developer.mozilla.org/en-US/docs/Web/JavaScript', 'https://javascript.info/'],
    'nodejs': ['https://nodejs.org/', 'https://www.tutorialspoint.com/nodejs/'],
    'example': ['https://example.com'] // Добавил example для тестирования
};

app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files

// Маршрут для корневого пути, который возвращает index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Отправляем файл index.html
});

// Получение списка URL по ключевому слову
app.get('/urls', (req, res) => {
    const keyword = req.query.keyword;
    if (keywords[keyword]) {
        res.json({ urls: keywords[keyword] });
    } else {
        res.status(404).json({ error: 'Keyword not found' });
    }
});

// Скачивание контента по URL
app.get('/download', async (req, res) => {
    const url = req.query.url;
    try {
        const response = await axios.get(url); // Убрал { responseType: 'stream' }
        res.send(response.data); // Отправляем данные как текст
    } catch (error) {
        console.error('Error downloading content:', error.message);
        res.status(500).json({ error: 'Failed to download content', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});