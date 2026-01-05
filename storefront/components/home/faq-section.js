"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

// 🛠️ Persian FAQs
const FAQS = [
  {
    question: "آیا تحویل کدها آنی است؟",
    answer:
      "بله! سیستم ما کاملاً خودکار است. بلافاصله پس از پرداخت (چه با کارت بانکی و چه ارز دیجیتال)، کد گیفت کارت به ایمیل شما ارسال شده و همزمان در صفحه نمایش داده می‌شود.",
  },
  {
    question: "آیا می‌توانم با ارز دیجیتال یا کارت شتاب پرداخت کنم؟",
    answer:
      "بله، ما هم از درگاه پرداخت ریالی (کارت‌های عضو شتاب) و هم از درگاه امن ارز دیجیتال (تتر، بیت‌کوین، اتریوم) پشتیبانی می‌کنیم. انتخاب با شماست.",
  },
  {
    question: "آیا برای خرید نیاز به احراز هویت است؟",
    answer:
      "خیر. ما به حریم خصوصی شما احترام می‌گذاریم. برای خریدهای معمول نیازی به ارسال مدارک شناسایی نیست و می‌توانید به صورت ناشناس خرید کنید.",
  },
  {
    question: "آیا گیفت کارت‌ها محدودیت ریجن (کشور) دارند؟",
    answer:
      "بله، اکثر گیفت کارت‌ها (مانند اپل و گوگل پلی) مخصوص یک کشور خاص هستند (مثلاً آمریکا). لطفاً قبل از خرید حتماً به عنوان محصول (مثلاً «ریجن آمریکا») دقت کنید تا با اکانت شما سازگار باشد.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">سوالات متداول</h2>
          <p className="mt-2 text-gray-500">
            پاسخ به پرسش‌های رایج شما درباره خرید گیفت کارت
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg bg-white overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                // Changed text-left to text-right for RTL
                className="flex w-full items-center justify-between p-5 text-right font-medium text-gray-900 transition hover:bg-gray-50"
              >
                {faq.question}
                {openIndex === idx ? (
                  <Minus className="h-5 w-5 text-blue-600 shrink-0" />
                ) : (
                  <Plus className="h-5 w-5 text-gray-400 shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-5 pb-5 pt-0 text-gray-600 leading-relaxed text-right">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
