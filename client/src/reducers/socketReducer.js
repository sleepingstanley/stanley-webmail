import {  } from '../actions/constants';
import io from 'socket.io-client';

const socket = io();

const initialState = {};

//socket.on('connection', ())

socket.on('data', (data) => {
    console.log(data);
    //dispatchEvent(SOCKET_DISCONNECT);
});

export default (state = initialState, action) => {
    switch (action.type) {
      default:
        return state;
    }
  };