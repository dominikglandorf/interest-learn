const mongoose = require('mongoose');

const { Schema } = mongoose;

const explanationSchema = new Schema({
  language: String,
  selection: String,
  context: String,
  niveau: String,
  translation_language: String,
  explanation: String,
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Explanation = mongoose.model('Explanation', explanationSchema);

module.exports = Explanation;
