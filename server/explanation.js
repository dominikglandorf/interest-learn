const express = require('express');
const validation = require('./validation');
const { openai, MODEL } = require('./configuration');

const router = express.Router();

router.get('', [
    validation.language(),
    validation.selection(),
  ], async (req, res) => {
    // Check for validation errors
    const errors = validation.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const language = req.query.language;
    const selection = req.query.selection;

    const prompt = `Explain "${selection}" in its context. The explanation should be in ${language} and have one or two sentences.`;

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