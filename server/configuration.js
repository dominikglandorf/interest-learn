require('dotenv').config();

const OpenAI = require('openai');
const openai = new OpenAI();

MODEL = process.env.MODEL
MOCK = process.env.MOCK == "1"

module.exports = { openai, MODEL, MOCK }