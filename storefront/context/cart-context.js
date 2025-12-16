"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { medusa } from "@/lib/medusa";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // 1. Load Cart on Startup
  useEffect(() => {
    async function loadCart() {
      const cartId = localStorage.getItem("cart_id");

      if (cartId) {
        // Fetch existing cart
        // If retrieve fails (404), catch it and return null cart
        const { cart } = await medusa.carts.retrieve(cartId).catch(() => {
          return { cart: null };
        });

        // Check if cart exists AND isn't completed
        if (cart && !cart.completed_at) {
          setCart(cart);
        } else {
          // If completed or doesn't exist, start fresh
          await createNewCart();
        }
      } else {
        await createNewCart();
      }
    }
    loadCart();
  }, []);

  // 2. Create a new cart (Updated to return the object)
  async function createNewCart() {
    const { cart } = await medusa.carts.create();
    setCart(cart);
    localStorage.setItem("cart_id", cart.id);
    return cart; // <--- Return it so we can use it immediately
  }

  // 3. Add Item Function (With "Self-Healing" Retry)
  async function addToCart(variantId) {
    // If no cart in state, try to find one or create one
    let activeCartId = cart?.id;

    if (!activeCartId) {
      const newCart = await createNewCart();
      activeCartId = newCart.id;
    }

    setIsOpen(true);

    try {
      // Attempt 1: Add to current cart
      const { cart: updatedCart } = await medusa.carts.lineItems.create(
        activeCartId,
        {
          variant_id: variantId,
          quantity: 1,
        }
      );
      setCart(updatedCart);
    } catch (e) {
      console.warn(
        "Failed to add item (Cart might be completed). Retrying with new cart..."
      );

      try {
        // Attempt 2: Dead Cart Detected. Create New & Retry.
        const freshCart = await createNewCart();

        const { cart: retryCart } = await medusa.carts.lineItems.create(
          freshCart.id,
          {
            variant_id: variantId,
            quantity: 1,
          }
        );
        setCart(retryCart);
      } catch (retryError) {
        console.error(
          "Critical: Failed to add item even to new cart.",
          retryError
        );
        alert("Could not add item. Please refresh the page.");
      }
    }
  }

  // 4. Remove Item Function (Kept your native fetch fix)
  async function removeItem(lineId) {
    if (!cart?.id) return;

    const BASE_URL =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
    const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

    try {
      const res = await fetch(
        `${BASE_URL}/store/carts/${cart.id}/line-items/${lineId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": API_KEY,
          },
        }
      );

      const data = await res.json();
      const updatedCart = data.parent || data.cart;

      if (updatedCart) {
        setCart(updatedCart);
      } else {
        const { cart: refetchedCart } = await medusa.carts.retrieve(cart.id);
        if (refetchedCart) setCart(refetchedCart);
      }
    } catch (e) {
      console.error("Failed to remove item", e);
    }
  }

  // 5. Explicit Reset Helper (Call this on Checkout Success Page)
  const resetCart = async () => {
    localStorage.removeItem("cart_id");
    setCart(null);
    await createNewCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        isOpen,
        setIsOpen,
        addToCart,
        removeItem,
        resetCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
