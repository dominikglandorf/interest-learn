const express = require('express');
const validation = require('./validation');
const { openai, MODEL, MOCK } = require('./configuration');

const router = express.Router();

require('./db/connect');
const Correction = require('./models/correction');

router.post('', [
    validation.bodyMessage(),
    validation.bodyLanguage(),
], async (req, res) => {
    // Check for validation errors
    const errors = validation.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    const message = req.body.message;
    const language = req.body.language;
    const userId = req.body.userId || undefined;
    
    if (MOCK) {
        return res.send("Bien sûr ! Je serai ravi d'être votre partenaire de tandem. Parlons du texte sur les road trips en Californie. Quelles parties du texte vous ont le plus intéressé ? Avez-vous déjà fait un road trip en Californie ou ailleurs ? Si oui, quels ont été vos endroits préférés à visiter lors de vos voyages en voiture ? Et si vous n'avez pas encore fait de road trip, quelle serait votre destination de rêve en Californie ou ailleurs ?");
    }

    try {
        const completion = await openai.chat.completions.create({
            model: MODEL,
            messages: [{role: "user", content: `Give me a corrected version of this ${language} message: ${message}`}],
        });

        const response = completion.choices[0].message.content;
        if (userId) {
            const correction = new Correction({ language, message, correction: response, userId });
            await correction.save();
        }
    
        return res.send(response);
    } catch (error) {
        console.error("An error occurred:", error);
        return res.status(400).json(error);
    }
    
});

module.exports = router