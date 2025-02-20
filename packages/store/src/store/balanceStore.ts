import { create } from "zustand";

interface BalanceState {
  balance: number;
  setBalance: (newBalance: number) => void;
}

export const useBalanceStore = create<BalanceState>((set) => ({
  balance: 0,
  setBalance: (newBalance) => set({ balance: newBalance }),
}));
