import { baseApi } from '../baseApi'
import { setSettings, selectSettings } from '../../store/slices/settingsSlice'
import type { RootState } from '../../store/store'
import type { UserSettings } from '../../types/settings'

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<UserSettings, void>({
      query: () => ({ url: 'api/settings' }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(setSettings(data))
        } catch {
          // keep whatever was hydrated from the auth response
        }
      },
    }),
    updateSettings: builder.mutation<UserSettings, UserSettings>({
      query: (body) => ({
        url: 'api/settings',
        method: 'PUT',
        body,
      }),
      onQueryStarted: async (next, { dispatch, getState, queryFulfilled }) => {
        const previous = selectSettings(getState() as RootState)
        dispatch(setSettings(next))
        try {
          const { data } = await queryFulfilled
          dispatch(setSettings(data))
        } catch {
          dispatch(setSettings(previous))
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi
