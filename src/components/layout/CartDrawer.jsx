import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, getItemPrice, total, isCartOpen, setIsCartOpen } = useCart();

  const handleCheckoutWhatsApp = () => {
    const phoneNumber = "5491100000000"; // Número comercial STOCKea
    
    let mensaje = "¡Hola STOCKea! Quiero realizar el siguiente pedido:\n\n";

    cart.forEach((item) => {
      const unitPrice = getItemPrice ? getItemPrice(item) : (item.wholesalePrice || item.retailPrice);
      const subtotal = unitPrice * item.quantity;
      mensaje += `▪ ${item.title} (x${item.quantity}) - $${unitPrice.toLocaleString('es-AR')} c/u = $${subtotal.toLocaleString('es-AR')}\n`;
    });

    mensaje += `\n*TOTAL ESTIMADO:* $${total.toLocaleString('es-AR')}\n\n`;
    mensaje += "¿Cómo coordinamos el pago y el envío a depósito?";

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      {/* Fondo oscuro con desenfoque */}
      <div 
        className="fixed inset-0 bg-stockea-graphite/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Contenedor del Drawer */}
      <div className="relative w-full max-w-md bg-stockea-surface h-full shadow-2xl flex flex-col z-10 border-l border-stockea-border">
        
        {/* Cabecera */}
        <div className="p-5 border-b border-stockea-border flex items-center justify-between bg-stockea-green text-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={20} className="text-stockea-orange" />
            <h2 className="font-display font-bold text-lg text-white">Tu Pedido</h2>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            aria-label="Cerrar pedido"
          >
            <X size={20} />
          </button>
        </div>

        {/* Lista de Artículos */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-stockea-border">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-stockea-green-soft flex items-center justify-center text-stockea-green mb-4">
                <ShoppingBag size={28} />
              </div>
              <p className="font-display font-bold text-base text-stockea-green mb-1">El carrito está vacío</p>
              <p className="text-xs text-stockea-graphite-muted max-w-xs">
                Explorá el catálogo para sumar artículos y desbloquear precios por volumen.
              </p>
            </div>
          ) : (
            cart.map((item) => {
              const unitPrice = getItemPrice ? getItemPrice(item) : (item.wholesalePrice || item.retailPrice);
              const isWholesaleApplied = unitPrice < item.retailPrice;

              return (
                <div key={item.id} className="py-4 flex gap-4 items-center">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-16 h-20 object-cover rounded-md border border-stockea-border flex-shrink-0 bg-stockea-gray-light/30"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-xs text-stockea-green truncate mb-1">
                      {item.title}
                    </h4>

                    {/* Precios aplicados según escala */}
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="font-bold text-sm text-stockea-graphite">
                        ${unitPrice.toLocaleString('es-AR')}
                      </span>
                      {isWholesaleApplied && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-stockea-orange bg-stockea-orange-soft px-1.5 py-0.5 rounded">
                          Mayorista
                        </span>
                      )}
                    </div>

                    {/* Controles de Cantidad */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-stockea-border rounded-lg bg-stockea-bg">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:text-stockea-orange transition-colors"
                          aria-label="Restar unidad"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="px-2 text-xs font-bold font-mono text-stockea-graphite">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:text-stockea-orange transition-colors"
                          aria-label="Sumar unidad"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stockea-graphite-muted hover:text-stockea-alert p-1 transition-colors ml-auto"
                        aria-label="Quitar artículo"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Resumen y Finalización de Compra */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stockea-border bg-stockea-surface flex flex-col gap-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-widest text-stockea-graphite-muted font-bold">
                Total estimado
              </span>
              <span className="font-display font-extrabold text-2xl text-stockea-green">
                ${total.toLocaleString('es-AR')}
              </span>
            </div>

            <p className="text-[11px] text-stockea-graphite-muted leading-tight">
              Los precios finales y fletes se confirman directamente con el operador de depósito.
            </p>

            <button
              onClick={handleCheckoutWhatsApp}
              className="w-full py-3.5 bg-stockea-orange hover:bg-stockea-orange-hover text-white rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
            >
              Completar Pedido por WhatsApp <ArrowRight size={15} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};