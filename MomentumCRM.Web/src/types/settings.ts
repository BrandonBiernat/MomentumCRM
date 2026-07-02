// Mirrors the API's ThemePreference enum (serialized as PascalCase strings).
export type ThemePreference = 'System' | 'Light' | 'Dark'

export type UserSettings = {
  theme: ThemePreference
  eventEmailSubscription: boolean
}

export const defaultSettings: UserSettings = {
  theme: 'System',
  eventEmailSubscription: true,
}
