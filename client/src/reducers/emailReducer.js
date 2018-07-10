import { GET_EMAILS, GET_EMAIL, DELETE_EMAIL, SEND_EMAIL, EMAILS_LOADING, UPDATE_EMAIL } from '../actions/constants';

const initialState = {
  emails: [],
  email: null,
  loading: false
}

function findElementAndUpdate(emailArr, element) {
  emailArr.splice(emailArr.findIndex(email => email._id === element._id), 1, element)
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_EMAILS:
      return {
        ...state,
        emails: action.payload,
        loading: false
      };
    case GET_EMAIL:
      return {
        ...state,
        email: action.payload,
        loading: false
      };
    case DELETE_EMAIL:
      return {
        ...state,
        emails: state.emails.filter(email => action.payload.indexOf(email._id) === -1)
      };
    case SEND_EMAIL:
      return {
        ...state,
        emails: [action.payload, ...state.emails]
      };
    case EMAILS_LOADING:
      return {
        ...state,
        email: null,
        loading: true
      };
    case UPDATE_EMAIL:
      let newEmails = [...state.emails];
      for (var element of action.payload.data)
        findElementAndUpdate(newEmails, element);
      return {
        ...state,
        emails: newEmails
      }
    default:
      return state;
  }
};