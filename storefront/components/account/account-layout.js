// storefront/components/account/account-layout.jsx
"use client";

import { useAccount } from "@/context/account-context";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, ShoppingBag, Headset, LogOut } from "lucide-react";

const navItems = [
  { name: "Profile", href: "/account/profile", icon: User },
  { name: "Orders", href: "/account/orders", icon: ShoppingBag },
  { name: "Support Tickets", href: "/account/support", icon: Headset },
];

export default function AccountLayout({ children, activeTab }) {
  const { logout } = useAccount();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tighter text-gray-900 mb-10">
        My Account Dashboard
      </h1>
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive =
                activeTab === item.name.toLowerCase().replace(" ", "-");
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                </motion.div>
              );
            })}

            <motion.button
              onClick={logout}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
              className="w-full text-left flex items-center p-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-4"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Log Out
            </motion.button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-grow bg-white p-8 border border-gray-100 rounded-xl shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
