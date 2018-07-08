const express = require('express');
const router = express.Router();
const async = require('async');
const models = require('mongoose').models;

const passportConfig = require('../../lib/passport');
const ParseURL = process.env.WEBMAIL_PARSE_URL || 'incoming';

router.get('/', passportConfig.checkAuth, (req, res) => {
  models.Email.find().sort({ date: -1 }).then(emails => {
    res.json(emails);
  });
});

router.post(`/${ParseURL}`, (req, res) => {
  console.log(req.body);
  new models.Email({
    to: req.body.to,
    from: req.body.from,
    subject: req.body.subject,
    body: req.body.body,
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