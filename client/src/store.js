import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const composeSetup = process.env.NODE_ENV !== 'production' && typeof window === 'object' ? composeWithDevTools : compose

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  composeSetup(
    applyMiddleware(...middleware)
  )
);

export default store;