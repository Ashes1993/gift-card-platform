"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "@/context/account-context";
import { useCart } from "@/context/cart-context";
import { ShoppingBag, User, Menu, X, Loader2 } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { customer, isLoading } = useAccount();
  const { cart, setIsOpen } = useCart();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Calculate total items safely
  const itemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Navigation Links
  const navLinks = [
    { name: "Store", href: "/store" },
    { name: "Support", href: "/support" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* 1. Left: Logo */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link
            href="/"
            className="text-xl font-black tracking-tighter text-black transition-opacity hover:opacity-80"
          >
            GIFT<span className="text-blue-600">CARD</span>.IO
          </Link>
        </div>

        {/* 2. Center: Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-black font-semibold"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* 3. Right: Actions (Auth + Cart) */}
        <div className="flex items-center gap-4">
          {/* Auth State Handling */}
          {isLoading ? (
            // Skeleton Loader (Prevents flickering)
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5">
              <div className="h-4 w-4 animate-pulse rounded-full bg-gray-300" />
              <div className="h-3 w-16 animate-pulse rounded bg-gray-300" />
            </div>
          ) : customer ? (
            // Logged In State
            <Link
              href="/account/profile"
              className="group flex items-center gap-2 rounded-full border border-gray-100 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:text-black"
            >
              <User
                size={16}
                className="text-gray-400 transition-colors group-hover:text-black"
              />
              <span className="hidden sm:inline">
                {customer.first_name || "Account"}
              </span>
            </Link>
          ) : (
            // Logged Out State
            <Link
              href="/account/login"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              Sign In
            </Link>
          )}

          {/* Cart Button (Animated) */}
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center rounded-full bg-black p-2.5 text-white transition-transform hover:scale-105 hover:bg-gray-900 active:scale-95"
          >
            <ShoppingBag size={18} />

            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 animate-in fade-in zoom-in items-center justify-center rounded-full border-2 border-white bg-blue-600 text-[10px] font-bold text-white shadow-sm">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 4. Mobile Menu Dropdown (Clean Animation) */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden animate-in slide-in-from-top-2">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-gray-50 text-black"
                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
