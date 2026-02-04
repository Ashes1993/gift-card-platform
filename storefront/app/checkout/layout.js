export const metadata = {
  title: "تسویه حساب | نکست لایسنس",
  description: "پرداخت امن و تحویل سریع گیفت کارت و محصولات دیجیتال",
  // It is best practice to hide Checkout pages from Google to prevent
  // users from landing here with an empty cart.
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({ children }) {
  return <section className="bg-white min-h-screen">{children}</section>;
}
