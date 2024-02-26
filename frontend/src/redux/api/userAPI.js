import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser, setUserAuthenticated } from "../filters/userSlice";

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/api/v1" }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getMe: builder.query({
      query: (token) => ({
        url: "/me",
        headers: { token },
      }),
      transformResponse: (results) => results.user,
      async onQueryStarted(__, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
          dispatch(setUserAuthenticated(true));
        } catch (error) {
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
  }),
});
export const { useGetMeQuery, useUpdateUserProfileMutation } = userApi;
export default userApi;
