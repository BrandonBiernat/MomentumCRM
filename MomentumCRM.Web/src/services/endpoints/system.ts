import { baseApi } from '../baseApi'

export const systemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    health: builder.query<string, void>({
      query: () => ({ url: 'health', responseHandler: 'text' }),
    }),
  }),
  overrideExisting: false,
})

export const { useHealthQuery } = systemApi
