import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const composeSetup = process.env.NODE_ENV !== 'production' && typeof window === 'object' ? composeWithDevTools : compose

const initialState = {};

/*function createSocketIoMiddleware(socket, criteria = [], { eventName = 'action', execute = defaultExecute } = {}) {
  const emitBound = socket.emit.bind(socket);
  return ({ dispatch }) => {
    // Wire socket.io to dispatch actions sent by the server.
    socket.on(eventName, dispatch);
    return next => (action) => {
      if (evaluate(action, criteria)) {
        return execute(action, emitBound, next, dispatch);
      }
      return next(action);
    };
  };

  function evaluate(action, option) {
    if (!action || !action.type) return false;

    const { type } = action;
    let matched = false;
    if (typeof option === 'function') {
      matched = option(type, action);
    } else if (typeof option === 'string') {
      matched = type.indexOf(option) === 0;
    } else if (Array.isArray(option)) {
      matched = option.some(item => type.indexOf(item) === 0);
    }
    return matched;
  }

  function defaultExecute(action, emit, next, dispatch) { // eslint-disable-line no-unused-vars
    emit(eventName, action);
    return next(action);
  }
}

const proxyMiddleware */

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  composeSetup(
    applyMiddleware(...middleware)
  )
);

export default store;