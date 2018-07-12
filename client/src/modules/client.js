import React from 'react';
import io from 'socket.io-client';

const host = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

const socket = io(host, {
  transports: ['websocket'],
  //secure: true,
});
  
socket.on('data', (data) => {
  console.log(data);
  //dispatchEvent(SOCKET_DISCONNECT);
});

export const Socket = socket;
export const SocketContext = React.createContext(socket);