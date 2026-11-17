import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, MessageCircle, Home, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import logo from '../../assets/logo.png';

export const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();
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

  const WHATSAPP_URL = "https://wa.me/5492664885550?text=Hola%20Stockea,%20quiero%20hacer%20una%20consulta%20sobre%20los%20productos.";

  return (
    <header className="sticky top-0 z-50 w-full bg-stockea-green text-white border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-6">

        {/* LOGO Y MENÚ HAMBURGUESA (MÓVIL) */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            className="md:hidden p-1.5 text-white/90 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menú"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <Link to="/" className="flex items-center py-1 group">
            <img 
              src={logo} 
              alt="STOCKea" 
              className="h-14 md:h-16 object-contain transition-transform group-hover:scale-105" 
            />
          </Link>
        </div>

        {/* ENLACES DE NAVEGACIÓN (ESCRITORIO) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
          <Link to="/" className="text-white/90 hover:text-stockea-orange transition-colors">
            Inicio
          </Link>
          <Link to="/catalogo" className="text-white/90 hover:text-stockea-orange transition-colors">
            Productos
          </Link>
          <a 
            href={WHATSAPP_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white/90 hover:text-stockea-orange transition-colors"
          >
            Contacto
          </a>
        </nav>

        {/* BUSCADOR FUNCIONAL (DESKTOP) */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-xs relative group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-stockea-orange transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por artículo o SKU..."
            className="w-full bg-black/20 border border-white/20 text-white text-xs rounded-pill pl-11 pr-5 py-2.5 outline-none focus:border-stockea-orange focus:bg-black/35 transition-all placeholder:text-white/50 font-sans"
          />
        </form>

        {/* ACCIONES DERECHA */}
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">

          {/* Botón Admin (Discreto para el operador) */}
          <Link
            to="/admin"
            className="p-2 text-white/80 hover:text-stockea-orange hover:bg-white/10 rounded-full transition-colors"
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

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 py-6 bg-stockea-green border-t border-white/10 flex flex-col gap-4 font-sans animate-fade-in">
          
          {/* Buscador móvil */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full bg-black/25 border border-white/20 text-white text-xs rounded-pill pl-10 pr-4 py-3 outline-none focus:border-stockea-orange"
            />
          </form>

          {/* Enlaces de navegación móvil */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white/90 hover:text-stockea-orange hover:bg-white/5 rounded-xl transition-colors"
            >
              <Home size={16} className="text-stockea-orange" /> Inicio
            </Link>
            <Link
              to="/catalogo"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white/90 hover:text-stockea-orange hover:bg-white/5 rounded-xl transition-colors"
            >
              <Package size={16} className="text-stockea-orange" /> Productos
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white/90 hover:text-stockea-orange hover:bg-white/5 rounded-xl transition-colors"
            >
              <MessageCircle size={16} className="text-stockea-orange" /> Contacto
            </a>
          </div>

        </div>
      )}
    </header>
  );
};