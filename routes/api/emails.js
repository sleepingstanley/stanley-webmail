const express = require('express');
const router = express.Router();
const async = require('async');
const models = require('mongoose').models;
const multer = require('multer');
const upload = multer();

const config = require('../../config');
const passportConfig = require('../../lib/passport');

const { sanitizeParam } = require('express-validator/filter');

router.get('/', passportConfig.checkAuth, (req, res) => {
  models.Email.find(admin ? {} : { to: res.locals.user.email }, { from: true, read: true, text: true }).sort({ date: -1 }).then(emails => {
    res.json(emails);
  });
});

router.get('/:id', sanitizeParam('id').trim(), passportConfig.checkAuth, (req, res) => {
  models.Email.findOne({ _id: req.params.id }, { __v: false }, (err, email) => {
    if (err)
      return res.status(400).json({ success: false, error: err });

    res.json(email);
  });
});

router.post(`/${config.parseURL}`, upload.any(), (req, res) => {
  let dataFrom = req.body.from, from = { email: dataFrom };
  if (dataFrom) {
    let start = dataFrom.indexOf('<'), end = dataFrom.indexOf('>');
    if (dataFrom.indexOf(' ') !== -1) {
      from = {
        name: dataFrom.substring(0, start).trim(),
        email: dataFrom.substring(start + 1, end).trim()
      };
    } else from = { email: dataFrom.substring(start + 1, end).trim() };
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
    to: req.body.to.split(', ')
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