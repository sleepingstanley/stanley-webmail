const express = require('express');
const router = express.Router();
const async = require('async');
const models = require('mongoose').models;
const multer = require('multer');
const upload = multer();

const passportConfig = require('../../lib/passport');
const ParseURL = process.env.WEBMAIL_PARSE_URL || 'incoming';

router.get('/', passportConfig.checkAuth, (req, res) => {
  models.Email.find().sort({ date: -1 }).then(emails => {
    res.json(emails);
  });
});


router.post(`/${ParseURL}`, upload.any(), (req, res) => {
  let dataFrom = req.body.from, from;
  if ((start = dataFrom.indexOf(' <')) !== -1 && (end = dataFrom.indexOf('>')) !== -1) {
    from = {
      name: dataFrom.substring(0, start).trim(),
      email: dataFrom.substring(start + 2, end).trim()
    };
  } else {
    from = {
      email: dataFrom
    };
  }

  console.log(req.body);

  new models.Email({
    from: from,
    html: req.body.html,
    spamFilter: {
      score: req.body.spam_score,
      pass: req.body.SPF === 'pass'
    },
    subject: req.body.subject,
    text: req.body.text,
    to: req.body.to
    //date: Date,
  }).save().then(email => res.json(email));
});

router.post(`/update`, passportConfig.checkAuth, (req, res) => {
  let data = new Array();

  async.each(req.body.data, (element, callback) => {
    models.Email.findOneAndUpdate({ _id: element._id }, element.data, { new: true }, (err, email) => {
      if (err)
        return callback(err);
      data.push(email);
      callback();
    });
  }, (err) => {
    if (err)
      return res.status(404).json({ success: false });
    return res.json({ success: true, data: data });
  });
});

router.post('/delete', passportConfig.checkAuth, (req, res) => {
  async.each(req.body.data, (_id, callback) => {
    models.Email.findByIdAndRemove(_id)
      .then(() => callback())
      .catch(err => callback(err));
  }, (err) => {
    if (err)
      return res.status(404).json({ success: false });
    return res.json({ success: true });
  });
});

module.exports = router;