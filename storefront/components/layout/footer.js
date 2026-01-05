import Link from "next/link";
import { Mail, Headset, BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Logo & Mission */}
          <div>
            <Link
              href="/"
              className="text-2xl font-black tracking-tighter text-black flex items-center gap-1"
            >
              <span>گیفت</span>
              <span className="text-blue-600">کارت</span>
              <span className="text-gray-400 text-sm pt-1">.IO</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">
              سریع‌ترین مرجع خرید امن گیفت کارت‌های دیجیتال گوگل پلی، اپل و
              اسپاتیفای در ایران.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">فروشگاه</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/store"
                  className="text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  همه محصولات
                </Link>
              </li>
              <li>
                <Link
                  href="/store?sort=popular"
                  className="text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  برندهای محبوب
                </Link>
              </li>
              <li>
                <Link
                  href="/store?sort=newest"
                  className="text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  جدیدترین‌ها
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">پشتیبانی</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Headset className="h-4 w-4 text-gray-400" />
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  تماس با ما
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-gray-400" />
                <Link
                  href="/faq"
                  className="text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  سوالات متداول / راهنما
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  حریم خصوصی
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Account */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">
              حساب کاربری
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/account/profile"
                  className="text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  پروفایل من
                </Link>
              </li>
              <li>
                <Link
                  href="/account/orders"
                  className="text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  پیگیری سفارش
                </Link>
              </li>
              <li>
                <Link
                  href="/account/login"
                  className="text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  ورود / ثبت نام
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} گیفت کارت. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
}
