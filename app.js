const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');

const passportConfig = require('./lib/passport');
const config = require('./config');

const app = express();
app.use(bodyParser.json());
app.use(passport.initialize());

require('./models').connect(config.mongoURI).then(() => {
  passportConfig.init(passport);
});

app.use('/api/emails', require(path.join(__dirname, './routes/api/emails')));
app.use('/api/auth', require(path.join(__dirname, './routes/api/auth')));

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] === 'https') {
      next();
    } else {
      res.redirect('https://' + req.headers.host + req.url);
    }
  });

  app.use(express.static('./client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

require('./lib/server')(app).listen(port, () => console.log(`Server started on port ${port}`))