import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Store, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import logo from '../../assets/logo.png';

export const Navbar = () => {
  const { totalItems, setIsCartOpen, isWholesale, setIsWholesale } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(query.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-stockea-green text-white border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-6">

        {/* LOGO */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            className="md:hidden p-1 text-white/90 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menú"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <Link to="/" className="flex items-center bg-white/95 px-3 py-1.5 rounded-md hover:bg-white transition-colors">
            <img 
              src={logo} 
              alt="STOCKea" 
              className="h-6 md:h-7 object-contain" 
            />
          </Link>
        </div>

        {/* BUSCADOR FUNCIONAL (DESKTOP) */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-lg relative group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-stockea-orange transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por artículo, rubro o SKU (Enter)..."
            className="w-full bg-black/25 border border-white/20 text-white text-xs rounded-pill pl-11 pr-5 py-2.5 outline-none focus:border-stockea-orange focus:bg-black/40 transition-all placeholder:text-white/50"
          />
        </form>

        {/* ACCIONES */}
        <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">

          {/* Toggle Mayorista / Minorista */}
          <div className="hidden md:flex items-center bg-black/25 border border-white/15 rounded-pill p-1">
            <button
              type="button"
              onClick={() => setIsWholesale(false)}
              className={`px-4 py-1.5 text-[10px] uppercase font-bold rounded-pill transition-all ${
                !isWholesale ? 'bg-stockea-orange text-white shadow' : 'text-white/70 hover:text-white'
              }`}
            >
              Minorista
            </button>
            <button
              type="button"
              onClick={() => setIsWholesale(true)}
              className={`px-4 py-1.5 text-[10px] uppercase font-bold rounded-pill transition-all flex items-center gap-1.5 ${
                isWholesale ? 'bg-stockea-orange text-white shadow' : 'text-white/70 hover:text-white'
              }`}
            >
              <Store size={12} /> Mayorista
            </button>
          </div>

          {/* Botón Admin */}
          <Link
            to="/admin"
            className="p-2 text-white/90 hover:text-stockea-orange hover:bg-white/10 rounded-full transition-colors"
            title="Panel de Control"
          >
            <User size={20} />
          </Link>

          {/* Carrito */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-white/90 hover:text-stockea-orange hover:bg-white/10 rounded-full transition-colors"
            aria-label="Ver carrito"
          >
            <ShoppingBag size={21} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-stockea-orange text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-stockea-green">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 py-5 bg-stockea-green-dark border-b border-white/15 flex flex-col gap-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full bg-black/30 border border-white/20 text-white text-xs rounded-pill pl-10 pr-4 py-2.5 outline-none focus:border-stockea-orange"
            />
          </form>

          <div className="flex bg-black/25 border border-white/15 rounded-pill p-1">
            <button
              onClick={() => { setIsWholesale(false); setMobileMenuOpen(false); }}
              className={`flex-1 py-1.5 text-[10px] uppercase font-bold rounded-pill ${
                !isWholesale ? 'bg-stockea-orange text-white' : 'text-white/70'
              }`}
            >
              Minorista
            </button>
            <button
              onClick={() => { setIsWholesale(true); setMobileMenuOpen(false); }}
              className={`flex-1 py-1.5 text-[10px] uppercase font-bold rounded-pill flex justify-center items-center gap-1 ${
                isWholesale ? 'bg-stockea-orange text-white' : 'text-white/70'
              }`}
            >
              <Store size={12} /> Mayorista
            </button>
          </div>

          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 py-2 text-xs uppercase font-bold text-white/80 border border-white/20 rounded-pill"
          >
            <User size={14} /> Panel Administrador
          </Link>
        </div>
      )}
    </header>
  );
};