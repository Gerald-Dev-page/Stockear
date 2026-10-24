import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('stockea_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWholesale, setIsWholesale] = useState(false);

  useEffect(() => {
    localStorage.setItem('stockea_cart', JSON.stringify(cart));
  }, [cart]);

  // Soporta sumar 1 o una cantidad específica seleccionada desde el modal
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));

  const updateQuantity = (id, amount) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + amount;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const getItemPrice = (item) => {
    const qty = item.quantity;
    const tier3Min = item.minTier3Qty || 12;
    const tier2Min = item.minTier2Qty || 6;
    const tier1Min = item.minWholesaleQty || 3;

    if (qty >= tier3Min && item.wholesalePriceTier3) return item.wholesalePriceTier3;
    if (qty >= tier2Min && item.wholesalePriceTier2) return item.wholesalePriceTier2;
    if ((qty >= tier1Min || isWholesale) && item.wholesalePrice) return item.wholesalePrice;
    return item.retailPrice;
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const total = cart.reduce((acc, item) => {
    const unitPrice = getItemPrice(item);
    return acc + (unitPrice * item.quantity);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getItemPrice,
        total,
        totalItems,
        isCartOpen,
        setIsCartOpen,
        isWholesale,
        setIsWholesale
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);