/**
 * CareLog Auth & App State (Zustand)
 */
import { create } from 'zustand';
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

  // Actions
  setUser: (user: User | null) => void;
  setOnboarded: (val: boolean) => void;
  startVisit: (visit: Visit) => void;
  endVisit: () => void;
  setEVVStatus: (status: EVVStatus) => void;
  setElapsed: (seconds: number) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  isOnboarded: false,
  activeVisit: null,
  evvStatus: 'idle',
  clockInTime: null,
  elapsedSeconds: 0,

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
  logout: () => set({ user: null, isAuthenticated: false, activeVisit: null }),
}));

export default useAppStore;
