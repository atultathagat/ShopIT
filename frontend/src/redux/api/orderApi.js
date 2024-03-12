import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const orderApi =  createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api/v1' }),
  endpoints: builder => ({
    createNewOrder: builder.mutation({
      query: ({token, ...body}) => ({
        url: '/orders/new',
        body,
        method: 'POST',
        headers: { token }
      })
    })
  })
});

export const {useCreateNewOrderMutation} = orderApi;
export default orderApi;
