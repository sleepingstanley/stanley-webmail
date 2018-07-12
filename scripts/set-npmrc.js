const fs = require('fs');
fs.writeFileSync('./client/.npmrc', `@fortawesome:registry=https://npm.fontawesome.com/\n//npm.fontawesome.com/:_authToken=${process.env.FONTAWESOME_AUTH}`);
fs.chmodSync('./client/.npmrc', 0600);
