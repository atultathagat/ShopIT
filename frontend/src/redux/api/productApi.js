import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'universal-cookie';

const productApi =  createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api/v1' }),
  tagTypes: ['Product'],
  endpoints: builder => ({
    getProducts: builder.query({
      query: (params) => ({
        url: '/products',
        params
      })
    }),
    getProductDetails: builder.query({
      query: (id) => ({
        url: `/products/${id}`
      }),
      providesTags: ['Product']
    }),
    submitReview: builder.mutation({
      query: ({token, ...body}) => ({
        url: '/reviews',
        body,
        method: 'PUT',
        headers: { token }
      }),
      invalidatesTags: ['Product']
    }),
    canUserReview: builder.query({
      query: (productId) => ({
        url: `/can_review/?productId=${productId}`,
        headers: { token: new Cookies().get('token') },
      }),
    })
  })
});

export const {useGetProductsQuery, useGetProductDetailsQuery, useSubmitReviewMutation, useCanUserReviewQuery} = productApi;
export default productApi;
