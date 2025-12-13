import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { AccountProvider } from "@/context/account-context"; // <--- NEW
import { CartSidebar } from "@/components/ui/cart-sidebar";
import { Navbar } from "@/components/layout/nav-bar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Gift Card Store",
  description: "Buy digital gift cards",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AccountProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <CartSidebar />
          </CartProvider>
        </AccountProvider>
      </body>
    </html>
  );
}
