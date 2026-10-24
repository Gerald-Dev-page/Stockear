import { useState } from 'react';
import { ShoppingBag, Star, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { ProductDetailModal } from './ProductDetailModal';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const isAvailable = product.stock !== 'agotado';
  const isLowStock = product.stock === 'low';

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <>
      <div 
        onClick={() => setIsDetailOpen(true)}
        className="group flex flex-col h-full bg-stockea-surface border border-stockea-border shadow-card hover:shadow-card-hover transition-all duration-300 rounded-card overflow-hidden relative font-sans cursor-pointer"
      >
        {/* ── IMAGEN ── */}
        <div className="relative aspect-[4/5] bg-stockea-gray-light/30 overflow-hidden flex-shrink-0">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Overlay Hover "Ver detalle" */}
          <div className="absolute inset-0 bg-stockea-green/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white/95 text-stockea-green font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-pill shadow flex items-center gap-1.5">
              <Eye size={12} /> Ver Ficha
            </span>
          </div>

          {/* Badge Destacado */}
          {product.isFeatured && (
            <span className="absolute top-2.5 right-2.5 bg-stockea-green text-stockea-orange p-1.5 rounded-full shadow-sm z-10 border border-white/10">
              <Star size={13} className="fill-stockea-orange" />
            </span>
          )}

          {/* Overlay Agotado */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] flex items-center justify-center z-10">
              <span className="text-[10px] uppercase font-sans tracking-widest font-bold text-stockea-alert border border-stockea-alert/20 bg-white px-3.5 py-1.5 rounded-pill shadow-sm">
                Agotado
              </span>
            </div>
          )}

          {/* Badge Últimas unidades */}
          {isLowStock && isAvailable && (
            <span className="absolute top-2.5 left-2.5 bg-stockea-orange text-white text-[9px] uppercase font-sans tracking-widest px-2.5 py-1 font-bold rounded-pill shadow-sm z-10">
              Últimas unidades
            </span>
          )}
        </div>

        {/* ── INFORMACIÓN DEL PRODUCTO ── */}
        <div className="p-4 md:p-5 flex flex-col flex-grow gap-2">
          <span className="text-[10px] font-sans uppercase tracking-[0.15em] font-medium text-stockea-graphite-muted truncate">
            {product.category}
          </span>

          <h3 className="font-display font-bold text-sm md:text-base text-stockea-green line-clamp-2 leading-snug group-hover:text-stockea-orange transition-colors">
            {product.title}
          </h3>

          {/* ── PRECIOS ESCALONADOS ── */}
          <div className="mt-auto pt-3 border-t border-stockea-border/70 flex flex-col gap-2.5">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] uppercase tracking-wider text-stockea-graphite-muted font-medium">
                Minorista:
              </span>
              <span className="font-display font-extrabold text-stockea-graphite text-base md:text-lg">
                ${product.retailPrice?.toLocaleString('es-AR')}
              </span>
            </div>

            {/* Badges de tramos 1, 2 y 3 */}
            <div className="grid grid-cols-3 gap-1 bg-stockea-green-soft/60 p-1.5 rounded-lg text-center border border-stockea-green/10">
              <div className="flex flex-col">
                <span className="text-[8px] uppercase tracking-widest text-stockea-graphite-muted font-bold">x3+</span>
                <span className="text-[10px] font-bold text-stockea-green">${product.wholesalePrice?.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex flex-col border-x border-stockea-green/15">
                <span className="text-[8px] uppercase tracking-widest text-stockea-graphite-muted font-bold">x6+</span>
                <span className="text-[10px] font-bold text-stockea-green">${product.wholesalePriceTier2?.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex flex-col bg-white rounded shadow-2xs">
                <span className="text-[8px] uppercase tracking-widest text-stockea-orange font-bold">x12+</span>
                <span className="text-[10px] font-extrabold text-stockea-orange">${product.wholesalePriceTier3?.toLocaleString('es-AR')}</span>
              </div>
            </div>

            {/* Botón rápido */}
            <button
              onClick={handleQuickAdd}
              disabled={!isAvailable}
              className="w-full mt-1 py-2.5 bg-stockea-orange hover:bg-stockea-orange-hover text-white rounded-lg font-sans font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
            >
              <ShoppingBag size={14} /> Añadir al Carrito
            </button>
          </div>

        </div>
      </div>

      {/* Modal Ficha Completa + Zoom */}
      <ProductDetailModal
        product={product}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
};