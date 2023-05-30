const express = require('express');
const validation = require('./validation');
const { openai, MODEL } = require('./configuration');

const router = express.Router();

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

    const prompt = `Write a text of 100 words about "${topic}" in ${niveau} ${language}.`;

    const completion = await openai.createChatCompletion({
        model: MODEL,
        messages: [{role: "user", content: prompt}],
    });

    if (completion.status != 200) {
        console.log(completion);
        res.send(`Error: ${completion.statusText}`);
    }

    return res.send(completion.data.choices[0].message.content);
});

module.exports = router