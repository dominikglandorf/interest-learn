const express = require('express');
const { exportPrompt } = require('./prompts')
const validation = require('./validation');
const { openai, MODEL, MOCK } = require('./configuration');

const router = express.Router();

const sanitize = (info) => {
    return info.replace("N/A", "-").trim()
}

const extractPairs = (response) => {
    const lines = response.split('\n');
    const switchedColumns = lines.slice(lines[0].includes("entry,") ? 1 : 0).map((line) => {
        entries = line.split(',');
        if (entries.length < 4) return false
        return `${entries[3].replace(/\([^)]+\)/g).trim()},${entries[0].trim()} (${sanitize(entries[1])}/${sanitize(entries[2])})`;
    })
    return switchedColumns.filter((entry) => entry !== false).join('\n');
}

router.get('', [
    validation.vocabulary(),
    validation.language(),
    validation.translationLanguage(),
  ], async (req, res) => {
    // Check for validation errors
    const errors = validation.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const language = req.query.language;
    const translationLanguage = req.query.translation_language
    const vocabulary = req.query.vocabulary;

    if (MOCK) {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        await sleep(1000);
        return res.send(extractPairs(vocabulary, `Here's the revised list with the appropriate articles and German translations:

la langue, die Sprache
le contenu personnalisé, der personalisierte Inhalt
motiver, motivieren
comprendre, verstehen
les ressources technologiques modernes, die modernen technologischen Ressourcen
les applications mobiles, die mobilen Anwendungen
les vidéos en ligne, die Online-Videos
les logiciels éducatifs, die Bildungssoftware
les apprenants, die Lernenden
les points faibles, die Schwachpunkte
les compétences linguistiques, die sprachlichen Fähigkeiten
la grammaire, die Grammatik
le vocabulaire, der Wortschatz
l'expression orale, der mündliche Ausdruck
la compréhension écrite, das Leseverständnis
l'enseignement personnalisé, der personalisierte Unterricht
les méthodes efficaces, die effektiven Methoden
les objectifs d'apprentissage spécifiques, die spezifischen Lernziele
Please note that some words may not require articles in certain contexts, but I have provided them based on their usage in general phrases. Let me know if you have any more questions!`));
    }
    
    const completion = await openai.createChatCompletion({
        model: MODEL,
        messages: [{role: "user", content: exportPrompt(vocabulary, language, translationLanguage)}],
    });

    if (completion.status != 200) {
        console.log(completion);
        res.send(`Error: ${completion.statusText}`);
    }
    console.log(completion.data.choices[0].message.content);
    const vocab = extractPairs(completion.data.choices[0].message.content)
    return res.send(vocab);
});

module.exports = router