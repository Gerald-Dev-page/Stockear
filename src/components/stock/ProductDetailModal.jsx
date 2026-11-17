import { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, ZoomIn, Star, ShieldCheck, ListChecks, Image as ImageIcon } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Resetear la imagen seleccionada al abrir o cambiar de producto
  useEffect(() => {
    setSelectedImageIndex(0);
    setQuantity(1);
  }, [product]);

  if (!isOpen || !product) return null;

  const isAvailable = product.stock !== 'agotado';

  // Obtenemos el array de imágenes o usamos la principal por defecto
  const productImages = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product.image];

  const currentImage = productImages[selectedImageIndex] || product.image;

  // Lógica de precio mayorista automático a partir de 3 unidades
  const isWholesaleActive = quantity >= 3 && product.wholesalePrice;
  const currentPrice = isWholesaleActive ? product.wholesalePrice : product.retailPrice;

  const handleAdd = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 font-sans selection:bg-stockea-orange-soft selection:text-stockea-orange">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stockea-graphite/70 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Card Optimizado Mobile / Desktop */}
      <div className="relative w-full max-w-4xl bg-stockea-surface rounded-2xl shadow-2xl border border-stockea-border overflow-hidden z-10 flex flex-col md:flex-row max-h-[92vh] md:max-h-[90vh]">
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stockea-graphite flex items-center justify-center shadow-md transition-colors"
          aria-label="Cerrar modal"
        >
          <X size={18} />
        </button>

        {/* ── COLUMNA IZQUIERDA: GALERÍA Y FOTO CON ZOOM ── */}
        <div className="md:w-1/2 relative bg-stockea-gray-light/30 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stockea-border p-3 md:p-4 flex-shrink-0">
          <div className="relative flex-1 flex items-center justify-center overflow-hidden min-h-[200px] md:min-h-[280px]">
            <img
              src={currentImage}
              alt={product.title}
              className="w-full h-full max-h-[220px] md:max-h-[340px] object-contain cursor-zoom-in transition-transform duration-300 hover:scale-105"
              onClick={() => setIsZoomActive(true)}
            />

            <button
              onClick={() => setIsZoomActive(true)}
              className="absolute bottom-2 left-2 bg-stockea-green/90 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-pill flex items-center gap-1.5 shadow-sm hover:bg-stockea-green"
            >
              <ZoomIn size={12} /> Ampliar foto
            </button>

            {product.isFeatured && (
              <span className="absolute top-2 left-2 bg-stockea-green text-stockea-orange p-1.5 rounded-full shadow border border-white/10">
                <Star size={12} className="fill-stockea-orange" />
              </span>
            )}
          </div>

          {/* Miniaturas de la galería */}
          {productImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pt-2.5 mt-2 border-t border-stockea-border">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 bg-white transition-all ${
                    selectedImageIndex === idx ? 'border-stockea-orange shadow-sm scale-105' : 'border-stockea-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── COLUMNA DERECHA: INFORMACIÓN Y ACCIONES ── */}
        <div className="md:w-1/2 p-4 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-stockea-orange block mb-1">
              {product.category}
            </span>

            <h2 className="font-display font-extrabold text-lg md:text-2xl text-stockea-green leading-snug mb-1.5 md:mb-2">
              {product.title}
            </h2>

            {product.sku && (
              <p className="text-[10px] md:text-[11px] font-mono text-stockea-graphite-muted mb-2.5 md:mb-3">
                SKU: {product.sku}
              </p>
            )}

            {product.description ? (
              <p className="text-xs text-stockea-graphite-muted leading-relaxed mb-3">
                {product.description}
              </p>
            ) : (
              <p className="text-xs text-stockea-graphite-muted italic mb-3">
                Artículo disponible para distribución directa minorista y mayorista.
              </p>
            )}

            {/* Características técnicas / Especificaciones */}
            {product.characteristics && (
              <div className="bg-stockea-bg border border-stockea-border rounded-xl p-3 mb-3 md:mb-4">
                <div className="flex items-center gap-1.5 text-stockea-green font-bold text-xs mb-1">
                  <ListChecks size={14} className="text-stockea-orange" />
                  <span>Características Técnicas:</span>
                </div>
                <p className="text-xs text-stockea-graphite-muted whitespace-pre-line leading-relaxed">
                  {product.characteristics}
                </p>
              </div>
            )}

            {/* Aviso simple de beneficio mayorista */}
            <div className="bg-stockea-green-soft/50 border border-stockea-green/10 rounded-xl p-2.5 md:p-3 mb-3 md:mb-4 flex items-center gap-2.5 md:gap-3">
              <div className="w-7 h-7 rounded-full bg-stockea-orange-soft flex items-center justify-center text-stockea-orange flex-shrink-0">
                <ShieldCheck size={14} />
              </div>
              <div>
                <p className="text-xs font-bold text-stockea-green">Precio Mayorista Automático</p>
                <p className="text-[10px] md:text-[11px] text-stockea-graphite-muted">Llevando 3 unidades o más, accedés al precio mayorista.</p>
              </div>
            </div>

            {/* Total dinámico para la cantidad actual */}
            <div className="flex items-baseline justify-between mb-3 md:mb-4 pb-3 border-b border-stockea-border">
              <div>
                <span className="text-[11px] md:text-xs text-stockea-graphite-muted block">Precio por unidad:</span>
                <span className="font-display font-black text-xl md:text-2xl text-stockea-graphite">
                  ${currentPrice?.toLocaleString('es-AR')} <span className="text-[11px] md:text-xs font-normal text-stockea-graphite-muted">/u</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] md:text-xs text-stockea-graphite-muted block">Subtotal:</span>
                <span className="font-display font-black text-lg md:text-xl text-stockea-green">
                  ${(currentPrice * quantity).toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          </div>

          {/* Selector de cantidad y Botón CTA */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stockea-graphite-muted">
                  Cantidad:
                </span>
                <div className="flex items-center border border-stockea-border rounded-lg bg-stockea-bg">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-2.5 py-1.5 text-stockea-graphite hover:text-stockea-orange transition-colors"
                  >
                    <Minus size={13} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-10 md:w-12 text-center bg-transparent text-sm font-bold font-mono outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-2.5 py-1.5 text-stockea-graphite hover:text-stockea-orange transition-colors"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {isWholesaleActive ? (
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-white bg-stockea-orange px-2.5 py-1 rounded-pill shadow-sm">
                  Mayorista Activo
                </span>
              ) : (
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-stockea-green bg-stockea-green-soft px-2.5 py-1 rounded-pill">
                  Precio Minorista
                </span>
              )}
            </div>

            <button
              onClick={handleAdd}
              disabled={!isAvailable}
              className="w-full py-3 md:py-3.5 bg-stockea-orange hover:bg-stockea-orange-hover text-white rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={15} /> Agregar ({quantity}) al Carrito
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
            src={currentImage}
            alt={product.title}
            className="max-w-full max-h-full object-contain shadow-2xl transition-transform duration-300 scale-100 hover:scale-105"
          />
        </div>
      )}
    </div>
  );
};