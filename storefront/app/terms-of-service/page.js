export const metadata = {
  title: "قوانین و مقررات | NextLicense",
  description: "قوانین خرید و استفاده از خدمات نکست لایسنس",
};

export default function TermsPage() {
  return (
    <div
      className="min-h-screen bg-neutral-950 text-neutral-200 py-12 px-4"
      dir="rtl"
    >
      <div className="max-w-3xl mx-auto bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 shadow-xl backdrop-blur-md">
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-neutral-800 pb-4">
          قوانین و مقررات استفاده
        </h1>

        <div className="space-y-6 text-sm leading-8 text-neutral-300">
          <p>
            کاربر گرامی، استفاده از خدمات وب‌سایت «نکست لایسنس» به معنای آگاه
            بودن و پذیرفتن شرایط و قوانین زیر است.
          </p>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">
              ۱. قوانین عمومی
            </h2>
            <p>
              تمامی اصول و رویه‌های سرویس‌های ما منطبق با قوانین جمهوری اسلامی
              ایران، قانون تجارت الکترونیک و قانون حمایت از حقوق مصرف‌کننده است.
              کاربر نیز موظف به رعایت قوانین مرتبط با کاربر است.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">
              ۲. ماهیت محصولات دیجیتال
            </h2>
            <p className="text-red-400">
              با توجه به ماهیت «دیجیتال» و «یک‌بار مصرف» بودن گیفت‌کارت‌ها و
              لایسنس‌ها، پس از تحویل کد و نمایش آن به کاربر،
              <strong>
                {" "}
                امکان پس گرفتن یا تعویض محصول به هیچ عنوان وجود ندارد.{" "}
              </strong>
              لطفاً در انتخاب ریجن (ناحیه) و نوع اکانت خود دقت فرمایید.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">
              ۳. ضمانت و گارانتی
            </h2>
            <p>
              تمامی کدها و اکانت‌ها قبل از ارسال تست می‌شوند. با این حال، در
              صورت بروز هرگونه مشکل (مانند ارور در هنگام ردیم)، کاربر موظف است
              حداکثر تا
              <span className="text-yellow-400 font-bold mx-1">[24 ساعت]</span>
              پس از خرید، موضوع را از طریق تیکت پشتیبانی اطلاع دهد. پس از گذشت
              این زمان، فروشگاه مسئولیتی در قبال محصول نخواهد داشت.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">۴. احراز هویت</h2>
            <p>
              به منظور جلوگیری از سوءاستفاده‌های مالی و فیشینگ، فروشگاه ممکن است
              برای سفارش‌های با مبالغ بالا، از کاربر درخواست احراز هویت (ارسال
              تصویر کارت ملی و کارت بانکی) نماید. در صورت عدم همکاری کاربر،
              سفارش لغو و وجه به حساب مبدا عودت داده می‌شود.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">
              ۵. زمان تحویل سفارشات
            </h2>
            <ul className="list-disc list-inside space-y-1 mr-4">
              <li>
                <strong>تحویل آنی:</strong> محصولاتی که به صورت کد هستند،
                بلافاصله پس از پرداخت نمایش داده می‌شوند.
              </li>
              <li>
                <strong>تحویل زمان‌بر:</strong> فعال‌سازی اکانت‌های پرمیوم
                (مانند اسپاتیفای) ممکن است بین ۱ تا ۲۴ ساعت زمان ببرد.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
