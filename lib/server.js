module.exports = (app, server) => {
  return new Promise(resolve => {
    const io = require('socket.io')(server);
    app.locals.io = io;

    io.on('connection', (client) => {
      console.log('client connected');

      client.on('authenticate', (data) => {
        console.log(data);
      });

      client.on('disconnect', (data) => {
        console.log('client disconnected');
      });
    });
    resolve();
  });
};