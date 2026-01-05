import { Vazirmatn } from "next/font/google"; // <--- 1. Import Vazirmatn
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { AccountProvider } from "@/context/account-context";
import { CartSidebar } from "@/components/ui/cart-sidebar";
import { Navbar } from "@/components/layout/nav-bar";
import { Footer } from "@/components/layout/footer";
import Providers from "@/components/global/providers";

// 2. Configure the font
const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir", // We define a CSS variable here
  display: "swap",
});

export const metadata = {
  title: "فروشگاه گیفت کارت", // Persian Title
  description: "خرید گیفت کارت‌های گوگل پلی و اپل",
};

export default function RootLayout({ children }) {
  return (
    // 3. Set Language and Direction
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} font-sans antialiased`}>
        <Providers>
          <Navbar />
          <main className="grow">{children}</main>{" "}
          {/* Fixed 'flex-grow' warning */}
          <Footer />
          <CartSidebar />
        </Providers>
      </body>
    </html>
  );
}
