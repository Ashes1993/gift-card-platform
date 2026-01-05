"use client";

import { motion } from "framer-motion";
import { Search, CreditCard, Mail } from "lucide-react";

// 🛠️ Persian Steps Configuration
const steps = [
  {
    icon: Search,
    title: "۱. انتخاب گیفت کارت", // 1. Choose Gift Card
    desc: "از میان صدها گیفت کارت معتبر (اپل، گوگل پلی، و ...)، محصول مورد نظر خود را انتخاب کنید.",
  },
  {
    icon: CreditCard,
    title: "۲. پرداخت امن", // 2. Secure Payment
    desc: "هزینه را به صورت ریالی (کارت‌های شتاب) یا با ارز دیجیتال (تتر/بیت‌کوین) پرداخت کنید.",
  },
  {
    icon: Mail,
    title: "۳. تحویل آنی", // 3. Instant Delivery
    desc: "کد گیفت کارت بلافاصله پس از پرداخت به ایمیل شما ارسال و در پنل کاربری نمایش داده می‌شود.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            مراحل خرید
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            گیفت کارت خود را در ۳ مرحله ساده دریافت کنید.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop Only) */}
          {/* In RTL, left/right positioning works the same for a centered line, connecting the rightmost to leftmost items */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-100 -z-10" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 border-4 border-white shadow-lg mb-6">
                <step.icon className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-500 max-w-xs leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
