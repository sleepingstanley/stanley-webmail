import { combineReducers } from 'redux';

import emailReducer from './emailReducer';
import authReducer from './authReducer';
//import socketReducer from './socketReducer';

export default combineReducers({
  email: emailReducer,
  auth: authReducer,
  //socket: socketReducer
});