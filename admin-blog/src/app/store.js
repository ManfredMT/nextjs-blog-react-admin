import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import linkReducer from '../features/links/linkSlice'
import postReducer from '../features/posts/postSlice'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    links:linkReducer,
    posts:postReducer,
  },
});

