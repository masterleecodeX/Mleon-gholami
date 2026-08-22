import { create } from 'zustand';
import { AppState, ScanResult } from '../types';

interface StoreState {
  appState: AppState;
  scanResult: ScanResult | null;
  errorMessage: string | null;
  
  setAppState: (state: AppState) => void;
  setScanResult: (result: ScanResult) => void;
  setErrorMessage: (msg: string) => void;
  reset: () => void;
}

export const useAppStore = create<StoreState>((set) => ({
  appState: 'IDLE',
  scanResult: null,
  errorMessage: null,
  
  setAppState: (state) => set({ appState: state }),
  setScanResult: (result) => set({ scanResult: result }),
  setErrorMessage: (msg) => set({ errorMessage: msg, appState: 'ERROR' }),
  reset: () => set({ appState: 'IDLE', scanResult: null, errorMessage: null }),
}));
