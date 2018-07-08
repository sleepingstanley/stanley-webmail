const mongoose = require('mongoose');

module.exports.connect = (mongoURI) => {
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoURI, { useNewUrlParser: true }).then(() => {
      console.log('MongoDB Connected');

      require('./User');
      require('./Email');

      resolve();
    }).catch(err => {
      reject(err);
    });
  });
};