import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "universal-cookie";
const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/api/v1" }),
  tagTypes: ["Order", "AdminOrders", "Reviews"],
  endpoints: (builder) => ({
    createNewOrder: builder.mutation({
      query: ({ token, ...body }) => ({
        url: "/orders/new",
        body,
        method: "POST",
        headers: { token },
      }),
    }),
    stripCheckoutSession: builder.mutation({
      query: ({ token, ...body }) => ({
        url: "/payment/checkout_session",
        body,
        method: "POST",
        headers: { token },
      }),
    }),
    myOrders: builder.query({
      query: () => ({
        url: "/me/orders",
        headers: { token: new Cookies().get("token") },
      }),
    }),
    orderDetails: builder.query({
      query: (id) => ({
        url: `/orders/${id}`,
        headers: { token: new Cookies().get("token") },
      }),
      providesTags: ['Order']
    }),
    getDashboardSales: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `/admin/get_sales?startDate=${startDate}&endDate=${endDate}`,
        headers: { token: new Cookies().get("token") },
      }),
    }),
    getAdminOrders: builder.query({
      query: () => ({
        url: `/admin/orders`,
        headers: { token: new Cookies().get("token") },
      }),
      providesTags: ['AdminOrders']
    }),
    updateOrder: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/orders/${id}`,
        body,
        method: "PUT",
        headers: { token: new Cookies().get("token") },
      }),
      invalidatesTags: ['Order']
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/admin/orders/${id}`,
        method: "DELETE",
        headers: { token: new Cookies().get("token") },
      }),
      invalidatesTags: ['AdminOrders']
    }),
    getAdminReviews: builder.query({
      query: (productId) => ({
        url: `/reviews?id=${productId}`,
        headers: { token: new Cookies().get("token") },
      }),
      providesTags:['Reviews']
    }),
    deleteReview: builder.mutation({
      query: ({productId, id}) => ({
        url: `/reviews/?productId=${productId}&id=${id}`,
        method: "DELETE",
        headers: { token: new Cookies().get("token") },
      }),
      invalidatesTags:['Reviews']
  }),
}),
});

export const {
  useCreateNewOrderMutation,
  useStripCheckoutSessionMutation,
  useMyOrdersQuery,
  useOrderDetailsQuery,
  useLazyGetDashboardSalesQuery,
  useGetAdminOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useLazyGetAdminReviewsQuery,
  useDeleteReviewMutation
} = orderApi;
export default orderApi;
