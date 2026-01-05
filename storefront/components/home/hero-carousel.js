"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"; // Switched ArrowRight to ArrowLeft

// 🛠️ Persian Slides Configuration
const SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop", // Gaming Setup
    title: "هیجان بازی بدون توقف",
    highlight: "تحویل آنی",
    description:
      "گیفت کارت‌های استیم، پلی‌استیشن و ایکس‌باکس را در لحظه بخرید و بلافاصله کد را دریافت کنید.",
    cta: "خرید محصولات گیمینگ",
    link: "/store?category=gaming",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop", // Shopping Bags
    title: "هدیه‌ای برای تمام سلیقه‌ها",
    highlight: "انتخابی هوشمندانه",
    description:
      "از آمازون تا اسپاتیفای، بهترین هدیه دیجیتال را برای دوستان و خانواده خود پیدا کنید.",
    cta: "مشاهده همه محصولات",
    link: "/store",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=2071&auto=format&fit=crop", // Crypto / Tech
    title: "پرداخت امن با ارز دیجیتال",
    highlight: "حریم خصوصی کامل",
    description:
      "بدون نیاز به کارت بانکی، با بیت‌کوین، تتر و اتریوم خریدهای خود را به صورت ناشناس انجام دهید.",
    cta: "شروع خرید",
    link: "/store",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () =>
    setCurrent(current === SLIDES.length - 1 ? 0 : current + 1);
  const prevSlide = () =>
    setCurrent(current === 0 ? SLIDES.length - 1 : current - 1);

  return (
    <section className="relative h-[600px] w-full overflow-hidden bg-gray-900 text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${SLIDES[current].image})` }}
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        </motion.div>
      </AnimatePresence>

      {/* Content Layer */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          key={`text-${current}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-2xl"
        >
          <span className="mb-4 inline-block rounded-full bg-blue-600/20 px-4 py-1.5 text-sm font-semibold text-blue-400 backdrop-blur-md border border-blue-500/30">
            {SLIDES[current].highlight}
          </span>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl leading-tight font-sans">
            {SLIDES[current].title}
          </h1>
          <p className="mb-8 text-xl text-gray-200 leading-relaxed">
            {SLIDES[current].description}
          </p>
          <Link
            href={SLIDES[current].link}
            className="inline-flex items-center rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-blue-700 hover:scale-105 shadow-lg shadow-blue-600/40"
          >
            {SLIDES[current].cta}
            {/* Swapped ArrowRight for ArrowLeft for RTL "Forward" motion */}
            <ArrowLeft className="mr-2 h-5 w-5" />
          </Link>
        </motion.div>
      </div>

      {/* Navigation Controls */}
      {/* Moved from right-8 to left-8 for RTL mirroring */}
      <div className="absolute bottom-8 left-8 flex gap-4 z-20">
        <button
          onClick={prevSlide}
          className="rounded-full bg-white/10 p-3 hover:bg-white/20 backdrop-blur-md transition border border-white/20"
        >
          {/* In RTL, 'Previous' is usually the Right Arrow */}
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="rounded-full bg-white/10 p-3 hover:bg-white/20 backdrop-blur-md transition border border-white/20"
        >
          {/* In RTL, 'Next' is usually the Left Arrow */}
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
      </div>
    </section>
  );
}
