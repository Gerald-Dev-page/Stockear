import { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, ZoomIn, Check, Star, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isZoomActive, setIsZoomActive] = useState(false);

  if (!isOpen || !product) return null;

  const isAvailable = product.stock !== 'agotado';

  // Cálculo en vivo del precio unitario según la cantidad elegida
  const getCurrentUnitPrice = () => {
    if (quantity >= 12 && product.wholesalePriceTier3) return product.wholesalePriceTier3;
    if (quantity >= 6 && product.wholesalePriceTier2) return product.wholesalePriceTier2;
    if (quantity >= 3 && product.wholesalePrice) return product.wholesalePrice;
    return product.retailPrice;
  };

  const currentPrice = getCurrentUnitPrice();
  const isWholesaleActive = currentPrice < product.retailPrice;

  const handleAdd = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans selection:bg-stockea-orange-soft selection:text-stockea-orange">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stockea-graphite/70 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-stockea-surface rounded-2xl shadow-2xl border border-stockea-border overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stockea-graphite flex items-center justify-center shadow-md transition-colors"
          aria-label="Cerrar modal"
        >
          <X size={18} />
        </button>

        {/* ── COLUMNA IZQUIERDA: IMAGEN CON ZOOM ── */}
        <div className="md:w-1/2 relative bg-stockea-gray-light/30 flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-stockea-border">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full max-h-[380px] md:max-h-full object-contain p-4 cursor-zoom-in transition-transform duration-300 hover:scale-105"
            onClick={() => setIsZoomActive(true)}
          />

          <button
            onClick={() => setIsZoomActive(true)}
            className="absolute bottom-3 left-3 bg-stockea-green/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-pill flex items-center gap-1.5 shadow-sm hover:bg-stockea-green"
          >
            <ZoomIn size={13} /> Ampliar foto
          </button>

          {product.isFeatured && (
            <span className="absolute top-3 left-3 bg-stockea-green text-stockea-orange p-1.5 rounded-full shadow border border-white/10">
              <Star size={13} className="fill-stockea-orange" />
            </span>
          )}
        </div>

        {/* ── COLUMNA DERECHA: INFORMACIÓN Y ACCIONES ── */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-stockea-orange block mb-1">
              {product.category}
            </span>

            <h2 className="font-display font-extrabold text-xl md:text-2xl text-stockea-green leading-snug mb-2">
              {product.title}
            </h2>

            {product.sku && (
              <p className="text-[11px] font-mono text-stockea-graphite-muted mb-3">
                SKU: {product.sku}
              </p>
            )}

            {product.description ? (
              <p className="text-xs text-stockea-graphite-muted leading-relaxed mb-4">
                {product.description}
              </p>
            ) : (
              <p className="text-xs text-stockea-graphite-muted italic mb-4">
                Artículo disponible para distribución directa minorista y mayorista.
              </p>
            )}

            {/* Escala de precios por volumen */}
            <div className="bg-stockea-green-soft/50 border border-stockea-green/10 rounded-xl p-3 mb-5">
              <span className="text-[9px] uppercase font-bold tracking-widest text-stockea-graphite-muted block mb-2">
                Escalas Comerciales Disponibles
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                <div className={`p-1.5 rounded-lg border ${quantity >= 3 && quantity < 6 ? 'bg-stockea-green text-white border-stockea-green' : 'bg-white border-stockea-border'}`}>
                  <span className="block text-[8px] font-bold uppercase opacity-80">x3 a 5 u.</span>
                  <span className="font-bold font-mono">${product.wholesalePrice?.toLocaleString('es-AR')}</span>
                </div>
                <div className={`p-1.5 rounded-lg border ${quantity >= 6 && quantity < 12 ? 'bg-stockea-green text-white border-stockea-green' : 'bg-white border-stockea-border'}`}>
                  <span className="block text-[8px] font-bold uppercase opacity-80">x6 a 11 u.</span>
                  <span className="font-bold font-mono">${product.wholesalePriceTier2?.toLocaleString('es-AR')}</span>
                </div>
                <div className={`p-1.5 rounded-lg border ${quantity >= 12 ? 'bg-stockea-orange text-white border-stockea-orange' : 'bg-white border-stockea-border text-stockea-orange'}`}>
                  <span className="block text-[8px] font-bold uppercase opacity-80">x12+ u.</span>
                  <span className="font-bold font-mono">${product.wholesalePriceTier3?.toLocaleString('es-AR')}</span>
                </div>
              </div>
            </div>

            {/* Total dinámico para la cantidad actual */}
            <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-stockea-border">
              <div>
                <span className="text-xs text-stockea-graphite-muted block">Precio aplicado:</span>
                <span className="font-display font-black text-2xl text-stockea-graphite">
                  ${currentPrice.toLocaleString('es-AR')} <span className="text-xs font-normal text-stockea-graphite-muted">/u</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-stockea-graphite-muted block">Subtotal:</span>
                <span className="font-display font-black text-xl text-stockea-green">
                  ${(currentPrice * quantity).toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          </div>

          {/* Selector de cantidad y Botón CTA */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stockea-graphite-muted">
                Cantidad:
              </span>
              <div className="flex items-center border border-stockea-border rounded-lg bg-stockea-bg">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-2.5 py-1.5 text-stockea-graphite hover:text-stockea-orange transition-colors"
                >
                  <Minus size={14} />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-center bg-transparent text-sm font-bold font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-2.5 py-1.5 text-stockea-graphite hover:text-stockea-orange transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              {isWholesaleActive && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-stockea-orange bg-stockea-orange-soft px-2 py-1 rounded-pill">
                  Tarifa por Mayor
                </span>
              )}
            </div>

            <button
              onClick={handleAdd}
              disabled={!isAvailable}
              className="w-full py-3.5 bg-stockea-orange hover:bg-stockea-orange-hover text-white rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={16} /> Agregar ({quantity}) al Carrito
            </button>
          </div>

        </div>

      </div>

      {/* ── MODAL FULLSCREEN ZOOM ── */}
      {isZoomActive && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomActive(false)}
        >
          <button
            onClick={() => setIsZoomActive(false)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2"
          >
            <X size={28} />
          </button>
          <img
            src={product.image}
            alt={product.title}
            className="max-w-full max-h-full object-contain shadow-2xl transition-transform duration-300 scale-100 hover:scale-105"
          />
        </div>
      )}
    </div>
  );
};