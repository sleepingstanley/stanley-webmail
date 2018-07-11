module.exports = (app) => {
  const server = require('http').createServer(app);
  const io = require('socket.io')(server);

  io.on('connection', (client) => {
    console.log('client connected');

    client.on('join', (data) => {
      console.log(data);
    });
  });

  return server;
};