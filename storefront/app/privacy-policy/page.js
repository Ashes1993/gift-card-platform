export const metadata = {
  title: "حریم خصوصی | NextLicense",
  description: "سیاست‌های حفظ حریم خصوصی کاربران",
};

export default function PrivacyPage() {
  return (
    <div
      className="min-h-screen bg-neutral-950 text-neutral-200 py-12 px-4"
      dir="rtl"
    >
      <div className="max-w-3xl mx-auto bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 shadow-xl backdrop-blur-md">
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-neutral-800 pb-4">
          سیاست حفظ حریم خصوصی
        </h1>

        <div className="space-y-6 text-sm leading-8 text-neutral-300">
          <p>
            نکست لایسنس متعهد می‌شود که از اطلاعات خصوصی کاربران محافظت کند و
            این اطلاعات را صرفاً برای ارائه خدمات بهتر به کار گیرد.
          </p>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">
              چه اطلاعاتی جمع‌آوری می‌کنیم؟
            </h2>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>
                شماره تلفن همراه (جهت ارسال پیامک وضعیت سفارش و ورود به حساب)
              </li>
              <li>آدرس ایمیل (جهت ارسال بک‌آپ کدها و فاکتور خرید)</li>
              <li>اطلاعات دستگاه و کوکی‌ها (جهت بهبود تجربه کاربری)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">امنیت پرداخت</h2>
            <p>
              تمامی تراکنش‌های مالی از طریق درگاه‌های امن پرداخت (مانند
              زرین‌پال) انجام می‌شود. نکست لایسنس هیچ‌گونه دسترسی به اطلاعات
              کارت بانکی، رمز دوم یا CVV2 شما ندارد و این اطلاعات هرگز در
              سرورهای ما ذخیره نمی‌شود.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">
              تماس با پشتیبانی
            </h2>
            <p>
              در صورت داشتن هرگونه سوال درباره این سیاست‌ها، می‌توانید از طریق
              ایمیل
              <span className="font-mono text-blue-400 mx-2">
                support@nextlicense.shop
              </span>
              با ما در ارتباط باشید.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
