import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const productApi =  createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api/v1' }),
  endpoints: builder => ({
    getProducts: builder.query({
      query: () => ({
        url: '/products'
      })
    }),
    getProductDetails: builder.query({
      query: (id) => ({
        url: `/products/${id}`
      })
    })
  })
});

export const {useGetProductsQuery, useGetProductDetailsQuery} = productApi;
export default productApi;
