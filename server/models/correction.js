const mongoose = require('mongoose');

const { Schema } = mongoose;

const correctionSchema = new Schema({
  message: String,
  language: String,
  correction: String,
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Correction = mongoose.model('Correction', correctionSchema);

module.exports = Correction;
