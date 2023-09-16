require('dotenv').config();

const OpenAI = require('openai');
const openai = new OpenAI();

MODEL = process.env.MODEL
MOCK = process.env.MOCK == "1"
DB_NAME = process.env.DB_NAME

module.exports = { openai, MODEL, MOCK, DB_NAME }