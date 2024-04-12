import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from "universal-cookie";
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
    }),  
    stripCheckoutSession: builder.mutation({
      query: ({token, ...body}) => ({
        url: '/payment/checkout_session',
        body,
        method: 'POST',
        headers: { token }
      })
    }),
    myOrders: builder.query({
      query: () => ({
        url: '/me/orders',
        headers: { token: new Cookies().get('token') },
      })
    }),
    orderDetails: builder.query({
      query: (id) => ({
        url: `/orders/${id}`,
        headers: { token: new Cookies().get('token') },
      })
    })
  })
});

export const {useCreateNewOrderMutation, useStripCheckoutSessionMutation, useMyOrdersQuery, useOrderDetailsQuery} = orderApi;
export default orderApi;
