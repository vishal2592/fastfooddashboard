import { configureStore } from '@reduxjs/toolkit';
import adminReducer from '../slicer/adminSlice';
import categoryReducer from '../slicer/categorySlice';

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    category: categoryReducer,
  },
});