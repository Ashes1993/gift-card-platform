import { ShieldAlert, CheckCircle2, Clock, FileWarning } from "lucide-react";

export const metadata = {
  title: "قوانین و مقررات | NextLicense",
  description: "قوانین خرید و استفاده از خدمات نکست لایسنس",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight sm:text-4xl mb-4">
            قوانین و مقررات <span className="text-blue-600">نکست لایسنس</span>
          </h1>
          <p className="text-lg text-gray-500">
            لطفاً قبل از خرید، این موارد را به دقت مطالعه کنید.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Introduction Alert */}
          <div className="bg-blue-50 p-6 border-b border-blue-100 flex gap-4 items-start">
            <ShieldAlert className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
            <p className="text-sm leading-7 text-blue-900">
              کاربر گرامی، ثبت سفارش در نکست لایسنس به معنای پذیرفتن کامل قوانین
              زیر است. تمام فعالیت‌های این سایت تابع قوانین جمهوری اسلامی ایران
              و قانون تجارت الکترونیک می‌باشد.
            </p>
          </div>

          <div className="p-8 sm:p-12 space-y-12">
            {/* Section 1: Digital Products */}
            <section className="relative">
              <div className="absolute -right-12 top-0 w-1 h-full bg-gray-100 rounded-full hidden sm:block"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                  <FileWarning className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  ماهیت محصولات دیجیتال
                </h2>
              </div>
              <p className="text-gray-600 leading-8 text-justify">
                با توجه به اینکه کدها و گیفت‌کارت‌ها محصولاتی «یک‌بار مصرف» و
                «دیجیتال» هستند،
                <span className="font-bold text-red-600 mx-1">
                  پس از نمایش کد به شما، امکان لغو سفارش یا عودت وجه وجود ندارد.
                </span>
                لطفاً قبل از خرید، از انتخاب صحیح «ریجن (کشور)» و «نوع اکانت»
                خود اطمینان حاصل کنید.
              </p>
            </section>

            {/* Section 2: Warranty */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Clock className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  مهلت تست و گارانتی
                </h2>
              </div>
              <p className="text-gray-600 leading-8 text-justify">
                تمامی کدها قبل از ارسال توسط سیستم هوشمند ما اعتبارسنجی می‌شوند.
                با این حال، در صورت بروز هرگونه مشکل (مانند ارور Invalid Code)،
                شما موظف هستید حداکثر تا
                <span className="inline-block bg-gray-100 px-2 py-0.5 rounded mx-1 font-bold text-gray-900">
                  ۲۴ ساعت
                </span>
                پس از خرید، تیکت پشتیبانی ارسال کنید. درخواست‌هایی که بعد از این
                زمان ارسال شوند، قابل پیگیری نخواهند بود.
              </p>
            </section>

            {/* Section 3: Delivery */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">زمان تحویل</h2>
              </div>
              <ul className="space-y-4 text-gray-600">
                <li className="flex gap-3 items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-2.5 shrink-0"></span>
                  <p>
                    <strong className="text-gray-900">تحویل آنی:</strong>{" "}
                    محصولاتی که برچسب «تحویل خودکار» دارند، بلافاصله پس از
                    پرداخت در پنل کاربری و ایمیل شما قابل مشاهده هستند.
                  </p>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-2.5 shrink-0"></span>
                  <p>
                    <strong className="text-gray-900">سفارشات زمان‌بر:</strong>{" "}
                    فعال‌سازی برخی سرویس‌ها (مثل اسپاتیفای پریمیوم روی ایمیل
                    شخصی) ممکن است بین ۱ تا ۱۲ ساعت کاری زمان ببرد.
                  </p>
                </li>
              </ul>
            </section>

            {/* Section 4: KYC */}
            <section className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">
                قوانین احراز هویت
              </h3>
              <p className="text-sm text-gray-500 leading-7">
                به دستور پلیس فتا و جهت جلوگیری از فیشینگ، برای خرید‌های با
                مبالغ بالا یا مشکوک، ممکن است از کاربر درخواست «احراز هویت»
                (ارسال تصویر کارت ملی و کارت بانکی) شود. در صورت عدم همکاری، وجه
                به حساب مبدا عودت داده می‌شود.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
