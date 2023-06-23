const { query, body, validationResult } = require('express-validator');

// Language Validation Chain
const language = () => query('language')
  .notEmpty().withMessage('Language is required')
  .isString().withMessage('Language must be a string')
  .isLength({ max: 20 }).withMessage('Language should not exceed 20 characters');

const bodyLanguage = () => body('language')
  .notEmpty().withMessage('Language is required')
  .isString().withMessage('Language must be a string')
  .isLength({ max: 20 }).withMessage('Language should not exceed 20 characters');

  // Translation Language Validation Chain
const translationLanguage = () => query('translation_language')
.notEmpty().withMessage('Language is required')
.isString().withMessage('Language must be a string')
.isLength({ max: 20 }).withMessage('Language should not exceed 20 characters');

// Niveau Validation Chain
const niveau = () => query('niveau')
  .notEmpty().withMessage('Niveau is required')
  .isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid Niveau');

// Topic Validation Chain
const topic = () => query('topic')
  .notEmpty().withMessage('Topic is required')
  .isString().withMessage('Topic must be a string')
  .isLength({ max: 50 }).withMessage('Topic should not exceed 50 characters');

// Topic Validation Chain
const selection = () => query('selection')
  .notEmpty().withMessage('Selection is required')
  .isString().withMessage('Selection must be a string')
  .isLength({ max: 100 }).withMessage('Selection should not exceed 50 characters');

const text = () => query('text')
  .notEmpty().withMessage('Text is required')
  .isString().withMessage('Text must be a string')
  .isLength({ max: 4000 }).withMessage('Text should not exceed 4000 characters');

const bodyText = () => body('text')
.notEmpty().withMessage('Text is required')
.isString().withMessage('Text must be a string')
.isLength({ max: 4000 }).withMessage('Text should not exceed 4000 characters');

const vocabulary = () => query('vocabulary')
  .notEmpty().withMessage('Vocabulary is required')
  .isString().withMessage('Vocabulary must be a string')
  .isLength({ max: 1000 }).withMessage('Vocabulary list should not exceed 1000 characters');

const messageHistory = () => body('messageHistory')
  .notEmpty()
  .withMessage('Message history is required')
  .isArray()
  .withMessage('Message history must be an array')
  .custom((value, { req }) => {
    // Custom validation function for each element of the array
    if (!Array.isArray(value)) {
      throw new Error('Message history must be an array');
    }

    // Perform additional validations for each element in the array
    for (const message of value) {
      if (typeof message !== 'object' || Array.isArray(message)) {
        throw new Error('Each message in history must be an object');
      }
      if (!message.role|| !message.content) {
        throw new Error('Each message must have a role and content.');
      }
    }

    // Return true if all validations pass
    return true;
  });

module.exports = { language, bodyLanguage, translationLanguage, niveau, topic, selection, text, vocabulary, bodyText, messageHistory, validationResult }