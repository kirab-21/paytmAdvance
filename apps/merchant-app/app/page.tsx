"use client";

//import { ReactNode } from "react";
import { useBalanceStore } from "@repo/store/balanceStore";

export default function BalanceComponent() {
  const balance = useBalanceStore(
    (state: { balance: number }) => state.balance,
  ); // Access Zustand state

  return <div>hi there {balance}</div>;
}
