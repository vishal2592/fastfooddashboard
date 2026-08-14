import { configureStore } from '@reduxjs/toolkit';
import adminReducer from '../slicer/adminSlice';
import categoryReducer from '../slicer/categorySlice';
import productReducer from '../slicer/productSlice';

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    category: categoryReducer,
    product: productReducer,
  },
});