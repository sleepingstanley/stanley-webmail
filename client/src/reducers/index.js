import { combineReducers } from 'redux';

import emailReducer from './emailReducer';
import authReducer from './authReducer';

export default combineReducers({
  email: emailReducer,
  auth: authReducer
});