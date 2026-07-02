import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { setCredentials, clearCredentials } from './authSlice'
import { defaultSettings, type ThemePreference, type UserSettings } from '../../types/settings'

const initialState: UserSettings = defaultSettings

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (_state, action: PayloadAction<UserSettings>) => action.payload,
    setTheme: (state, action: PayloadAction<ThemePreference>) => {
      state.theme = action.payload
    },
  },
  // Settings ride along on the auth response, so hydrate whenever credentials
  // are set (login / register / refresh) and reset to defaults on logout.
  extraReducers: (builder) => {
    builder
      .addCase(setCredentials, (_state, action) => action.payload.settings)
      .addCase(clearCredentials, () => defaultSettings)
  },
})

export const { setSettings, setTheme } = settingsSlice.actions
export const settingsReducer = settingsSlice.reducer

export const selectSettings = (s: RootState) => s.settings
export const selectTheme = (s: RootState) => s.settings.theme
