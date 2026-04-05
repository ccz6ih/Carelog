/**
 * CareLog Auth & App State (Zustand)
 * Persisted to AsyncStorage so state survives app reloads
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, Visit, CareRecipient, EVVStatus } from '@/types';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;

  // Active visit
  activeVisit: Visit | null;
  evvStatus: EVVStatus;
  clockInTime: Date | null;
  elapsedSeconds: number;

  // Active recipient
  activeRecipientId: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setOnboarded: (val: boolean) => void;
  startVisit: (visit: Visit) => void;
  endVisit: () => void;
  setEVVStatus: (status: EVVStatus) => void;
  setElapsed: (seconds: number) => void;
  setActiveRecipient: (id: string | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isOnboarded: false,
      activeVisit: null,
      evvStatus: 'idle',
      clockInTime: null,
      elapsedSeconds: 0,
      activeRecipientId: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setOnboarded: (val) => set({ isOnboarded: val }),

      startVisit: (visit) =>
        set({
          activeVisit: visit,
          evvStatus: 'clocked_in',
          clockInTime: new Date(),
          elapsedSeconds: 0,
        }),

      endVisit: () =>
        set({
          activeVisit: null,
          evvStatus: 'idle',
          clockInTime: null,
          elapsedSeconds: 0,
        }),

      setEVVStatus: (status) => set({ evvStatus: status }),
      setElapsed: (seconds) => set({ elapsedSeconds: seconds }),
      setActiveRecipient: (id) => set({ activeRecipientId: id }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isOnboarded: false,
          activeVisit: null,
          evvStatus: 'idle',
          activeRecipientId: null,
        }),
    }),
    {
      name: 'carelog-app-state',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isOnboarded: state.isOnboarded,
        activeRecipientId: state.activeRecipientId,
        // Don't persist active visit or timer — those are ephemeral
      }),
    }
  )
);

export default useAppStore;
