const express = require('express');
const router = express.Router();
const async = require('async');
const models = require('mongoose').models;
const multer = require('multer');
const upload = multer();

const config = require('../../config');
const passportConfig = require('../../lib/passport');

const { sanitizeParam } = require('express-validator/filter');

let filterEmailString = (name) => {
  if (name.length == 0) return [];
  let processed = [], arr = name.split(',');
  for (var cur of arr) {
    let dataFrom = cur.trim(), from = { email: dataFrom }, start = dataFrom.indexOf('<'), end = dataFrom.indexOf('>');
    if (start !== -1 && end !== -1) {
      if (dataFrom.indexOf(' ') !== -1) {
        from = {
          name: dataFrom.substring(0, start).trim(),
          email: dataFrom.substring(start + 1, end).trim()
        };
      } else from = { email: dataFrom.substring(start + 1, end).trim() };
    }
    processed.push(from);
  }
  console.log(name, processed);
  return processed;
}

router.get('/', passportConfig.checkAuth, (req, res) => {
  let user = res.locals.user;
  models.Email.find(user.admin ? {} : { 'to.email': user.email }, 'from read text subject to').sort({ date: -1 }).then(emails => {
    res.json(emails);
  });
});

router.get('/:id', sanitizeParam('id').trim(), passportConfig.checkAuth, (req, res) => {
  models.Email.findOne({ _id: req.params.id }, '-__v', (err, email) => {
    if (err)
      return res.status(400).json({ success: false, error: err });

    res.json(email);
  });
});

router.post(`/${config.parseURL}`, upload.any(), (req, res) => {
  console.log(req.body);

  new models.Email({
    from: filterEmailString(req.body.from)[0],
    html: req.body.html,
    spamFilter: {
      score: req.body.spam_score,
      pass: req.body.SPF === 'pass'
    },
    subject: req.body.subject,
    text: req.body.text,
    to: filterEmailString(req.body.to)
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