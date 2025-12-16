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
        const { cart } = await medusa.carts
          .retrieve(cartId)
          .catch(() => ({ cart: null }));

        if (cart && !cart.completed_at) {
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

  // 2. Create a new cart
  async function createNewCart() {
    const { cart } = await medusa.carts.create();
    setCart(cart);
    localStorage.setItem("cart_id", cart.id);
    return cart;
  }

  // 3. Add Item Function (Self-Healing)
  async function addToCart(variantId) {
    let activeCartId = cart?.id;

    if (!activeCartId) {
      const newCart = await createNewCart();
      activeCartId = newCart.id;
    }

    setIsOpen(true);

    try {
      const { cart: updatedCart } = await medusa.carts.lineItems.create(
        activeCartId,
        { variant_id: variantId, quantity: 1 }
      );
      setCart(updatedCart);
    } catch (e) {
      console.warn("Cart add failed. Retrying with new cart...");
      try {
        const freshCart = await createNewCart();
        const { cart: retryCart } = await medusa.carts.lineItems.create(
          freshCart.id,
          { variant_id: variantId, quantity: 1 }
        );
        setCart(retryCart);
      } catch (retryError) {
        alert("Could not add item. Please refresh the page.");
      }
    }
  }

  // --- 4. NEW: Update Quantity Function ---
  async function updateItem(lineId, quantity) {
    if (!cart?.id) return;

    // Optimistic UI check: Don't allow less than 1 (use remove for that)
    if (quantity < 1) return;

    try {
      const { cart: updatedCart } = await medusa.carts.lineItems.update(
        cart.id,
        lineId,
        { quantity }
      );
      setCart(updatedCart);
    } catch (e) {
      console.error("Failed to update quantity:", e);
      alert("Cannot update quantity. Likely out of stock.");
    }
  }

  // 5. Remove Item Function
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

  // 6. Reset Helper
  const resetCart = async () => {
    localStorage.removeItem("cart_id");
    setCart(null);
    await createNewCart();
  };

  return (
    <CartContext.Provider
      // Expose updateItem here
      value={{
        cart,
        setCart,
        isOpen,
        setIsOpen,
        addToCart,
        updateItem,
        removeItem,
        resetCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
