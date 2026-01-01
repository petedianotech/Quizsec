import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingsState {
  timerEnabled: boolean;
  timerDuration: number;
  setTimerEnabled: (enabled: boolean) => void;
  setTimerDuration: (duration: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      timerEnabled: true,
      timerDuration: 15,
      setTimerEnabled: (enabled) => set({ timerEnabled: enabled }),
      setTimerDuration: (duration) => set({ timerDuration: duration }),
    }),
    {
      name: 'quiz-settings-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
