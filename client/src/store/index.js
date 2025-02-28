import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './authSlice';
import templateReducer from './templateSlice';
import submissionReducer from './submissionSlice';
import uiReducer from './uiSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    templates: templateReducer,
    submissions: submissionReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.session', 'meta.arg'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.session'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
// See `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export default store; 