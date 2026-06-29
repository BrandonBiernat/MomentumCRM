import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
    credentials: 'include',
    prepareHeaders: (headers) => {
      return headers
    },
  }),
  tagTypes: [
    'Customer'
  ],
  endpoints: () => ({}),
})