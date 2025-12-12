"use client";

import { useCart } from "@/context/cart-context";
// import { X } from "lucide-react" // Optional icon

export function CartSidebar() {
  const { cart, isOpen, setIsOpen, removeItem } = useCart();

  if (!isOpen) return null;

  // Safely get currency code from the cart region
  const currencyCode = cart?.region?.currency_code?.toUpperCase() || "EUR";
  const itemCount = cart?.items?.length || 0;

  return (
    <div className="relative z-50">
      {/* 1. Dark Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* 2. Sliding Panel */}
      <div className="fixed inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">
            Shopping Cart ({itemCount})
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-md p-2 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close panel</span>
            {/* Simple X icon */}
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-6">
            {cart?.items?.map((item) => (
              <li key={item.id} className="flex py-2">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={
                      item.thumbnail || "https://dummyimage.com/100x100/eee/aaa"
                    }
                    alt={item.title}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>{item.title}</h3>
                      {/* FIX: Use the global currencyCode variable we defined above */}
                      <p>
                        {(item.unit_price / 100).toFixed(2)} {currencyCode}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <p className="text-gray-500">Qty {item.quantity}</p>

                    <div className="flex">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="font-medium text-red-600 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {itemCount === 0 && (
              <p className="text-center text-gray-500 mt-10">
                Your cart is empty.
              </p>
            )}
          </ul>
        </div>

        {/* Footer / Checkout Button */}
        <div className="border-t border-gray-200 px-4 py-6">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>
              {cart?.subtotal
                ? `${(cart.subtotal / 100).toFixed(2)} ${currencyCode}`
                : "0.00"}
            </p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            Shipping and taxes calculated at checkout.
          </p>
          <div className="mt-6">
            <a
              href="#"
              className="flex items-center justify-center rounded-md border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800"
            >
              Checkout
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
