const express = require('express');
const validation = require('./validation');
const { explainPrompt } = require('./prompts')
const { openai, MODEL, MOCK } = require('./configuration');

const router = express.Router();

require('./db/connect');
const Explanation = require('./models/explanation');

router.get('', [
    validation.language(),
    validation.selection(),
    validation.context(),
    validation.niveau(),
    validation.translationLanguage()
  ], async (req, res) => {
    // Check for validation errors
    const errors = validation.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const language = req.query.language;
    const selection = req.query.selection;
    const context = req.query.context;
    const niveau = req.query.niveau;
    const translation_language = req.query.translation_language;
    const userId = req.query.userId || undefined;

    if (MOCK) {
        return res.send("Lorsque vous apprenez une langue, il est crucial d'obtenir du contenu personnalisé pour vous motiver et vous aider à comprendre la langue en question. Le contenu personnalisé en apprentissage de langues est disponible grâce aux ressources technologiques modernes telles que les applications mobiles, les vidéos en ligne et les logiciels éducatifs. Ces derniers permettent aux apprenants de travailler sur leurs points faibles et d'améliorer leurs compétences linguistiques, que ce soit en grammaire, en vocabulaire, en expression orale ou en compréhension écrite. De nos jours, l'enseignement personnalisé est considéré comme l'une des méthodes les plus efficaces pour apprendre une langue et atteindre des objectifs d'apprentissage spécifiques.");
    }
    // console.log(explainPrompt(selection, context, language, niveau, translation_language))
    try {
        const completion = await openai.chat.completions.create({
            model: MODEL,
            messages: [{role: "user", content: explainPrompt(selection, context, language, niveau, translation_language)}],
        });
    
        const response = completion.choices[0].message.content;
        if (userId) {
            const explanation = new Explanation({ language, selection, context, niveau, translation_language, explanation: response, userId });
            await explanation.save();
        }
        return res.send(response);
     } catch (error) {
        console.error("An error occurred:", error);
        return res.status(400).json(error);
    }
});

module.exports = router