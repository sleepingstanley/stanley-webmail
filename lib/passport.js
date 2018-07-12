const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const { jwtSecret } = require('../config');
const models = require('mongoose').models;

giveUserData = (user) => {
  return {
    name: user.name,
    email: user.email
  };
};

module.exports.init = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
  }, (email, password, done) => {
    models.User.findOne({ email: email }, (err, user) => {
      if (err)
        return done(err);

      if (!user) return done(null, false, { message: 'Invalid email/password' });

      return user.comparePassword(password, (err, matched) => {
        if (err)
          return done(err);

        if (!matched)
          return done(null, false, { message: 'Invalid email/password' });

        const token = jwt.sign({ sub: user._id }, jwtSecret);

        return done(null, token, giveUserData(user));
      });
    });
  }));
};

module.exports.checkAuth = (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(401).end();

  const token = req.headers.authorization.split(' ')[1];

  return jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err)
      return res.status(401).end();

    const _id = decoded.sub;

    return models.User.findById(_id, (err, user) => {
      if (err || !user)
        return res.status(401).end();

      res.locals.user = user;
      res.app.locals.io.emit('data', 'hello');

      return next();
    });
  });
};

module.exports.updateAuth = (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(401).json({ msg: 'no authorization header' });
  const token = req.headers.authorization.split(' ')[1];
  return jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err)
      return res.status(401).json(err);

    const _id = decoded.sub;

    return models.User.findById(_id, (err, user) => {
      if (err || !user) {
        console.log(err);
        console.log(user);
        return res.status(401).end();
      }

      return res.status(200).json({ user: giveUserData(user) });
    });
  });
};