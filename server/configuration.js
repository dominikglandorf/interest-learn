require('dotenv').config();

const { Configuration, OpenAIApi }  = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

MODEL = process.env.MODEL

module.exports = { openai, MODEL }