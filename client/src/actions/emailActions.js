import axios from 'axios';
import { GET_EMAILS, GET_EMAIL, DELETE_EMAIL, SEND_EMAIL, EMAILS_LOADING, UPDATE_EMAIL } from './constants';
import Auth from '../modules/auth';

export const getEmails = () => dispatch => {
  dispatch(setEmailsLoading());
  axios.get('/api/emails', {
    headers: {
      Authorization: `Bearer ${Auth.getToken()}`
    }
  }).then(res => dispatch({ type: GET_EMAILS, payload: res.data }));
};

export const getEmail = id => dispatch => {
  dispatch(setEmailsLoading());
  axios.get(`/api/emails/${id}`, {
    headers: {
      Authorization: `Bearer ${Auth.getToken()}`
    }
  }).then(res => {
    updateEmail([{
      _id: id,
      data: { read: true }
    }]);
    dispatch({ type: GET_EMAIL, payload: res.data });
  }).catch(() => dispatch({ type: GET_EMAIL, payload: null }));
};

export const sendEmail = email => dispatch => {
  axios.post('/api/emails/parse', email, {
    headers: {
      Authorization: `Bearer ${Auth.getToken()}`
    }
  }).then(res => dispatch({ type: SEND_EMAIL, payload: res.data }));
};

export const deleteEmail = ids => dispatch => {
  axios.post('/api/emails/delete', {
    data: ids
  }, {
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`
      }
    }).then(() => dispatch({ type: DELETE_EMAIL, payload: ids }));
};

export const updateEmail = data => dispatch => {
  axios.post('/api/emails/update', {
    data: data
  }, {
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`
      }
    }).then(res => dispatch({ type: UPDATE_EMAIL, payload: res.data }));
};

export const setEmailsLoading = () => {
  return {
    type: EMAILS_LOADING
  };
};