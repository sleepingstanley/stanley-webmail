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
  models.Email.find(user.admin ? {} : { 'to.email': user.email }, 'from read text subject to.email to.name date').sort({ date: -1 }).then(emails => {
    res.json(emails);
  });
});

router.get('/:id', sanitizeParam('id').trim(), passportConfig.checkAuth, (req, res) => {
  let user = res.locals.user, search = { _id: req.params.id }, newFrom = {}, newTo = [];
  if (!user.admin) search['to.email'] = user.email; // don't let non-admins view other emails (through direct id)

  models.Email.findOne(search, '-__v', (err, email) => {
    if (err)
      return res.status(400).json({ success: false, error: err });

    let newA = Object.assign({}, email, false);

    models.User.findOne({
      'email': (email.from && email.from.email) ? email.from.email.toLowerCase() : ''
    }, 'name _id', (err, from) => {
      if (!err && from && email.from) {
        newFrom = {
          realName: from.name,
          _id: from._id,
          email: email.from.email
        };
        if (email.from.name && email.from.name.indexOf('"') === -1)
          newFrom.name = `"${email.from.name}"`;
        if (email.from.email.toLowerCase() === user.email.toLowerCase())
          newFrom.me = true;
        newA._doc.from = newFrom;
      }
      async.each(email.to, (toArr, resolve) => {
        if (!toArr.email.endsWith('stanleykerr.co')) {
          newTo.push(toArr);
          return resolve();
        } // TODO: populate with actual list later. Store somewhere? database?
        models.User.findOne({
          email: toArr.email
        }, 'name _id', (err, to) => {
          if (!err && to) {
            let newE = {
              realName: to.name,
              _id: to._id,
              email: toArr.email
            };
            if (toArr.name && toArr.name.indexOf('"') === -1)
              newE.name = `"${toArr.name}"`;
            if (toArr.email.toLowerCase() === user.email.toLowerCase())
              newE.me = true;
            newTo.push(newE);
          }
          resolve();
        });
      }, (err) => {
        if (err)
          return res.status(400).json({ success: false, error: err });
        newA._doc.to = newTo;
        res.json(newA._doc);
      });
      //res.json(email);
    });
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