const mongoose = require('mongoose');

const { Schema } = mongoose;

const continuationSchema = new Schema({
  text: String,
  continuation: String,
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Continuation = mongoose.model('Continuation', continuationSchema);

module.exports = Continuation;
