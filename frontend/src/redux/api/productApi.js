import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "universal-cookie";

const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/api/v1" }),
  tagTypes: ["Product", "AdminProducts"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        params,
      }),
    }),
    getProductDetails: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
      }),
      providesTags: ["Product"],
    }),
    submitReview: builder.mutation({
      query: ({ token, ...body }) => ({
        url: "/reviews",
        body,
        method: "PUT",
        headers: { token },
      }),
      invalidatesTags: ["Product"],
    }),
    canUserReview: builder.query({
      query: (productId) => ({
        url: `/can_review/?productId=${productId}`,
        headers: { token: new Cookies().get("token") },
      }),
    }),
    getAdminProducts: builder.query({
      query: () => ({
        url: `/admin/products`,
        headers: { token: new Cookies().get("token") },
      }),
      providesTags: ["AdminProducts"],
    }),
    createNewProduct: builder.mutation({
      query: (body) => ({
        url: "/admin/products",
        body,
        method: "POST",
        headers: { token: new Cookies().get("token") },
      }),
      invalidatesTags: ["AdminProducts"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/products/${id}`,
        body,
        method: "PUT",
        headers: { token: new Cookies().get("token") },
      }),
      invalidatesTags: ["Product", "AdminProducts"],
    }),
    uploadProductImages: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/products/${id}/upload_images`,
        body,
        method: "PUT",
        headers: { token: new Cookies().get("token") },
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProductImage: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/products/${id}/delete_image`,
        body,
        method: "PUT",
        headers: { token: new Cookies().get("token") },
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
        headers: { token: new Cookies().get("token") },
      }),
      invalidatesTags: ["AdminProducts"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useSubmitReviewMutation,
  useCanUserReviewQuery,
  useGetAdminProductsQuery,
  useCreateNewProductMutation,
  useUpdateProductMutation,
  useUploadProductImagesMutation,
  useDeleteProductImageMutation,
  useDeleteProductMutation,
} = productApi;
export default productApi;
