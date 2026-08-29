import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Store } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import logo from '../../assets/logo.png';

export const Navbar = () => {
  const { totalItems, setIsCartOpen, isWholesale, setIsWholesale } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-stockea-navy-950/95 backdrop-blur-md text-stockea-text-light border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-6">

        {/* ── LOGO Y HAMBURGUESA (MOBILE) ── */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            className="md:hidden p-1 text-white/80 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Alternar menú"
          >
            {mobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
          
          <Link to="/" className="flex items-center group">
            <img 
              src={logo} 
              alt="STOCKea Logo" 
              className="h-7 md:h-9 object-contain opacity-90 group-hover:opacity-100 transition-opacity" 
            />
          </Link>
        </div>

        {/* ── BUSCADOR (DESKTOP) ── */}
        <div className="hidden lg:flex flex-1 max-w-lg relative group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-stockea-cta transition-colors" />
          <input
            type="text"
            placeholder="Buscar productos, categorías..."
            className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-pill pl-11 pr-5 py-2.5 outline-none focus:border-stockea-cta focus:bg-white/10 transition-all placeholder:text-white/40 font-medium"
          />
        </div>

        {/* ── ACCIONES DERECHA ── */}
        <div className="flex items-center gap-5 md:gap-8 flex-shrink-0">

          {/* Toggle Mayorista/Minorista (Desktop) */}
          <div className="hidden md:flex items-center bg-stockea-navy-800 border border-white/5 rounded-pill p-1">
            <button
              onClick={() => setIsWholesale(false)}
              className={`px-5 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-pill transition-all duration-300 ${
                !isWholesale
                  ? 'bg-stockea-cta text-stockea-navy-950 shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Minorista
            </button>
            <button
              onClick={() => setIsWholesale(true)}
              className={`px-5 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-pill transition-all duration-300 flex items-center gap-1.5 ${
                isWholesale
                  ? 'bg-stockea-cta text-stockea-navy-950 shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Store size={12} strokeWidth={2} /> Mayorista
            </button>
          </div>

          {/* Icono del Carrito */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-white/80 hover:text-stockea-cta transition-colors"
            aria-label="Ver carrito"
          >
            <ShoppingBag size={22} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 w-[18px] h-[18px] bg-stockea-cta text-stockea-navy-950 text-[9px] font-bold flex items-center justify-center rounded-full shadow-sm border-2 border-stockea-navy-950">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── MENÚ MOBILE DESPLEGABLE ── */}
      <div 
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-white/10 ${
          mobileMenuOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0 border-transparent'
        }`}
      >
        <div className="px-4 py-6 bg-stockea-navy-950 flex flex-col gap-5">
          {/* Buscador Mobile */}
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-pill pl-11 pr-5 py-3 outline-none focus:border-stockea-cta transition-all placeholder:text-white/40"
            />
          </div>

          {/* Toggle Mayorista/Minorista Mobile */}
          <div className="flex bg-stockea-navy-800 border border-white/5 rounded-pill p-1">
            <button
              onClick={() => { setIsWholesale(false); setMobileMenuOpen(false); }}
              className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded-pill transition-all duration-300 ${
                !isWholesale ? 'bg-stockea-cta text-stockea-navy-950' : 'text-white/50'
              }`}
            >
              Minorista
            </button>
            <button
              onClick={() => { setIsWholesale(true); setMobileMenuOpen(false); }}
              className={`flex-1 py-2 flex justify-center items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold rounded-pill transition-all duration-300 ${
                isWholesale ? 'bg-stockea-cta text-stockea-navy-950' : 'text-white/50'
              }`}
            >
              <Store size={12} strokeWidth={2} /> Mayorista
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};