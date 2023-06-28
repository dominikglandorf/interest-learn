const express = require('express');
const validation = require('./validation');
const { continuePrompt } = require('./prompts')
const { openai, MODEL, MOCK } = require('./configuration');

const router = express.Router();

router.get('', [
    validation.text(),
  ], async (req, res) => {
    // Check for validation errors
    const errors = validation.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const text = req.query.text;
  
    console.log(continuePrompt(text))

    if (MOCK) {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        await sleep(200);
        return res.json({
            "status": 200,
            "text": "Lorsque vous apprenez une langue, il est crucial d'obtenir du contenu personnalisé pour vous motiver et vous aider à comprendre la langue en question. Le contenu personnalisé en apprentissage de langues est disponible grâce aux ressources technologiques modernes telles que les applications mobiles, les vidéos en ligne et les logiciels éducatifs. Ces derniers permettent aux apprenants de travailler sur leurs points faibles et d'améliorer leurs compétences linguistiques, que ce soit en grammaire, en vocabulaire, en expression orale ou en compréhension écrite. De nos jours, l'enseignement personnalisé est considéré comme l'une des méthodes les plus efficaces pour apprendre une langue et atteindre des objectifs d'apprentissage spécifiques."
        });
    }
    
    try {
        const completion = await openai.createChatCompletion({
            model: MODEL,
            messages: [{role: "user", content: continuePrompt(text)}],
        });

        if (completion.status != 200) {
            res.json({
                "status": completion.status,
                "statusText": completion.statusText
            });
        }

        return res.json({
            "status": 200,
            "text": completion.data.choices[0].message.content
        });
     } catch (error) {
        console.error("An error occurred:", error);
        return res.json({
            "status": 200,
            "statusText": error.text
        });
    }
});

module.exports = router