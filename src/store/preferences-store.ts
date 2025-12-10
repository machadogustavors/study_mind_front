import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Preferences = {
  focusSubject: string
  notifications: boolean
  studyReminderHour: string
  aiTone: 'objetivo' | 'motivacional'
}

type PreferencesState = {
  preferences: Preferences
  updatePreferences: (changes: Partial<Preferences>) => void
}

const defaultPreferences: Preferences = {
  focusSubject: 'Matemática',
  notifications: true,
  studyReminderHour: '08:00',
  aiTone: 'motivacional',
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      updatePreferences: (changes) =>
        set((state) => ({ preferences: { ...state.preferences, ...changes } })),
    }),
    { name: 'studymind-preferences' },
  ),
)
