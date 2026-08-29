import { ShoppingBag, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const isAvailable = product.stock === 'disponible';

  return (
    <div className="bg-stockea-surface border border-stockea-border rounded-card overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group flex flex-col h-full">
      
      {/* ── IMAGEN Y ESTADO ────────────────────────────── */}
      <div className="relative aspect-[4/5] overflow-hidden bg-stockea-navy-100 flex-shrink-0">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Overlay premium para productos agotados */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-stockea-alert border border-stockea-alert/20 bg-white px-4 py-1.5 shadow-sm rounded-pill">
              Sin stock
            </span>
          </div>
        )}
      </div>

      {/* ── CONTENIDO ──────────────────────────────────── */}
      <div className="p-4 md:p-5 flex flex-col flex-grow">
        <p className="text-[10px] uppercase tracking-widest text-stockea-text-muted mb-1.5 truncate">
          {product.category}
        </p>
        <h3 className="font-display font-semibold text-stockea-navy-950 text-base leading-snug mb-4 line-clamp-2">
          {product.title}
        </h3>

        {/* ── PRECIOS ────────────────────────────────────── */}
        <div className="mt-auto flex flex-col gap-2">
          <span className="text-xl font-bold text-stockea-navy-950">
            ${product.retailPrice.toLocaleString('es-AR')}
          </span>
          
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-stockea-navy-800 bg-stockea-cta-soft/50 border border-stockea-cta-soft px-2.5 py-1 rounded-pill w-fit">
            <Package size={12} className="text-stockea-cta" />
            <span>${product.wholesalePrice.toLocaleString('es-AR')} por {product.minWholesaleQty}+ un.</span>
          </div>
        </div>

        {/* ── BOTÓN DE ACCIÓN ────────────────────────────── */}
        <button
          onClick={() => addToCart(product)}
          disabled={!isAvailable}
          className="w-full mt-5 flex items-center justify-center gap-2 bg-stockea-navy-950 text-white py-3 text-[11px] uppercase tracking-widest font-semibold rounded-card transition-all hover:bg-stockea-cta hover:text-stockea-navy-950 disabled:bg-stockea-navy-100 disabled:text-stockea-text-muted disabled:cursor-not-allowed border border-transparent disabled:border-stockea-border"
        >
          <ShoppingBag size={14} />
          <span className="mt-[2px]">{isAvailable ? 'Añadir al pedido' : 'Agotado'}</span>
        </button>
      </div>
    </div>
  );
};