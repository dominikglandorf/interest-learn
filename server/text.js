const express = require('express');
const validation = require('./validation');
const { textPrompt } = require('./prompts')
const { openai, MODEL, MOCK } = require('./configuration');

const router = express.Router();

require('./db/connect');
const Text = require('./models/text');

router.get('', [
    validation.language(),
    validation.niveau(),
    validation.topic(),
  ], async (req, res) => {
    // Check for validation errors
    const errors = validation.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const language = req.query.language;
    const niveau = req.query.niveau;
    const topic = req.query.topic;
    const userId = req.query.userId || undefined;

    if (MOCK) {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        await sleep(200);
        return res.send("Lorsque vous apprenez une langue, il est crucial d'obtenir du contenu personnalisé pour vous motiver et vous aider à comprendre la langue en question. Le contenu personnalisé en apprentissage de langues est disponible grâce aux ressources technologiques modernes telles que les applications mobiles, les vidéos en ligne et les logiciels éducatifs. Ces derniers permettent aux apprenants de travailler sur leurs points faibles et d'améliorer leurs compétences linguistiques, que ce soit en grammaire, en vocabulaire, en expression orale ou en compréhension écrite. De nos jours, l'enseignement personnalisé est considéré comme l'une des méthodes les plus efficaces pour apprendre une langue et atteindre des objectifs d'apprentissage spécifiques.");
    }
    
    try {
        const stream = await openai.chat.completions.create({
            model: MODEL,
            messages: [{role: "user", content: textPrompt(language, topic, niveau)}],
            stream: true
        });

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('X-Accel-Buffering', 'no');

        let response = '';
        for await (const part of stream) {
            responsePart = part.choices[0]?.delta.content || '';
            response += responsePart;
            res.write(responsePart);
        }
        if (userId) {
            const text = new Text({ language, topic, niveau, text: response, userId });
            await text.save();
        }
        return res.end()
     } catch (error) {
        console.error("An error occurred:", error);
        return res.status(400).json(error);
    }
});

module.exports = router