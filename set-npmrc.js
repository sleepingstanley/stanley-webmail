if(process.env.NODE_ENV !== 'production') return;
  
const fs = require('fs');
fs.writeFileSync('./client/.npmrc', '@fortawesome:registry=https://npm.fontawesome.com/');
fs.appendFileSync('./client/.npmrc', `//npm.fontawesome.com/:_authToken=${process.env.FONTAWESOME_AUTH}`);
fs.chmodSync('./client/.npmrc', 0600);