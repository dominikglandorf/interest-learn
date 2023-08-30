const textPrompt = (language, topic, niveau) =>
`You are ${niveau}-level ${language} learner with the goal to write an engaging and informative text of 100 words in ${language} about "${topic}". Use vocabulary and grammar appropriate for ${niveau}-level learners and capture the reader's interest.`

const explainPrompt = (selection, context, language, niveau, translation_language) => 
    `Text: "${context}"

You talk to a ${translation_language} native speaker who has a ${niveau} level of ${language}. Explain the meaning of "${selection}". Write in ${(niveau === "Beginner" ? translation_language : language)} and maximum two sentences.`

const vocabularyPrompt = (language, niveau, text) =>
`Extract important items from the text that enable you to discuss the content of the text. Each item can be a noun or verb or adjective or short phrase. Return a .csv style list. 
Text: ${text}`

const exportPrompt = (vocabulary, language, translationLanguage) =>
`Prompt:
Please take each entry from the provided vocabulary list and annotate it with the required grammatical information in ${language}. Additionally, provide the translation of each entry into ${translationLanguage}. The output should be a .csv list containing the following columns: entry, gender, numerosity, and translation.

Vocabulary List:
${vocabulary}

Desired Output Format:
entry, gender, numerosity, ${translationLanguage} translation`;

const continuePrompt = (text) =>
`Continue the text with a shift in topic. Add interesting information for the reader to keep him engaged. Use the same complexity in grammar and vocabulary.

Text: ${text}`

module.exports = { textPrompt, explainPrompt, vocabularyPrompt, exportPrompt, continuePrompt };