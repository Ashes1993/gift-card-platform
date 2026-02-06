import { Lock, Eye, CreditCard, Server } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "حریم خصوصی | NextLicense",
  description: "سیاست‌های حفظ حریم خصوصی کاربران",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight sm:text-4xl mb-4">
            حریم خصوصی شما
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            ما در نکست لایسنس، اطلاعات شما را امانت می‌دانیم و از جدیدترین
            تکنولوژی‌ها برای محافظت از آن استفاده می‌کنیم.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1: Data Collection */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              چه اطلاعاتی می‌گیریم؟
            </h3>
            <p className="text-gray-500 leading-7 text-sm">
              ما فقط اطلاعاتی را ذخیره می‌کنیم که برای پردازش سفارش شما ضروری
              است:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                • شماره موبایل (برای ورود و پیگیری)
              </li>
              <li className="flex items-center gap-2">
                • ایمیل (برای ارسال کد محصول)
              </li>
              <li className="flex items-center gap-2">• تاریخچه خریدها</li>
            </ul>
          </div>

          {/* Card 2: Payment Security */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              امنیت پرداخت
            </h3>
            <p className="text-gray-500 leading-7 text-sm text-justify">
              تمامی پرداخت‌ها از طریق درگاه‌های رسمی و امن شاپرک (مانند
              زرین‌پال) انجام می‌شود.
              <span className="block mt-2 font-medium text-gray-900">
                ما هیچ‌گونه دسترسی به اطلاعات کارت بانکی، رمز دوم یا CVV2 شما
                نداریم.
              </span>
            </p>
          </div>

          {/* Card 3: Data Usage */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
              <Server className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              عدم فروش اطلاعات
            </h3>
            <p className="text-gray-500 leading-7 text-sm text-justify">
              اطلاعات شما (شماره تماس و ایمیل) کاملاً محرمانه است و تحت هیچ
              شرایطی به شرکت‌های تبلیغاتی یا شخص ثالث فروخته نخواهد شد. ما فقط
              برای اطلاع‌رسانی درباره وضعیت سفارش با شما تماس می‌گیریم.
            </p>
          </div>

          {/* Card 4: Cookies */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              کوکی‌ها و امنیت
            </h3>
            <p className="text-gray-500 leading-7 text-sm text-justify">
              وب‌سایت ما از کوکی‌ها صرفاً برای «به‌خاطر سپردن سبد خرید» و «حفظ
              وضعیت ورود شما» استفاده می‌کند. تمام ارتباطات شما با سایت از طریق
              پروتکل امن SSL (رمزنگاری شده) صورت می‌گیرد.
            </p>
          </div>
        </div>

        {/* Contact Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            سوالی دارید؟ با ما تماس بگیرید:{" "}
            <span className="text-blue-600 font-mono font-bold mx-1">
              <Link href={"/support"}>Support</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
