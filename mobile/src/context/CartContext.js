import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  const addToCart = (item, quantity = 1) => {
    const safeQuantity = Number(quantity) || 1;

    setCart((prev) => {
      const existingItem = prev.find((cartItem) => cartItem._id === item._id);

      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem._id === item._id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + safeQuantity,
              }
            : cartItem
        );
      }

      return [
        ...prev,
        {
          ...item,
          quantity: safeQuantity,
        },
      ];
    });
  };

  const increaseQuantity = (itemId) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === itemId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (itemId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === itemId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((item) => item._id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const clearSelectedTable = () => {
    setSelectedTable(null);
  };

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + (item.price || 0) * item.quantity,
      0
    );
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      selectedTable,
      setSelectedTable,
      clearSelectedTable,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [cart, selectedTable, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);