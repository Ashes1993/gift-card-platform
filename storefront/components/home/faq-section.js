"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

// 🛠️ Persian FAQs (Updated for Manual Delivery)
const FAQS = [
  {
    question: "چه زمانی کد گیفت کارت را دریافت می‌کنم؟",
    answer:
      "برای تضمین امنیت و اصالت، تمامی سفارش‌ها توسط کارشناسان ما بررسی می‌شوند. معمولاً ارسال کد بین ۱۵ تا ۳۰ دقیقه (در ساعات کاری) زمان می‌برد. در روزهای تعطیل یا ساعات غیرکاری، این زمان ممکن است کمی بیشتر شود.",
  },
  {
    question: "آیا می‌توانم با ارز دیجیتال یا کارت شتاب پرداخت کنم؟",
    answer:
      "بله، ما هم از درگاه پرداخت ریالی (کارت‌های عضو شتاب) و هم از درگاه امن ارز دیجیتال (تتر، بیت‌کوین، اتریوم) پشتیبانی می‌کنیم. فرآیند پرداخت با کریپتو کاملاً خودکار است.",
  },
  {
    question: "آیا برای خرید نیاز به احراز هویت است؟",
    answer:
      "خیر. ما به حریم خصوصی شما احترام می‌گذاریم. تا سقف خرید مشخصی در روز، نیازی به ارسال مدارک شناسایی نیست و می‌توانید به صورت ناشناس خرید کنید.",
  },
  {
    question: "اگر کد کار نکرد چه اتفاقی می‌افتد؟",
    answer:
      "تمامی کدهای ما اورجینال هستند، اما در صورت بروز هرگونه مشکل، تیم پشتیبانی ما تاریخ دقیق استفاده از کد را از استور (اپل/گوگل) استعلام می‌گیرد. اگر مشکل از سمت ما باشد، کد جایگزین یا عودت وجه فوراً انجام می‌شود.",
  },
  {
    question: "آیا گیفت کارت‌ها محدودیت ریجن (کشور) دارند؟",
    answer:
      "بله، اکثر گیفت کارت‌ها (مانند اپل و گوگل پلی) مخصوص یک کشور خاص هستند (مثلاً آمریکا). لطفاً قبل از خرید حتماً به عنوان محصول (مثلاً «ریجن آمریکا») دقت کنید تا با اکانت شما سازگار باشد.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0); // Open first Q by default

  // SEO: Generate JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Inject SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-6">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">
            سوالات متداول
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            پاسخ به پرسش‌های رایج کاربران درباره نحوه خرید و تحویل
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                openIndex === idx
                  ? "border-blue-200 bg-blue-50/30 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                aria-expanded={openIndex === idx}
                className="flex w-full items-center justify-between p-6 text-right"
              >
                <span
                  className={`text-lg font-bold transition-colors ${
                    openIndex === idx ? "text-blue-700" : "text-gray-900"
                  }`}
                >
                  {faq.question}
                </span>
                <span className="shrink-0 mr-4">
                  {openIndex === idx ? (
                    <Minus className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-400" />
                  )}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 pt-0 text-gray-600 leading-8 text-sm sm:text-base border-t border-transparent">
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
