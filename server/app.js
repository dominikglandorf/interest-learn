const express = require('express');
const textRouter = require('./text');
const explanationRouter = require('./explanation');
const vocabularyRouter = require('./vocabulary');
const exportRouter = require('./export');
const continuationRouter = require('./continuation');
const tandemRouter = require('./tandem');
const correctionRouter = require('./correction');

const app = express();

app.use(express.json()); // Parse JSON request bodies

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
app.use('/vocabulary', vocabularyRouter);
app.use('/export', exportRouter);
app.use('/continuation', continuationRouter);
app.use('/tandem', tandemRouter);
app.use('/correction', correctionRouter);

module.exports = app

