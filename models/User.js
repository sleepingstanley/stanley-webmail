const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    index: { unique: true }
  },
  password: String,
  admin: {
    type: Boolean,
    default: true
  }
});

UserSchema.methods.comparePassword = function comparePassword(password, callback) {
  bcrypt.compare(password, this.password, callback);
};

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  return bcrypt.genSalt((saltError, salt) => {
    if (saltError)
      return next(saltError);

    return bcrypt.hash(this.password, salt, (hashError, hash) => {
      if (hashError)
        return next(hashError);

      this.password = hash;
      return next();
    });
  });
});

module.exports = mongoose.model('User', UserSchema);