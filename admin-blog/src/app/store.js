import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import linkReducer from '../features/links/linkSlice'
import postReducer from '../features/posts/postSlice'
import profileReducer from '../features/profile/profileSlice'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    links:linkReducer,
    posts:postReducer,
    profile:profileReducer
  },
});

