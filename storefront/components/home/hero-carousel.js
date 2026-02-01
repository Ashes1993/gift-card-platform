"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShieldCheck, Smartphone, Zap } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    image: "/slides/slider-apple.avif",
    title: "دنیای بی‌پایان اپل",
    highlight: "گیفت کارت آیتونز",
    description:
      "دسترسی نامحدود به اپ استور، اپل موزیک و هزاران بازی و برنامه. تحویل آنی کد اورجینال آمریکا.",
    cta: "خرید گیفت کارت اپل",
    link: "/store",
    icon: <Smartphone className="mb-4 h-10 w-10 text-blue-400" />,
    color: "from-blue-600 to-purple-600",
  },
  {
    id: 2,
    image: "/slides/slider-google.jpg",
    title: "هیجان بازی در اندروید",
    highlight: "گیفت کارت گوگل پلی",
    description:
      "خرید اعتبار گوگل پلی برای کلش آف کلنز، پابجی و هزاران بازی دیگر. بدون تاریخ انقضا.",
    cta: "خرید گیفت کارت گوگل",
    link: "/store",
    icon: <Zap className="mb-4 h-10 w-10 text-green-400" />,
    color: "from-green-600 to-teal-600",
  },
  {
    id: 3,
    image: "/slides/slider-crypto.avif",
    title: "پرداخت امن با کریپتو",
    highlight: "حریم خصوصی کامل",
    description:
      "بدون نیاز به کارت بانکی یا احراز هویت پیچیده. با تتر و بیت‌کوین خریدهای خود را ناشناس انجام دهید.",
    cta: "مشاهده فروشگاه",
    link: "/store",
    icon: <ShieldCheck className="mb-4 h-10 w-10 text-yellow-400" />,
    color: "from-orange-500 to-yellow-500",
  },
];

const SWIPE_CONFIDENCE_THRESHOLD = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  // Track if we are currently dragging to pause auto-slide
  const [isDragging, setIsDragging] = useState(false);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  }, []);

  // Auto-slide logic
  useEffect(() => {
    resetTimeout();
    if (!isDragging) {
      timeoutRef.current = setTimeout(nextSlide, 6000);
    }
    return () => resetTimeout();
  }, [current, isDragging, nextSlide]);

  return (
    <section
      className="relative h-[500px] w-full overflow-hidden bg-gray-950 text-white sm:h-[90vh] select-none"
      onMouseEnter={resetTimeout}
      onMouseLeave={() => !isDragging && resetTimeout()}
    >
      {/* WRAPPER: The entire area is draggable. 
         drag="x" enables horizontal dragging.
         dragConstraints={{ left: 0, right: 0 }} makes it snap back (elastic feel).
      */}
      <motion.div
        className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(e, { offset, velocity }) => {
          setIsDragging(false);
          const swipe = swipePower(offset.x, velocity.x);

          // RTL Logic:
          // Dragging Left (Negative X) -> Next Slide
          // Dragging Right (Positive X) -> Prev Slide
          if (swipe < -SWIPE_CONFIDENCE_THRESHOLD) {
            nextSlide();
          } else if (swipe > SWIPE_CONFIDENCE_THRESHOLD) {
            prevSlide();
          }
        }}
      >
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-in-out pointer-events-none ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              // FIX 1: draggable={false} prevents the browser from trying to save the image
              draggable={false}
              className="object-cover brightness-[0.35] will-change-transform"
              sizes="100vw"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-90" />
          </div>
        ))}

        {/* Content Layer - Pointer Events Auto needed for buttons */}
        <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 sm:px-8 lg:px-12 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${current}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-2">
                {SLIDES[current].icon}
                <span
                  className={`mb-4 inline-block rounded-full bg-gradient-to-r ${SLIDES[current].color} bg-clip-text text-sm font-bold text-transparent`}
                >
                  — {SLIDES[current].highlight}
                </span>
              </div>

              <h1 className="mb-6 text-4xl font-black tracking-tight sm:text-6xl md:text-7xl leading-[1.1]">
                {SLIDES[current].title}
              </h1>

              <p className="mb-10 max-w-xl text-lg text-gray-300 leading-8 sm:text-xl">
                {SLIDES[current].description}
              </p>

              {/* FIX 2: The Button needs pointer-events-auto because the parent has pointer-events-none.
                  onPointerDown stopPropagation ensures clicking the button doesn't start a drag.
              */}
              <div className="pointer-events-auto inline-block">
                <Link
                  href={SLIDES[current].link}
                  className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-bold text-black transition-all hover:scale-105 hover:bg-gray-100 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {SLIDES[current].cta}
                  <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Slide Indicators (Dots) - Must be outside the draggable container to work reliably */}
      <div className="absolute bottom-10 right-6 flex gap-2 z-30 sm:right-12">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current
                ? "w-8 bg-white"
                : "w-2 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
