const dev = process.env.NODE_ENV !== 'production';

module.exports = dev ? require('./config.local.js') : {
    mongoURI: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET
};