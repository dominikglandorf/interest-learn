const mongoose = require('mongoose');

const { Schema } = mongoose;

const textSchema = new Schema({
  language: String, // String is shorthand for {type: String}
  niveau: String,
  topic: String,
  text: String,
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Text = mongoose.model('Text', textSchema);

module.exports = Text;
