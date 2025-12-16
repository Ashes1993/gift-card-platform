"use client";

import { AccountProvider } from "@/context/account-context";
import { CartProvider } from "@/context/cart-context";

export default function Providers({ children }) {
  return (
    <AccountProvider>
      <CartProvider>{children}</CartProvider>
    </AccountProvider>
  );
}
