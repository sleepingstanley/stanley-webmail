const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConfig = require('../../lib/passport');

const User = require('../../models/User');

const { check, validationResult } = require('express-validator/check');

router.post('/register', [
  check('name').trim().not().isEmpty().withMessage('Please provide your name.'),
  check('email').trim().isEmail().withMessage('Please provide your email address.'),
  check('password').trim().not().isEmpty().withMessage('Please provide your password.').isLength({min: 8}).withMessage('Password must be at least 8 characters.')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorz = {};
    errors.array({ onlyFirstError: true }).forEach(error => {
      errorz[error.param] = error.msg;
    });
    return res.status(422).json({ errors: errorz });
  }
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }).then(user => res.json(user));
});

router.post('/login', [
  check('email').trim().isEmail().withMessage('Please provide your email address.').normalizeEmail(),
  check('password').trim().not().isEmpty().withMessage('Please provide your password.')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorz = [];
    errors.array({ onlyFirstError: true }).forEach(error => errorz.push(error.msg));
    return res.status(422).json({ success: false, errors: errorz });
  }
  passport.authenticate('local', (err, token, data) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    if (!token) {
      return res.status(400).json({
        success: false,
        message: data.message
      });
    }
    return res.json({
      success: true,
      message: 'You have logged in successfully',
      token,
      user: data
    })
  })(req, res, next);
});

router.post('/update', passportConfig.updateAuth);

module.exports = router;