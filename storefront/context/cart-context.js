"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { medusa } from "@/lib/medusa";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Helper to force-fetch latest cart state
  async function refreshCart(cartId) {
    if (!cartId) return;
    const { cart: freshCart } = await medusa.carts.retrieve(cartId);
    setCart(freshCart);
  }

  // 1. Load Cart on Startup
  useEffect(() => {
    async function loadCart() {
      const cartId = localStorage.getItem("cart_id");
      if (cartId) {
        await refreshCart(cartId).catch(() => createNewCart());
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

  // 3. Add Item
  async function addToCart(variantId, quantity = 1) {
    let activeCartId = cart?.id;
    if (!activeCartId) {
      const newCart = await createNewCart();
      activeCartId = newCart.id;
    }
    setIsOpen(true);
    try {
      const { cart: updatedCart } = await medusa.carts.lineItems.create(
        activeCartId,
        { variant_id: variantId, quantity: quantity },
      );
      setCart(updatedCart);
    } catch (e) {
      // Retry logic if cart expired
      const freshCart = await createNewCart();
      const { cart: retryCart } = await medusa.carts.lineItems.create(
        freshCart.id,
        { variant_id: variantId, quantity: quantity },
      );
      setCart(retryCart);
    }
  }

  // 4. Update Quantity
  async function updateItem(lineId, quantity) {
    if (!cart?.id || quantity < 1) return;
    try {
      const { cart: updatedCart } = await medusa.carts.lineItems.update(
        cart.id,
        lineId,
        { quantity },
      );
      setCart(updatedCart);
    } catch (e) {
      console.error(e);
    }
  }

  // 5. Remove Item (FIXED)
  async function removeItem(lineId) {
    if (!cart?.id) return;
    try {
      // 1. Delete the item
      await medusa.carts.lineItems.delete(cart.id, lineId);

      // 2. FIX: Force a refresh from server to ensure perfect sync
      // This prevents "deleting one deletes all" visual bugs by getting the source of truth
      await refreshCart(cart.id);
    } catch (e) {
      console.error("Failed to remove item", e);
    }
  }

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
