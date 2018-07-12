import { AUTHENTICATE_USER, DEAUTHENTICATE_USER } from '../actions/constants';
import Auth from '../modules/auth';

const initialState = {
  errors: [],
  token: Auth.getToken(),
  user: {},
  authenticated: false
}

export default (state = initialState, action) => {
  let payload = action.payload;
  switch (action.type) {
    case AUTHENTICATE_USER:
      if (!payload.success) {
        return {
          ...state,
          errors: payload.errors || [payload.message]
        };
      }
      Auth.authenticateUser(payload.token);
      if(payload.socket)
        payload.socket.emit('authenticate', payload.token);
      return {
        ...state,
        errors: [],
        token: payload.token,
        user: payload.user,
        authenticated: true
      };
    case DEAUTHENTICATE_USER:
      if(payload.socket)
        payload.socket.emit('deauthenticate');
      Auth.deauthenticateUser();
      return {
        ...state,
        token: Auth.getToken(),
        user: {},
        authenticated: false
      };
    default:
      return state;
  }
};