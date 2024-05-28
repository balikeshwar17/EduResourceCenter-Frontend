// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthReducer';

const store = configureStore({
  reducer: authReducer,
});

export default store;
