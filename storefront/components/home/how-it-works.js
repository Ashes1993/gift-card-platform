"use client";

import { motion } from "framer-motion";
import { MousePointerClick, CreditCard, Gift } from "lucide-react";

// 🛠️ Persian Steps Configuration
const steps = [
  {
    icon: MousePointerClick, // Changed from Search to Click (more action-oriented)
    title: "۱. انتخاب محصول",
    desc: "گیفت کارت مورد نظر خود را از بین محصولات اپل و گوگل پلی انتخاب کنید.",
  },
  {
    icon: CreditCard,
    title: "۲. پرداخت امن",
    desc: "هزینه سفارش را با کارت بانکی (شتاب) یا ارز دیجیتال (تتر/بیت‌کوین) پرداخت کنید.",
  },
  {
    icon: Gift,
    title: "۳. تحویل سریع",
    desc: "کد گیفت کارت پس از پرداخت و بررسی سفارش در اسرع وقت به ایمیل شما ارسال و در پنل نمایش داده می‌شود.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* Background Decor (Optional subtle pattern) */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              چطور خرید کنیم؟
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              ساده‌تر از چیزی که فکرش را می‌کنید.
            </p>
          </motion.div>
        </div>

        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Connector Line (Desktop Only) */}
          {/* RTL Note: The line connects elements. A centered dashed line works perfectly for both RTL/LTR visual flow */}
          <div className="absolute left-0 right-0 top-12 hidden h-0.5 w-full -translate-y-1/2 md:block">
            <div className="h-full w-full border-t-2 border-dashed border-gray-200" />
          </div>

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.5 }}
              className="group relative flex flex-col items-center text-center"
            >
              {/* Icon Circle */}
              <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-lg shadow-gray-200 ring-1 ring-gray-100 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-50 to-purple-50 opacity-50 transition-opacity group-hover:opacity-100" />
                <step.icon className="relative h-10 w-10 text-gray-700 transition-colors group-hover:text-blue-600" />

                {/* Number Badge */}
                <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white shadow-md">
                  {idx + 1}
                </span>
              </div>

              {/* Text Content */}
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                {step.title}
              </h3>
              <p className="max-w-xs text-sm leading-7 text-gray-500">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
