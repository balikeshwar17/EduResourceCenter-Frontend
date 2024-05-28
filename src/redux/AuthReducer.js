// src/redux/authReducer.js

import { LOGIN, LOGOUT, REGISTER } from './ActionTypes';

// Load state from local storage if available
const initialState = JSON.parse(localStorage.getItem('authState')) || {
  isAuthenticated: false,
  user: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      const loginState = {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
      localStorage.setItem('authState', JSON.stringify(loginState));
      return loginState;
    case LOGOUT:
      localStorage.removeItem('authState');
      return {
        isAuthenticated: false,
        user: null,
      };
    case REGISTER:
      const registerState = {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
      localStorage.setItem('authState', JSON.stringify(registerState));
      return registerState;
    default:
      return state;
  }
};

export default authReducer;
