import { ShoppingBag, Package } from 'lucide-react';
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
    <div className="group flex flex-col h-full bg-stockea-surface border border-stockea-border shadow-card hover:shadow-card-hover transition-all duration-300 rounded-card overflow-hidden">

      {/* ── CONTENEDOR DE IMAGEN ── */}
      <div className="relative aspect-[4/5] bg-stockea-navy-100 overflow-hidden flex-shrink-0">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Overlay Agotado (Efecto Vidrio Premium) */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10 transition-opacity">
            <span className="text-[10px] uppercase tracking-widest font-bold text-stockea-alert border border-stockea-alert/20 bg-white px-4 py-1.5 shadow-sm rounded-pill">
              Agotado
            </span>
          </div>
        )}

        {/* Badge Poco Stock */}
        {isLowStock && isAvailable && (
          <span className="absolute top-3 left-3 bg-stockea-alert/90 backdrop-blur-md text-white text-[9px] uppercase tracking-widest px-2.5 py-1 font-bold rounded-pill shadow-sm z-10">
            Últimas unidades
          </span>
        )}
      </div>

      {/* ── INFO DEL PRODUCTO ── */}
      <div className="p-4 md:p-5 flex flex-col flex-grow gap-1.5">
        <span className="text-[10px] uppercase tracking-widest font-semibold text-stockea-text-muted truncate">
          {product.category}
        </span>

        <h3 className="font-display text-sm md:text-base font-semibold text-stockea-navy-950 line-clamp-2 leading-snug">
          {product.title}
        </h3>

        {/* ── ZONA DE PRECIOS Y ACCIÓN ── */}
        <div className="mt-auto pt-4 flex items-end justify-between gap-3">
          
          <div className="flex flex-col gap-1.5">
            <span className="font-display font-bold text-stockea-navy-950 text-lg md:text-xl leading-none">
              ${product.retailPrice.toLocaleString('es-AR')}
            </span>
            
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-stockea-navy-800 bg-stockea-cta-soft/60 border border-stockea-cta-soft px-2 py-0.5 rounded-pill w-fit">
              <Package size={11} className="text-stockea-cta" strokeWidth={2.5} />
              <span>${product.wholesalePrice.toLocaleString('es-AR')} x {product.minWholesaleQty}+</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            aria-label="Agregar al carrito"
            className="w-11 h-11 flex-shrink-0 bg-stockea-navy-950 text-white flex items-center justify-center rounded-lg transition-all duration-300 hover:bg-stockea-cta hover:text-stockea-navy-950 hover:-translate-y-0.5 hover:shadow-md disabled:bg-stockea-navy-100 disabled:text-stockea-text-muted disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed"
          >
            <ShoppingBag size={18} strokeWidth={2} />
          </button>
          
        </div>
      </div>
    </div>
  );
};