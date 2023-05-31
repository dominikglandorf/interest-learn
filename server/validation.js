const { query, validationResult } = require('express-validator');

// Language Validation Chain
const language = () => query('language')
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
  .isLength({ max: 1000 }).withMessage('Selection should not exceed 1000 characters');

module.exports = { language, niveau, topic, selection, text, validationResult }