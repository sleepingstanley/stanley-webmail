const dev = process.env.NODE_ENV !== 'production';

module.exports = dev ? require('./config.local.js') : {
    parseURL: process.env.PARSE_URL,
    mongoURI: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET
};