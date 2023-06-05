const textPrompt = (language, topic, niveau) =>
`You are ${niveau}-level ${language} learner with the goal to write an engaging and informative text of 100 words in ${language} about "${topic}". Use vocabulary and grammar appropriate for ${niveau}-level learners and capture the reader's interest.`

const explainPrompt = (selection, topic, language, niveau) => 
`Please provide an explanation of up to two sentences for the phrase/word "${selection}" for a ${niveau}-level learner of ${language}. The explanation should be in ${language}. Ensure it's appropriate for ${niveau}-level learners. The general topic is ${topic}.`

const vocabularyPrompt = (language, niveau, text) =>
`Extract important items from the text that enable you to discuss the content of the text. Each item can be a noun or verb or adjective or short phrase. Return a .csv style list. 
Text: ${text}`

const exportPrompt = (vocabulary, language, translationLanguage) =>
`Prompt:
Please take each entry from the provided vocabulary list and annotate it with the required grammatical information in ${language}. Additionally, provide the translation of each entry into ${translationLanguage}. The output should be a .csv list containing the following columns: entry, gender, numerosity, and translation.

Vocabulary List:
${vocabulary}

Desired Output Format:
entry, gender, numerosity, ${translationLanguage} translation`
// `${vocabulary}

// Take each entry and annotate it with grammatical information. Also translate it to ${translationLanguage}. Output a .csv list: entry, gender, numerosity, part of speech, translation`;
// `${vocabulary}
// List the above ${language} vocabulary items with their article if applicable. Write every ${language} entry in lower case. Add a translation to ${translationLanguage} for each entry in the form "entry, translation"`;

module.exports = { textPrompt, explainPrompt, vocabularyPrompt, exportPrompt };