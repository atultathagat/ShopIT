import { configureStore } from '@reduxjs/toolkit';
import productApi from './api/productApi';
import authApi from './api/authApi';
import userApi from './api/userAPI';
import orderApi from './api/orderApi';
import userReducer from './filters/userSlice';
import cartReducer from './filters/cartSlice';

export default configureStore({
  reducer: {
    auth: userReducer,
    cart: cartReducer,
    [productApi.reducerPath]: productApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat([productApi.middleware, authApi.middleware, userApi.middleware, orderApi.middleware])
});
