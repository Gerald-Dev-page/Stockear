import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Inicializamos el carrito leyendo el localStorage para que no se borre al recargar[cite: 2]
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('stockea_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWholesale, setIsWholesale] = useState(false); // Estado para el botón del Navbar

  // Guardamos en el navegador cada vez que el carrito cambia[cite: 2]
  useEffect(() => {
    localStorage.setItem('stockea_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));

  const updateQuantity = (id, amount) => {
    setCart((prev) => prev.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + amount;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const total = cart.reduce((acc, item) => {
    // Aplica precio mayorista si el Navbar está en "Mayorista" O si el usuario supera la cantidad mínima
    const useWholesale = isWholesale || item.quantity >= item.minWholesaleQty;
    const price = useWholesale ? item.wholesalePrice : item.retailPrice;
    return acc + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity,
      total, totalItems, isCartOpen, setIsCartOpen,
      isWholesale, setIsWholesale
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);