import { RadioGroup, Switch, type RadioOption } from '../components'
import { useUpdateSettingsMutation } from '../services'
import { useAppSelector } from '../store'
import { selectSettings } from '../store/slices'
import type { ThemePreference, UserSettings } from '../types/settings'

const themeOptions: RadioOption[] = [
  { value: 'System', label: 'System' },
  { value: 'Light', label: 'Light' },
  { value: 'Dark', label: 'Dark' },
]

export const SettingsPage = () => {
  const settings = useAppSelector(selectSettings)
  const [updateSettings] = useUpdateSettingsMutation()

  const save = (patch: Partial<UserSettings>) => updateSettings({ ...settings, ...patch })

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Settings</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Manage how Momentum looks and how it reaches you.
      </p>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Appearance</h2>
        <p className="mt-1 mb-4 text-sm text-slate-500 dark:text-slate-400">
          Choose a theme. System follows your device setting.
        </p>
        <RadioGroup
          aria-label="Theme"
          options={themeOptions}
          value={settings.theme}
          onChange={(value) => save({ theme: value as ThemePreference })}
        />
      </section>

      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</h2>
        <p className="mt-1 mb-4 text-sm text-slate-500 dark:text-slate-400">
          Control which emails you receive.
        </p>
        <Switch
          isSelected={settings.eventEmailSubscription}
          onChange={(isSelected) => save({ eventEmailSubscription: isSelected })}
        >
          Email me about events
        </Switch>
      </section>
    </div>
  )
}
