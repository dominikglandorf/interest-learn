const mongoose = require('mongoose');

const { Schema } = mongoose;

const tandemSchema = new Schema({
  text: String,
  language: String,
  messageHistory: Array,
  response: String,
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Tandem = mongoose.model('Tandem', tandemSchema);

module.exports = Tandem;
