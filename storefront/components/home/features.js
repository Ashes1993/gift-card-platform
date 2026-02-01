"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Wallet, UserCheck } from "lucide-react";

// Animation Variants for Staggered Effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    variants={itemVariants}
    className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl border border-gray-100"
  >
    {/* Gradient Border Effect on Hover */}
    <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/0 opacity-0 transition-all duration-500 group-hover:border-blue-100 group-hover:from-blue-50/50 group-hover:to-transparent group-hover:opacity-100 rounded-2xl pointer-events-none" />

    {/* Icon Container */}
    <div className="relative z-10 mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
      <Icon className="h-7 w-7" />
    </div>

    {/* Text Content */}
    <div className="relative z-10">
      <h3 className="mb-3 text-xl font-black text-gray-900">{title}</h3>
      <p className="leading-relaxed text-gray-500 text-sm">{description}</p>
    </div>
  </motion.div>
);

export function Features() {
  return (
    <section className="relative py-24 bg-gray-50/50 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            چرا گیفت‌کارت.آیو؟
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            تفاوت ما در امنیت، کیفیت و پشتیبانی است.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Feature 1: Authenticity */}
          <FeatureCard
            icon={ShieldCheck}
            title="تضمین اصالت ۱۰۰٪"
            description="تمامی کدهای ما مستقیماً از استورهای رسمی (اپل و گوگل) تهیه می‌شوند. ما اصالت و قانونی بودن تک‌تک کدها را تضمین می‌کنیم تا بدون نگرانی از مسدود شدن اکانت استفاده کنید."
          />

          {/* Feature 2: Manual/Secure Delivery */}
          <FeatureCard
            icon={UserCheck}
            title="بررسی دقیق و ارسال"
            description="برای امنیت بیشتر، سفارش‌ها پس از بررسی توسط کارشناسان پردازش می‌شوند. کد گیفت کارت در کوتاه‌ترین زمان ممکن (معمولاً زیر ۳۰ دقیقه در ساعات کاری) به ایمیل شما ارسال می‌شود."
          />

          {/* Feature 3: Crypto Payment */}
          <FeatureCard
            icon={Wallet}
            title="پرداخت ریالی و کریپتو"
            description="علاوه بر پرداخت با کارت‌های بانکی عضو شتاب، امکان پرداخت امن و ناشناس با ارزهای دیجیتال (تتر و بیت‌کوین) را نیز فراهم کرده‌ایم."
          />
        </motion.div>
      </div>
    </section>
  );
}
