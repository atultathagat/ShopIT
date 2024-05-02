import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setLoading, setUser, setUserAuthenticated } from "../filters/userSlice";
import Cookies from "universal-cookie";

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/api/v1" }),
  tagTypes: ["User", "AdminUsers", "AdminUser"],
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => ({
        url: "/me",
        headers: { token: new Cookies().get('token') },
      }),
      transformResponse: (results) => results.user,
      async onQueryStarted(__, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
          dispatch(setUserAuthenticated(true));
          dispatch(setLoading(false))
        } catch (error) {
          dispatch(setLoading(false))
          console.log(error);
        }
      },
      providesTags: ["User"],
    }),
    updateUserProfile: builder.mutation({
      query: ({ name, email, token }) => ({
        url: "/me/update",
        method: "PUT",
        body: { name, email },
        headers: { token },
      }),
      invalidatesTags: ["User"],
    }),
    uploadAvatar: builder.mutation({
      query: ({avatar, token}) => ({
        url: "/me/upload_avatar",
        method: "PUT",
        body: {avatar},
        headers: { token },
      }),
      invalidatesTags: ["User"],
    }),   
     updatePassword: builder.mutation({
      query: ({token, ...body}) => ({
        url: "/password/update",
        method: "PUT",
        body,
        headers: { token },
      })
    }),
    getAdminUsers: builder.query({
      query: () => ({
        url: `/admin/users`,
        headers: { token: new Cookies().get("token") },
      }),
      providesTags: ['AdminUsers']
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/user/${id}`,
        method: "DELETE",
        headers: { token: new Cookies().get("token") },
      }),
      invalidatesTags: ['AdminUsers']
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `/admin/user/${id}`,
        headers: { token: new Cookies().get("token") },
      }),
      providesTags: ['AdminUsers', 'AdminUser']
    }),
    updateUser: builder.mutation({
      query: ({id, body}) => ({
        url: `/admin/user/${id}`,
        method: "PUT",
        body,
        headers: { token: new Cookies().get("token") },
      }),
      invalidatesTags:['AdminUsers']
    }),
  })
});
export const { useGetMeQuery, useUpdateUserProfileMutation, useUploadAvatarMutation, 
  useUpdatePasswordMutation, useGetAdminUsersQuery, 
  useDeleteUserMutation, useGetUserDetailsQuery, useUpdateUserMutation } = userApi;
export default userApi;
