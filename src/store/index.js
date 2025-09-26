import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import projectsReducer from './projectsSlice';
import bugsReducer from './bugsSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    projects: projectsReducer,
    bugs: bugsReducer,
  },
});

export default store;
