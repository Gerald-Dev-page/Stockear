import { ShoppingBag, Layers, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const isAvailable = product.stock !== 'agotado';
  const isLowStock = product.stock === 'low';

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div className="group flex flex-col h-full bg-stockea-surface border border-stockea-border shadow-card hover:shadow-card-hover transition-all duration-300 rounded-card overflow-hidden relative">

      {/* ── IMAGEN ── */}
      <div className="relative aspect-[4/5] bg-stockea-navy-100 overflow-hidden flex-shrink-0">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Badge Destacado */}
        {product.isFeatured && (
          <span className="absolute top-2.5 right-2.5 bg-stockea-navy-950/85 backdrop-blur-sm text-stockea-cta p-1.5 rounded-full shadow-sm z-10">
            <Star size={12} className="fill-stockea-cta" />
          </span>
        )}

        {/* Overlay Agotado */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="text-[10px] uppercase tracking-widest font-bold text-stockea-alert border border-stockea-alert/20 bg-white px-3.5 py-1.5 shadow-sm rounded-pill">
              Agotado
            </span>
          </div>
        )}

        {/* Badge Últimas unidades */}
        {isLowStock && isAvailable && (
          <span className="absolute top-2.5 left-2.5 bg-stockea-alert/90 backdrop-blur-md text-white text-[9px] uppercase tracking-widest px-2.5 py-1 font-bold rounded-pill shadow-sm z-10">
            Últimas unidades
          </span>
        )}
      </div>

      {/* ── DATOS DEL PRODUCTO ── */}
      <div className="p-4 md:p-5 flex flex-col flex-grow gap-2">
        <span className="text-[10px] uppercase tracking-widest font-semibold text-stockea-text-muted truncate">
          {product.category}
        </span>

        <h3 className="font-display text-sm md:text-base font-semibold text-stockea-navy-950 line-clamp-2 leading-snug">
          {product.title}
        </h3>

        {/* ── ESCALA DE PRECIOS POR VOLUMEN ── */}
        <div className="mt-auto pt-3 border-t border-stockea-border/70 flex flex-col gap-2">
          
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] uppercase tracking-wider text-stockea-text-muted font-medium">Unitario:</span>
            <span className="font-display font-bold text-stockea-navy-950 text-base md:text-lg">
              ${product.retailPrice.toLocaleString('es-AR')}
            </span>
          </div>

          {/* Badges de tramos mayoristas */}
          <div className="grid grid-cols-3 gap-1 bg-stockea-navy-100/50 p-1.5 rounded-lg text-center">
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-widest text-stockea-text-muted font-bold">x3+</span>
              <span className="text-[10px] font-bold text-stockea-navy-950">${product.wholesalePrice.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex flex-col border-x border-stockea-border/80">
              <span className="text-[8px] uppercase tracking-widest text-stockea-text-muted font-bold">x6+</span>
              <span className="text-[10px] font-bold text-stockea-navy-950">${product.wholesalePriceTier2.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-widest text-stockea-cta font-bold">x12+</span>
              <span className="text-[10px] font-bold text-stockea-cta">${product.wholesalePriceTier3.toLocaleString('es-AR')}</span>
            </div>
          </div>

          {/* Botón de compra */}
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className="w-full mt-1 py-2.5 bg-stockea-navy-950 text-white rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-stockea-cta hover:text-stockea-navy-950 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <ShoppingBag size={14} /> Añadir al Carrito
          </button>
        </div>

      </div>
    </div>
  );
};