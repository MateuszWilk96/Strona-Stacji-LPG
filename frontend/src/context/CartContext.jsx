import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "twoja-stacja-lpg-cart-v3";

function readCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(readCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => setCart((previous) => {
    const item = previous.find((entry) => entry.id === product.id);
    return item
      ? previous.map((entry) => entry.id === product.id ? { ...entry, qty: entry.qty + 1 } : entry)
      : [...previous, { ...product, qty: 1 }];
  });

  const updateQty = (id, qty) => setCart((previous) => qty <= 0
    ? previous.filter((entry) => entry.id !== id)
    : previous.map((entry) => entry.id === id ? { ...entry, qty } : entry));

  const clearCart = () => setCart([]);
  const total = useMemo(() => cart.reduce((sum, entry) => sum + entry.price * entry.qty, 0), [cart]);

  return <CartContext.Provider value={{ cart, addToCart, updateQty, clearCart, total }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart poza providerem");
  return context;
}
