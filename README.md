# stanley-webmail (Can be accessed <a href="https://webmail.stanleykerr.co" target="_blank">here</a>)
A (private) webmail client that includes utilization of Node.js, Express.js, React.js v4, Redux, Mongoose (MongoDB), Passport, and Socket.io.

## Details
* Source control using Git/GitHub
* Hosted on Heroku (PaaS)
* Processes incoming emails
* Uses a MX catchall in order to parse and process inbound emails.

## Sample Account Login(s)
| Username | Domain              | Password |
| -------- | ------------------- | -------- |
| public   | @stanleykerr.co     | Pass1234 |
| public   | @tmp.stanleykerr.co | Pass1234 |

---
## Installation Instructions
##### Note: This project isn't really intended for others to use
#### But, if you ***really*** wanted to set up your own version, follow these steps:

```
git clone https://github.com/sleepingstanley/stanley-webmail.git
cd stanley-webmail
npm i && npm i --prefix client
```
This will install all the dependencies required and will use concurrently to launch both the Node.js/Express backend server as well as the React.js frontend server

You're going to need access to a MongoDB database and some way to process incoming emails.

To process incoming emails, you need to set up some kind of inbound-email parser. I suggest trying the free service provided by <a href="https://sendgrid.com/" target="_blank">SendGrid</a> (You'll need to use this project's parse URL)

Create a file named `config.local.js` in the project's root directory and fill this out:
```javascript
module.exports = {
  parseURL: 'incoming', // Email that SendGrid/email parser will use to parse emails. It can be accessed by the inbound parser at http://mydomain.com/api/emails/<parseURL>
  mongoURI: 'mongodb://username:password@hostname:port/dbname', // MongoDB URI for database connections
  jwtSecret: 'i like puppies' // Secret key that is used to store session information.
};
```

#### If you're running this in production mode, you'll need to set the environment variables instead of using the local file:
* PARSE_URL
* MONGODB_URI
* JWT_SECRET

Next, running `npm run dev` *should* auto-launch in your default browser, but if it doesn't, you can open the client manually:

#### <a href="http://localhost:3000/" target="_blank">Locally</a> or <a href="http://172.27.0.65:3000/" target="_blank">On Your Network</a>

---

##### This project was started on July 8th, 2018
