const express = require('express');
const validation = require('./validation');
const { vocabularyPrompt } = require('./prompts')
const { openai, MODEL, MOCK } = require('./configuration');

const router = express.Router();

function convertCommaSeparatedList(string) {
    // remove full stops from the end
    if (string.charAt(string.length - 1) === '.') {
        string = string.slice(0, -1);
      }

    // Split the list by commas
    const entries = string.split(',');
  
    // Trim each entry and create a new array
    const trimmedEntries = entries.map((entry) => entry.trim());
  
    // Convert the trimmed entries array to JSON
    const jsonArray = JSON.stringify(trimmedEntries);
  
    return jsonArray;
  }

router.get('', [
    validation.language(),
    validation.niveau(),
    validation.text(),
  ], async (req, res) => {
    // Check for validation errors
    const errors = validation.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const language = req.query.language;
    const niveau = req.query.niveau;
    const text = req.query.text;

    if (MOCK==2) {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        await sleep(500);
        return res.send(convertCommaSeparatedList("langue, contenu personnalisé, motiver, comprendre, ressources technologiques modernes, applications mobiles, vidéos en ligne, logiciels éducatifs, apprenants, points faibles, compétences linguistiques, grammaire, vocabulaire, expression orale, compréhension écrite, enseignement personnalisé, méthodes efficaces, objectifs d'apprentissage spécifiques"));
    }
    
    const completion = await openai.createChatCompletion({
        model: MODEL,
        messages: [{role: "user", content: vocabularyPrompt(language, niveau, text)}],
    });

    if (completion.status != 200) {
        console.log(completion);
        res.send(`Error: ${completion.statusText}`);
    }

    const vocab = convertCommaSeparatedList(completion.data.choices[0].message.content)
    return res.send(vocab);
});

module.exports = router