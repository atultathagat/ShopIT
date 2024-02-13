import {configureStore} from '@reduxjs/toolkit';
import productApi from './api/productApi';

export default configureStore({
    reducer: {
    [productApi.reducerPath]: productApi.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat([productApi.middleware])
});
