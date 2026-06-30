import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { setCredentials, clearCredentials } from '../store/slices/authSlice'
import type { RootState } from '../store/store'
import { credentialsFromResponse, type AuthResponse } from '../types'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: '/',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})

// Single-flight guard: concurrent 401s share one refresh round-trip.
let refreshPromise: ReturnType<typeof rawBaseQuery> | null = null

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  const url = typeof args === 'string' ? args : args.url
  const isAuthRequest = url.includes('api/auth/')

  if (result.error?.status === 401 && !isAuthRequest) {
    refreshPromise ??= rawBaseQuery({ url: 'api/auth/refresh', method: 'POST' }, api, extraOptions)
    const refreshResult = await refreshPromise
    refreshPromise = null

    if (refreshResult.data) {
      api.dispatch(setCredentials(credentialsFromResponse(refreshResult.data as AuthResponse)))
      result = await rawBaseQuery(args, api, extraOptions)
    } else {
      api.dispatch(clearCredentials())
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Customer'],
  endpoints: () => ({}),
})
