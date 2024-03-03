/* eslint-disable semi */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import userApi from './userAPI';
import Cookies from 'universal-cookie';
import { setUser } from '../filters/userSlice';

const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api/v1' }),
  endpoints: builder => ({
    login: builder.mutation({
      query: body => ({
        url: '/login',
        body,
        method: 'POST'
      }),
      async onQueryStarted(__, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.token) {
            const cookies = new Cookies();
            cookies.set('token', data.token);
          }
          await dispatch(
            userApi.endpoints.getMe.initiate(new Cookies().get('token'))
          );
        } catch (error) {
          console.log(error);
        }
      }
    }),
    register: builder.mutation({
      query: body => ({
        url: '/register',
        body,
        method: 'POST'
      }),
      async onQueryStarted(__, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.token) {
            const cookies = new Cookies();
            cookies.set('token', data.token);
          }
          await dispatch(
            userApi.endpoints.getMe.initiate(new Cookies().get('token'))
          );
        } catch (error) {
          console.log(error);
        }
      }
    }),
    logout: builder.query({
      query: () => ({
        url: '/logout'
      }),
      async onQueryStarted(__, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          const cookies = new Cookies();
          cookies.remove('token');
          dispatch(setUser(null));
          dispatch(setUserAuthenticated(false));
        } catch (error) {
          console.log(error);
        }
      }
    })
  })
});
export const { useLoginMutation, useRegisterMutation, useLazyLogoutQuery } =
  authApi;
export default authApi;
