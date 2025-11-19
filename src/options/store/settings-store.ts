import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Settings } from '../../shared/types/settings';
import { DEFAULT_SETTINGS } from '../../shared/types/settings';

interface SettingsStore {
  settings: Settings;
  isLoading: boolean;
  setSettings: (settings: Settings) => void;
  updateSettings: (partial: Partial<Settings>) => void;
  resetSettings: () => void;
  initialize: () => Promise<void>;
}

/**
 * Zustand store for settings management
 * Works in both extension and standalone modes
 */
export const useSettingsStore = create<SettingsStore>()(
  subscribeWithSelector((set, _get) => ({
    settings: DEFAULT_SETTINGS,
    isLoading: true,

    setSettings: (settings: Settings) => {
      set({ settings });
    },

    updateSettings: (partial: Partial<Settings>) => {
      set((state) => ({
        settings: {
          ...state.settings,
          ...partial,
          // Deep merge for nested objects
          features: {
            ...state.settings.features,
            ...(partial.features || {}),
          },
          prList: partial.prList
            ? {
                ...state.settings.prList,
                ...partial.prList,
                enabledOnPages: {
                  ...state.settings.prList?.enabledOnPages,
                  ...(partial.prList?.enabledOnPages || {}),
                },
              }
            : state.settings.prList,
          aliasing: partial.aliasing
            ? {
                ...state.settings.aliasing,
                ...partial.aliasing,
              }
            : state.settings.aliasing,
        },
      }));
    },

    resetSettings: () => {
      set({ settings: DEFAULT_SETTINGS });
    },

    initialize: async () => {
      set({ isLoading: true });
      // In extension mode, this will be overridden by the adapter
      // In standalone mode, we just use defaults
      set({ settings: DEFAULT_SETTINGS, isLoading: false });
    },
  }))
);


