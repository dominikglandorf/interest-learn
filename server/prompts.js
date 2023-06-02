const textPrompt = (language, topic, niveau) =>
`Write a ${language} text of 100 words about "${topic}" with a ${niveau} grammar, sentence structure and vocabulary.`;

const explainPrompt = (selection, text, language) => 
`Act like a language teacher and explain "${selection}" in the following text: "${text}". The explanation should be in ${language} and have one or two sentences.`;

const vocabularyPrompt = (language, niveau, text) =>
`"${text}"
Give a comma-seperated list of the key words in ${language} that a ${niveau} language student should remember from the above text. Exclude names of persons.`;

const exportPrompt = (vocabulary, language, translationLanguage) =>
`${vocabulary}
List the above ${language} vocabulary items with their article if applicable. Write every ${language} entry in lower case. Add a translation to ${translationLanguage} for each entry in the form "entry, translation"`;

module.exports = { textPrompt, explainPrompt, vocabularyPrompt, exportPrompt };