import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    total,
    isCartOpen,
    setIsCartOpen,
    isWholesale
  } = useCart();

  const phoneNumber = "5491100000000";

  const handleCheckout = () => {
    let message = "Hola STOCKea! Quiero realizar el siguiente pedido:\n\n";

    cart.forEach(item => {
      const appliedPrice = (isWholesale || item.quantity >= item.minWholesaleQty)
        ? item.wholesalePrice
        : item.retailPrice;

      message += `▫️ ${item.quantity}x ${item.title} — $${(appliedPrice * item.quantity).toLocaleString('es-AR')}\n`;
    });

    message += `\n*Total estimado: $${total.toLocaleString('es-AR')}*\n\n¡Gracias!`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      {/* ── OVERLAY OSCURO ────────────────────────────────── */}
      <div
        className={`fixed inset-0 bg-stockea-navy-950/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* ── PANEL LATERAL ─────────────────────────────────── */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-stockea-surface shadow-2xl z-50 flex flex-col transition-transform duration-500 ease-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stockea-border bg-stockea-surface flex-shrink-0">
          <div className="flex items-center gap-3 text-stockea-navy-950">
            <ShoppingBag size={20} strokeWidth={1.5} />
            <h2 className="font-display font-semibold text-lg tracking-tight">Tu Selección</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-stockea-text-muted hover:text-stockea-navy-950 hover:bg-stockea-navy-100 transition-colors rounded-full"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-5">
              <div className="w-20 h-20 bg-stockea-navy-100 rounded-full flex items-center justify-center text-stockea-navy-600 mb-2">
                <ShoppingBag size={32} strokeWidth={1} />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-stockea-navy-950 mb-1">Tu carrito está vacío</p>
                <p className="text-sm text-stockea-text-muted">Explorá el catálogo para sumar productos.</p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 border-2 border-stockea-border px-8 py-3 text-[11px] uppercase tracking-widest font-semibold text-stockea-navy-950 hover:border-stockea-navy-950 transition-colors rounded-card"
              >
                Volver al catálogo
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              {cart.map(item => {
                const appliedPrice = (isWholesale || item.quantity >= item.minWholesaleQty) ? item.wholesalePrice : item.retailPrice;

                return (
                  <div key={item.id} className="flex gap-4 py-6 border-b border-stockea-border border-dashed last:border-none">
                    {/* Imagen del producto */}
                    <div className="w-20 md:w-24 aspect-[4/5] flex-shrink-0 bg-stockea-navy-100 rounded-sm overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Detalles del producto */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm font-semibold text-stockea-navy-950 line-clamp-2 leading-snug">
                            {item.title}
                          </h3>
                          <button 
                            onClick={() => removeFromCart(item.id)} 
                            className="text-stockea-text-muted hover:text-stockea-alert transition-colors p-1"
                          >
                            <Trash2 size={15} strokeWidth={1.5} />
                          </button>
                        </div>
                        <p className="font-bold text-stockea-navy-950 mt-1">
                          ${appliedPrice.toLocaleString('es-AR')}
                        </p>
                      </div>

                      {/* Controles de Cantidad y Badges */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-stockea-border rounded-pill overflow-hidden bg-stockea-surface">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)} 
                            className="px-3 py-1.5 text-stockea-text-muted hover:bg-stockea-navy-100 hover:text-stockea-navy-950 transition-colors"
                          >
                            <Minus size={12} strokeWidth={2} />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold text-stockea-navy-950">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)} 
                            className="px-3 py-1.5 text-stockea-text-muted hover:bg-stockea-navy-100 hover:text-stockea-navy-950 transition-colors"
                          >
                            <Plus size={12} strokeWidth={2} />
                          </button>
                        </div>

                        {/* Etiqueta Mayorista Activa */}
                        {item.quantity >= item.minWholesaleQty && !isWholesale && (
                          <div className="flex items-center gap-1 bg-stockea-cta-soft/50 border border-stockea-cta-soft text-stockea-navy-800 px-2 py-1 rounded-pill">
                            <Package size={10} className="text-stockea-cta" />
                            <span className="text-[9px] uppercase tracking-widest font-bold">Mayorista</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer / Checkout */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-stockea-border bg-stockea-surface">
            <div className="flex justify-between items-end mb-6">
              <span className="text-xs font-semibold text-stockea-text-muted uppercase tracking-widest">
                Total estimado
              </span>
              <span className="font-display text-3xl font-bold text-stockea-navy-950 leading-none">
                ${total.toLocaleString('es-AR')}
              </span>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-stockea-navy-950 text-white font-bold text-[11px] uppercase tracking-widest py-4 hover:bg-[#25D366] transition-colors duration-300 rounded-card shadow-sm"
            >
              <MessageCircle size={16} strokeWidth={2} />
              Finalizar Pedido
            </button>
            <p className="text-center text-[10px] text-stockea-text-muted uppercase tracking-widest mt-4">
              Serás redirigido a WhatsApp
            </p>
          </div>
        )}
      </div>
    </>
  );
};