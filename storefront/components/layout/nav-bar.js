"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "@/context/account-context";
import { useCart } from "@/context/cart-context";
import { ShoppingBag, User, Menu, X, Loader2 } from "lucide-react";

export function Navbar() {
  const { customer, isLoading } = useAccount();
  const { cart, setIsOpen } = useCart();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // UX OPTIMIZATION: Close mobile menu automatically when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Calculate total items safely
  const itemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const navLinks = [
    { name: "فروشگاه", href: "/store", prefetch: false },
    { name: "پشتیبانی", href: "/support" },
    { name: "درباره ما", href: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-xl transition-all supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* 1. Right: Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="group rounded-xl p-2 text-gray-500 hover:bg-gray-100 lg:hidden transition-colors"
            aria-label="منو"
          >
            {isMobileMenuOpen ? (
              <X size={22} className="group-hover:text-black" />
            ) : (
              <Menu size={22} className="group-hover:text-black" />
            )}
          </button>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xl font-black tracking-tight text-gray-900 transition-opacity hover:opacity-80"
          >
            <span>گیفت</span>
            <span className="text-blue-600">کارت</span>
            <span className="mt-1 text-[10px] font-bold text-gray-400 font-mono tracking-widest bg-gray-100 px-1 rounded">
              IO
            </span>
          </Link>
        </div>

        {/* 2. Center: Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                prefetch={link.prefetch}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-black text-white shadow-md shadow-gray-200"
                    : "text-gray-500 hover:bg-gray-50 hover:text-black"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* 3. Left: Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Auth Button */}
          {isLoading ? (
            <div className="flex h-10 w-24 items-center justify-center gap-2 rounded-full bg-gray-50 px-3">
              <Loader2 className="h-4 w-4 animate-spin text-gray-300" />
            </div>
          ) : customer ? (
            <Link
              href="/account/profile"
              className="group flex items-center gap-2.5 rounded-full border border-gray-200 bg-white pl-4 pr-2 py-1.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:shadow-sm"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 group-hover:bg-black group-hover:text-white transition-colors">
                <User size={14} />
              </div>
              {/* FIX: Truncate long names so layout doesn't break */}
              <span className="hidden max-w-[100px] truncate sm:inline-block">
                {customer.first_name || "حساب کاربری"}
              </span>
            </Link>
          ) : (
            <Link
              href="/account/login"
              className="hidden rounded-full px-4 py-2 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-100 sm:block"
            >
              ورود / ثبت نام
            </Link>
          )}

          {/* Cart Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-black text-white shadow-lg shadow-gray-200 transition-transform hover:scale-105 hover:bg-gray-800 active:scale-95"
            aria-label="سبد خرید"
          >
            <ShoppingBag size={18} strokeWidth={2.5} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 animate-in fade-in zoom-in items-center justify-center rounded-full border-2 border-white bg-blue-600 text-[10px] font-bold text-white shadow-sm">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 4. Mobile Menu Dropdown (Full Width with Backdrop) */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Content */}
          <div className="absolute top-full left-0 right-0 z-50 border-t border-gray-100 bg-white shadow-xl lg:hidden animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={link.prefetch}
                  className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-gray-50 text-black font-bold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-black"
                  }`}
                >
                  {link.name}
                  {pathname === link.href && (
                    <div className="h-1.5 w-1.5 rounded-full bg-black" />
                  )}
                </Link>
              ))}

              {!customer && (
                <div className="pt-2 mt-2 border-t border-gray-100">
                  <Link
                    href="/account/login"
                    className="flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 text-base font-bold text-white active:scale-95 transition-transform"
                  >
                    ورود به حساب کاربری
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
