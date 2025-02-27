import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import templateReducer from './templateSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    templates: templateReducer,
    ui: uiReducer
  }
}); 