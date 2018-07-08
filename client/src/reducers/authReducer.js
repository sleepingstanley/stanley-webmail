import { AUTHENTICATE_USER, DEAUTHENTICATE_USER } from '../actions/constants';
import Auth from '../modules/auth';

const initialState = {
  errors: [],
  token: Auth.getToken(),
  user: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE_USER:
      let payload = action.payload;
      if (!payload.success) {
        return {
          ...state,
          errors: payload.errors || [payload.message]
        };
      }
      Auth.authenticateUser(payload.token);
      return {
        ...state,
        errors: [],
        token: Auth.getToken(),
        user: payload.user
      };
    case DEAUTHENTICATE_USER:
      Auth.deauthenticateUser();
      return {
        ...state,
        token: Auth.getToken(),
        user: {}
      };
    default:
      return state;
  }
};