import Link from "next/link";
import {
  Mail,
  Headset,
  BookOpen,
  Instagram,
  Send,
  Twitter,
  FileText,
  ShieldCheck,
} from "lucide-react";

export function Footer() {
  return (
    <footer
      className="w-full border-t border-gray-200 bg-gray-50 mt-24"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Column 1: Brand, Mission & Socials */}
          <div className="space-y-6">
            <Link
              href="/"
              className="flex items-center gap-1 text-2xl font-black tracking-tighter text-black"
            >
              <span>نکست</span>
              <span className="text-blue-600">لایسنس</span>
            </Link>
            <p className="text-sm leading-7 text-gray-500 text-justify">
              سریع‌ترین مرجع خرید امن گیفت کارت‌های دیجیتال گوگل پلی و اپل در
              ایران. ما امنیت خرید شما را با پشتیبانی ۲۴ ساعته تضمین می‌کنیم.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              <Link
                href="#"
                className="rounded-full bg-white p-2 text-gray-400 shadow-sm ring-1 ring-gray-200 transition hover:bg-blue-50 hover:text-blue-600"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="rounded-full bg-white p-2 text-gray-400 shadow-sm ring-1 ring-gray-200 transition hover:bg-blue-50 hover:text-blue-600"
              >
                <Send className="h-5 w-5 -ml-0.5" />{" "}
                {/* Telegram usually uses Send icon */}
              </Link>
              <Link
                href="#"
                className="rounded-full bg-white p-2 text-gray-400 shadow-sm ring-1 ring-gray-200 transition hover:bg-blue-50 hover:text-blue-600"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-6">
              دسترسی سریع
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/store"
                  className="text-sm text-gray-600 hover:text-blue-600 hover:pr-2 transition-all duration-200"
                >
                  همه محصولات
                </Link>
              </li>
              <li>
                <Link
                  href="/store?sort=popular"
                  className="text-sm text-gray-600 hover:text-blue-600 hover:pr-2 transition-all duration-200"
                >
                  پرفروش‌ترین‌ها
                </Link>
              </li>
              <li>
                <Link
                  href="/store?sort=newest"
                  className="text-sm text-gray-600 hover:text-blue-600 hover:pr-2 transition-all duration-200"
                >
                  جدیدترین گیفت‌کارت‌ها
                </Link>
              </li>
              <li>
                <Link
                  href="/account/orders"
                  className="text-sm text-gray-600 hover:text-blue-600 hover:pr-2 transition-all duration-200"
                >
                  پیگیری سفارش
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-6">
              مرکز پشتیبانی
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/support"
                  className="group flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-all"
                >
                  <Headset className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                  <span>ارسال تیکت / تماس</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="group flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-all"
                >
                  <FileText className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                  <span>قوانین و مقررات</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="group flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-all"
                >
                  <ShieldCheck className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                  <span>حریم خصوصی</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust Symbols (Enamad) */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-6">
              مجوزها و نمادها
            </h3>
            <div className="flex gap-4">
              {/* Enamad Placeholder */}
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-2 shadow-sm transition hover:shadow-md cursor-pointer">
                {/* Replace this with <img src="/enamad.png" /> later */}
                <div className="h-8 w-8 text-gray-300">★</div>
                <span className="mt-2 text-[10px] font-medium text-gray-400">
                  نماد اعتماد
                </span>
              </div>

              {/* Samandehi Placeholder (Optional but good for Iran) */}
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-2 shadow-sm transition hover:shadow-md cursor-pointer">
                <div className="h-8 w-8 text-gray-300">✓</div>
                <span className="mt-2 text-[10px] font-medium text-gray-400">
                  ساماندهی
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} نکست لایسنس. تمامی حقوق محفوظ است.
          </p>
          <div className="flex gap-6">
            {/* You can add extra bottom links here if needed */}
          </div>
        </div>
      </div>
    </footer>
  );
}
