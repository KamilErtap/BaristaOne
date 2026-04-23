import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'baristaOneCart';
const TABLE_STORAGE_KEY = 'baristaOneSelectedTable';

const getInitialCart = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const getInitialTable = () => {
  try {
    const stored = localStorage.getItem(TABLE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCartState] = useState(getInitialCart);
  const [selectedTable, setSelectedTableState] = useState(getInitialTable);

  const setCart = (updater) => {
    setCartState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const setSelectedTable = (table) => {
    setSelectedTableState(table);

    if (table) {
      localStorage.setItem(TABLE_STORAGE_KEY, JSON.stringify(table));
    } else {
      localStorage.removeItem(TABLE_STORAGE_KEY);
    }
  };

  const addToCart = (item, quantity = 1) => {
    setCart((prev) => {
      const exists = prev.find((cartItem) => cartItem._id === item._id);

      if (exists) {
        return prev.map((cartItem) =>
          cartItem._id === item._id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + Number(quantity),
              }
            : cartItem
        );
      }

      return [
        ...prev,
        {
          ...item,
          quantity: Number(quantity),
        },
      ];
    });
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        totalPrice,
        totalItems,
        selectedTable,
        setSelectedTable,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);