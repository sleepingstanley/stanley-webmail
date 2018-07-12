import io from 'socket.io-client';
import { GET_EMAILS } from '../actions/constants';

let dispatch = (msg, payload) => {
  console.log(`[ERR] Tried to dispatch '${msg}':`, payload);
};

const host = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

const socket = io(host, {
  transports: ['websocket'],
  //secure: true,
});
  
socket.on('data', (data) => {
  console.log(data);
});

socket.on('new-email', (data) => {
  console.log(data);
});

export default {
  init(store) {
    dispatch = store.dispatch;
  },
  Socket: socket
};