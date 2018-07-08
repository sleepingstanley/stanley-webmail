const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailSchema = new Schema({
  attachments: [{}],
  date: {
    type: Date,
    default: Date.now
  },
  from: {
    name: String,
    email: String
  },
  html: String,
  read: {
    type: Boolean,
    default: false
  },
  spamFilter: {
    score: Number,
    pass: Boolean
  },
  subject: String,
  text: String,
  to: String
});

module.exports = mongoose.model('Email', EmailSchema);