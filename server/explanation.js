const express = require('express');
const validation = require('./validation');
const { explainPrompt } = require('./prompts')
const { openai, MODEL, MOCK } = require('./configuration');

const router = express.Router();

router.get('', [
    validation.language(),
    validation.selection(),
    validation.topic(),
    validation.niveau()
  ], async (req, res) => {
    // Check for validation errors
    const errors = validation.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const language = req.query.language;
    const selection = req.query.selection;
    const topic = req.query.topic;
    const niveau = req.query.niveau;

    if (MOCK) {
        return res.send("Lorsque vous apprenez une langue, il est crucial d'obtenir du contenu personnalisé pour vous motiver et vous aider à comprendre la langue en question. Le contenu personnalisé en apprentissage de langues est disponible grâce aux ressources technologiques modernes telles que les applications mobiles, les vidéos en ligne et les logiciels éducatifs. Ces derniers permettent aux apprenants de travailler sur leurs points faibles et d'améliorer leurs compétences linguistiques, que ce soit en grammaire, en vocabulaire, en expression orale ou en compréhension écrite. De nos jours, l'enseignement personnalisé est considéré comme l'une des méthodes les plus efficaces pour apprendre une langue et atteindre des objectifs d'apprentissage spécifiques.");
    }

    try {
        const completion = await openai.chat.completions.create({
            model: MODEL,
            messages: [{role: "user", content: explainPrompt(selection, topic, language, niveau)}],
        });
    
        return res.send(completion.choices[0].message.content);
     } catch (error) {
        console.error("An error occurred:", error);
        return res.status(400).json(error);
    }
});

module.exports = router