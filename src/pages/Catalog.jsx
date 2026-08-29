import { useState, useEffect, useMemo } from 'react';
import { Loader2, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/stock/ProductCard';

export const Catalog = () => {
  const { products, loading } = useProducts();
  const [activeCategory, setActiveCategory] = useState('all');

  // ── ESTADOS DEL PAGINADO ──
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Si cambian de categoría, volvemos a la página 1 automáticamente
  useEffect(() => setCurrentPage(1), [activeCategory]);

  const categories = useMemo(() => ['all', ...new Set(products.map(p => p.category).filter(Boolean))], [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  // ── LÓGICA DE PAGINADO (6 Mobile / 8 Desktop) ──
  const itemsPerPage = isMobile ? 6 : 8;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Subir suavemente al cambiar de página[cite: 2]
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-stockea-text-muted bg-stockea-bg">
        <Loader2 className="animate-spin mb-4 text-stockea-cta" size={40} />
        <p className="font-display text-lg tracking-wide">Cargando colección...</p>
      </div>
    );
  }

  return (
    <div className="bg-stockea-bg min-h-screen pt-10 pb-24 selection:bg-stockea-cta selection:text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* ── ENCABEZADO ── */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-stockea-navy-950 mb-5 tracking-tight">
            Catálogo Completo
          </h1>
          <p className="text-stockea-text-muted text-sm max-w-xl mx-auto leading-relaxed">
            Explorá todo nuestro stock. Los precios mayoristas se aplican automáticamente al sumar las cantidades requeridas a tu selección.
          </p>
        </div>

        {/* ── BARRA DE CATEGORÍAS (Sticky) ── */}
        <div className="sticky top-[72px] z-30 bg-stockea-bg/95 backdrop-blur-md py-4 mb-10 border-b border-stockea-border shadow-sm">
          <div className="flex gap-2.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-pill border transition-all duration-300 flex-shrink-0 ${
                  activeCategory === cat
                    ? 'bg-stockea-navy-950 text-white border-stockea-navy-950 shadow-md'
                    : 'bg-stockea-surface text-stockea-text-muted border-stockea-border hover:border-stockea-navy-950 hover:text-stockea-navy-950'
                }`}
              >
                {cat === 'all' ? 'Ver todo' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── ESTADO VACÍO ── */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-stockea-border rounded-card bg-stockea-surface">
            <Package size={48} strokeWidth={1} className="text-stockea-border mb-4" />
            <p className="font-display text-lg font-semibold text-stockea-navy-950 mb-1">Sin resultados</p>
            <p className="text-stockea-text-muted text-sm">No encontramos productos en esta categoría.</p>
          </div>
        ) : (
          <>
            {/* ── GRILLA DE PRODUCTOS ── */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-stockea-text-muted">
                Mostrando {currentProducts.length} de {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mb-16">
              {currentProducts.map(product => <ProductCard key={product.id} product={product} />)}
            </div>

            {/* ── CONTROLES DE PAGINADO ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8 border-t border-stockea-border pt-10">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="flex items-center gap-2 px-5 py-2.5 border-2 border-stockea-border text-stockea-navy-950 text-xs font-bold uppercase tracking-widest rounded-pill disabled:opacity-40 disabled:cursor-not-allowed hover:border-stockea-navy-950 transition-colors"
                >
                  <ChevronLeft size={16} strokeWidth={2} /> Anterior
                </button>
                
                <span className="text-[11px] uppercase tracking-widest text-stockea-text-muted font-bold bg-white px-4 py-2 rounded-pill shadow-sm border border-stockea-border">
                  {currentPage} / {totalPages}
                </span>
                
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="flex items-center gap-2 px-5 py-2.5 border-2 border-stockea-border text-stockea-navy-950 text-xs font-bold uppercase tracking-widest rounded-pill disabled:opacity-40 disabled:cursor-not-allowed hover:border-stockea-navy-950 transition-colors"
                >
                  Siguiente <ChevronRight size={16} strokeWidth={2} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};