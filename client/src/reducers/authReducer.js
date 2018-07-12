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
      if(payload.socket) {
        payload.socket.emit('authenticate', 'hello, its ' + payload.user.name);
      }
      return {
        ...state,
        errors: [],
        token: Auth.getToken(),
        user: payload.user,
        authenticated: true
      };
    case DEAUTHENTICATE_USER:
      Auth.deauthenticateUser();
      if(payload.socket) {
        payload.socket.emit('authenticate', 'goodbye from ' + state.user.name);
      }
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