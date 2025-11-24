import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Settings } from '../../shared/types/settings';
import { DEFAULT_SETTINGS } from '../../shared/types/settings';

interface SettingsStore {
  settings: Settings;
  isLoading: boolean;
  isInitialized: boolean;
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
  subscribeWithSelector((set, get) => ({
    settings: DEFAULT_SETTINGS,
    isLoading: true,
    isInitialized: false,

    setSettings: (settings: Settings) => {
      set({ settings, isInitialized: true });
    },

    updateSettings: (partial: Partial<Settings>) => {
      console.log('[Settings Store] updateSettings called with:', partial);
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
          readCommentsTracker: partial.readCommentsTracker
            ? {
              ...state.settings.readCommentsTracker,
              ...partial.readCommentsTracker,
            }
            : state.settings.readCommentsTracker,
        },
      }));
    },
    resetSettings: () => {
      set({ settings: DEFAULT_SETTINGS });
    },

    initialize: async () => {
      console.log('[Settings Store] Initialize called. isInitialized:', get().isInitialized);
      if (get().isInitialized) {
        console.log('[Settings Store] Already initialized, skipping.');
        return;
      }

      console.log('[Settings Store] Initializing with defaults...');
      set({ isLoading: true });
      // In extension mode, this will be overridden by the adapter
      // In standalone mode, we just use defaults
      set({ settings: DEFAULT_SETTINGS, isLoading: false, isInitialized: true });
    },
  }))
);
