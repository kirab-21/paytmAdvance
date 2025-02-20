import { useBalanceStore } from "../store/balanceStore";

export const useBalance = () => {
  return useBalanceStore((state) => state.balance);
};
