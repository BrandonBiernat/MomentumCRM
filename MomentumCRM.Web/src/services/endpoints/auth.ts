import { baseApi } from '../baseApi'
import { setCredentials, clearCredentials } from '../../store/slices/authSlice'
import {
  credentialsFromResponse,
  type AuthResponse,
  type LoginRequest,
  type RegisterRequest,
} from '../../types/auth'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: 'api/auth/login',
        method: 'POST',
        body
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(credentialsFromResponse(data)))
        } catch {
          // surfaced to the caller via the mutation result
        }
      },
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: 'api/auth/register',
        method: 'POST',
        body
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(credentialsFromResponse(data)))
        } catch {
          // surfaced to the caller via the mutation result
        }
      },
    }),
    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: 'api/auth/refresh',
        method: 'POST'
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(credentialsFromResponse(data)))
        } catch {
          // no/invalid cookie on load — stay logged out
        }
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'api/auth/logout',
        method: 'POST'
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
        } finally {
          dispatch(clearCredentials())
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutMutation } = authApi
