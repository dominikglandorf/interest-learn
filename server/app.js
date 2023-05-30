const express = require('express');
const textRouter = require('./text');
const explanationRouter = require('./explanation');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.get('/', async (req, res) => {
    res.send('Language GPT Backend is running.')
});

app.use('/text', textRouter);
app.use('/explanation', explanationRouter);

module.exports = app

