const mongoose = require('mongoose');

const { Schema } = mongoose;

const exportSchema = new Schema({
  vocabulary: Array,
  language: String,
  translationLanguage: String,
  export: Array,
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Export = mongoose.model('Export', exportSchema);

module.exports = Export;
