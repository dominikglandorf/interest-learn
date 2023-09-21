const mongoose = require('mongoose');

const { Schema } = mongoose;

const vocabularySchema = new Schema({
  language: String,
  niveau: String,
  text: String,
  vocabulary: Array,
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Vocabulary = mongoose.model('Vocabulary', vocabularySchema);

module.exports = Vocabulary;
