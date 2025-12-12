import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { CartSidebar } from "@/components/ui/cart-sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Gift Card Store",
  description: "Buy digital gift cards",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {children}
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  );
}
