import { ShieldCheck, Zap, Headset, Users } from "lucide-react";

export const metadata = {
  title: "درباره ما | نکست لایسنس",
  description:
    "با ما بیشتر آشنا شوید - مرجع تخصصی خرید و فروش امن گیفت کارت در ایران",
};

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20" dir="rtl">
      {/* --- HERO SECTION --- */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
            ما خرید گیفت کارت را <span className="text-blue-600">ساده</span>،{" "}
            <span className="text-blue-600">امن</span> و{" "}
            <span className="text-blue-600">سریع</span> کرده‌ایم.
          </h1>
          <p className="text-xl text-gray-600 leading-8">
            هدف ما حذف واسطه‌ها و نگرانی‌هاست. جایی که بتوانید در کمتر از چند
            ثانیه، اعتبار جهانی را به دست آورید.
          </p>
        </div>
      </div>

      {/* --- VALUE PROPS (TRUST SIGNALS) --- */}
      <div className="max-w-6xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Speed */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              تحویل آنی و خودکار
            </h3>
            <p className="text-gray-500 leading-7">
              سیستم ما ۲۴ ساعته فعال است. بلافاصله پس از پرداخت، کد گیفت کارت به
              صورت خودکار برای شما صادر و ایمیل می‌شود. بدون معطلی.
            </p>
          </div>

          {/* Card 2: Security */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 text-green-600">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              ضمانت اصالت کد
            </h3>
            <p className="text-gray-500 leading-7">
              تمام کارت‌های ما مستقیماً از تامین‌کنندگان معتبر جهانی تهیه
              می‌شوند. ما اصالت و کارکرد صحیح هر کد را ۱۰۰٪ تضمین می‌کنیم.
            </p>
          </div>

          {/* Card 3: Support */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 text-purple-600">
              <Headset size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              پشتیبانی متعهد
            </h3>
            <p className="text-gray-500 leading-7">
              تیم پشتیبانی ما همیشه آماده پاسخگویی است. اگر مشکلی در فعال‌سازی
              داشتید، تا لحظه حل مشکل در کنار شما هستیم.
            </p>
          </div>
        </div>
      </div>

      {/* --- MAIN STORY SECTION --- */}
      <div className="max-w-4xl mx-auto px-6 mt-24">
        <div className="prose prose-lg prose-blue max-w-none text-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">داستان ما</h2>
          <p className="mb-6">
            در دنیای امروز، دسترسی به سرویس‌های جهانی مثل اسپاتیفای، پلی‌استیشن
            یا خرید از آمازون برای کاربران ایرانی همیشه با چالش‌هایی همراه بوده
            است. از نگرانی درباره کارت‌های تقلبی گرفته تا تاخیر در ارسال کدها.
          </p>
          <p className="mb-6">
            ما این پلتفرم را ساختیم تا این فاصله را از بین ببریم. ما باور داریم
            که <strong>دسترسی به تکنولوژی و سرگرمی حق همه است.</strong>
          </p>
          <p>
            تیم ما متشکل از متخصصین وب و تجارت الکترونیک است که با استفاده از
            جدیدترین تکنولوژی‌ها (مثل سیستم احراز هویت پیشرفته و تحویل خودکار)،
            فضایی امن را برای تبادل دارایی‌های دیجیتال شما فراهم کرده‌اند.
          </p>
        </div>
      </div>

      {/* --- STATS (OPTIONAL - Builds Credibility) --- */}
      <div className="max-w-4xl mx-auto px-6 mt-20 border-t border-gray-200 pt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-black text-gray-900 mb-1">
              +۱۰,۰۰۰
            </div>
            <div className="text-sm text-gray-500">سفارش موفق</div>
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900 mb-1">۲۴/۷</div>
            <div className="text-sm text-gray-500">پشتیبانی فعال</div>
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900 mb-1">%۱۰۰</div>
            <div className="text-sm text-gray-500">رضایت مشتریان</div>
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900 mb-1">آنی</div>
            <div className="text-sm text-gray-500">زمان تحویل</div>
          </div>
        </div>
      </div>
    </div>
  );
}
