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
  }, []);

  // 2. Create a new cart if none exists
  async function createNewCart() {
    const { cart } = await medusa.carts.create();
    setCart(cart);
    localStorage.setItem("cart_id", cart.id);
  }

  // 3. Add Item Function
  async function addToCart(variantId) {
    if (!cart?.id) return;

    // Optimistically open the cart
    setIsOpen(true);

    const { cart: updatedCart } = await medusa.carts.lineItems.create(cart.id, {
      variant_id: variantId,
      quantity: 1,
    });

    setCart(updatedCart);
  }

  return (
    <CartContext.Provider
      value={{ cart, setCart, isOpen, setIsOpen, addToCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
