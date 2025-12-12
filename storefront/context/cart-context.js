"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { medusa } from "@/lib/medusa"; // Keep using medusa for stable add/retrieve

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // 1. Load Cart on Startup

  useEffect(() => {
    async function loadCart() {
      const cartId = localStorage.getItem("cart_id");

      if (cartId) {
        // Fetch existing cart
        const { cart } = await medusa.carts.retrieve(cartId).catch(() => {
          return { cart: null };
        });

        if (cart) {
          setCart(cart);
        } else {
          await createNewCart();
        }
      } else {
        await createNewCart();
      }
    }
    loadCart();
  }, []); // 2. Create a new cart if none exists

  async function createNewCart() {
    const { cart } = await medusa.carts.create();
    setCart(cart);
    localStorage.setItem("cart_id", cart.id);
  } // 3. Add Item Function (The working one)

  async function addToCart(variantId) {
    if (!cart?.id) return; // Optimistically open the cart

    setIsOpen(true);

    try {
      const { cart: updatedCart } = await medusa.carts.lineItems.create(
        cart.id,
        {
          variant_id: variantId,
          quantity: 1,
        }
      );
      setCart(updatedCart);
    } catch (e) {
      console.error("Failed to add item:", e);
    }
  } // 4. Remove Item Function (The stable fix using native fetch)

  async function removeItem(lineId) {
    if (!cart?.id) return;

    const BASE_URL =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
    const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

    try {
      // Manual fetch is necessary to handle Medusa V2 DELETE response
      const res = await fetch(
        `${BASE_URL}/store/carts/${cart.id}/line-items/${lineId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": API_KEY, // Must use the publishable key
          },
        }
      );

      const data = await res.json(); // Medusa V2 DELETE returns the updated cart in 'parent'

      const updatedCart = data.parent || data.cart;

      if (updatedCart) {
        setCart(updatedCart);
      } else {
        // Fallback: If response is weird, re-fetch the cart
        const { cart: refetchedCart } = await medusa.carts.retrieve(cart.id);
        if (refetchedCart) setCart(refetchedCart);
      }
    } catch (e) {
      console.error("Failed to remove item", e);
    }
  }

  return (
    <CartContext.Provider
      value={{ cart, setCart, isOpen, setIsOpen, addToCart, removeItem }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
