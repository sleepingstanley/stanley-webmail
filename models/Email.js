const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailSchema = new Schema({
  attachments: [{}],
  body: String,
  date: {
    type: Date,
    default: Date.now
  },
  from: {
    name: String,
    email: String
  },
  read: {
    type: Boolean,
    default: false
  },
  subject: String,
  to: String
});

module.exports = mongoose.model('Email', EmailSchema);