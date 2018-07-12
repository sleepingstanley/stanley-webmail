import axios from 'axios';
import { AUTHENTICATE_USER, DEAUTHENTICATE_USER } from './constants';
import Auth from '../modules/auth';

export const authenticateUser = login => dispatch => {
  return new Promise((resolve, reject) => {
    axios.post('/api/auth/login', login)
      .then(res => {
        dispatch({ type: AUTHENTICATE_USER, payload: res.data });
        resolve();
      }).catch(err => {
        dispatch({ type: AUTHENTICATE_USER, payload: err.response.data });
        reject();
      });
  });
};

export const reauthenticateUser = socket => dispatch => {
  return new Promise((resolve, reject) => {
    axios.post('/api/auth/update', null, {
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`
      }
    }).then(res => {
      dispatch({
        type: AUTHENTICATE_USER,
        payload: {
          success: true,
          token: Auth.getToken(),
          user: res.data.user,
          socket: socket
        }
      });
      resolve();
    }).catch(err => {
      dispatch({ type: DEAUTHENTICATE_USER, payload: { socket: socket } });
      reject(err);
    });
  });
};

export const deauthenticateUser = socket => dispatch => {
  return new Promise((resolve) => {
    dispatch({ type: DEAUTHENTICATE_USER, payload: { socket: socket } });
    resolve();
  });
};