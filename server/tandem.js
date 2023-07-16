const express = require('express');
const validation = require('./validation');
const { openai, MODEL, MOCK } = require('./configuration');

const router = express.Router();

router.post('', [
    validation.bodyText(),
    validation.bodyLanguage(),
    validation.messageHistory()
], async (req, res) => {
    // Check for validation errors
    const errors = validation.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    const text = req.body.text;
    const language = req.body.language;
    const messageHistory = req.body.messageHistory;
    
    if (MOCK) {
        return res.send("Bien sûr ! Je serai ravi d'être votre partenaire de tandem. Parlons du texte sur les road trips en Californie. Quelles parties du texte vous ont le plus intéressé ? Avez-vous déjà fait un road trip en Californie ou ailleurs ? Si oui, quels ont été vos endroits préférés à visiter lors de vos voyages en voiture ? Et si vous n'avez pas encore fait de road trip, quelle serait votre destination de rêve en Californie ou ailleurs ?");
    }

    const messages = [
        {role: "system", content: `You are a ${language} speaking tandem partner and we just met. You have also read this text: ${text}. Involve me into a conversation with two questions related to the text in a natural way. Do not answer your questions.`},
    ]

    try {
        const stream = await openai.chat.completions.create({
            model: MODEL,
            messages: messages.concat(messageHistory),
            stream: true
        });

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');
        for await (const part of stream) {
            res.write(part.choices[0]?.delta.content || '');
        }
        return res.end()
     } catch (error) {
        console.error("An error occurred:", error);
        return res.status(400).json(error);
    }
});

module.exports = router