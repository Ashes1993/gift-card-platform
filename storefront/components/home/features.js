"use client";

import { motion } from "framer-motion";
import { Gift, Zap, ShieldCheck } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ delay: delay, duration: 0.5 }}
    className="rounded-xl border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg hover:border-blue-200"
  >
    {/* Icon Container: Centered */}
    <div className="flex justify-center mb-4">
      <div className="p-3 bg-blue-50 rounded-full">
        <Icon className="h-8 w-8 text-blue-600" />
      </div>
    </div>

    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
      {title}
    </h3>
    <p className="text-gray-600 text-center leading-relaxed">{description}</p>
  </motion.div>
);

export function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tighter text-gray-900 text-center mb-12">
          چرا ما را انتخاب کنید؟
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Zap}
            title="تحویل آنی و خودکار"
            description="کد گیفت کارت بلافاصله پس از پرداخت، بدون دخالت نیروی انسانی و در تمام ساعات شبانه‌روز به ایمیل شما ارسال می‌شود."
            delay={0.1}
          />
          <FeatureCard
            icon={ShieldCheck}
            title="تضمین اصالت و امنیت"
            description="تمامی کدها اورجینال و قانونی هستند. ما امنیت تراکنش‌ها و سلامت کدها را تضمین می‌کنیم تا خریدی آسوده داشته باشید."
            delay={0.2}
          />
          <FeatureCard
            icon={Gift}
            title="تنوع بی‌نظیر محصولات"
            description="از گیفت کارت‌های گوگل پلی و اپل تا اشتراک‌های اسپاتیفای و نتفلیکس؛ هر آنچه برای دنیای دیجیتال نیاز دارید اینجا پیدا می‌کنید."
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
}
