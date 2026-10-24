import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, ChevronLeft, ChevronRight, Package, Search, ArrowUpDown } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/stock/ProductCard';

export const Catalog = () => {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  // Estados de Filtros
  const [activeCategory, setActiveCategory] = useState(searchParams.get('categoria') || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  // Paginado adaptativo (6 móvil / 8 escritorio)
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sincronizar parámetro URL si viene desde el Inicio
  useEffect(() => {
    const catQuery = searchParams.get('categoria');
    if (catQuery) {
      setActiveCategory(catQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchTerm, sortBy]);

  // Lista única de categorías
  const categories = useMemo(() => {
    return ['all', ...new Set(products.map(p => p.category).filter(Boolean))];
  }, [products]);

  // Filtrado y Ordenamiento
  const filteredProducts = useMemo(() => {
    let list = products.filter(p => {
      const matchCat = activeCategory === 'all' || 
        p.category.toLowerCase().replace(/\s+/g, '-') === activeCategory.toLowerCase() ||
        p.category.toLowerCase() === activeCategory.toLowerCase();

      const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchCat && matchSearch;
    });

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.retailPrice - b.retailPrice);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.retailPrice - a.retailPrice);
    } else if (sortBy === 'wholesale-asc') {
      list.sort((a, b) => a.wholesalePrice - b.wholesalePrice);
    }

    return list;
  }, [products, activeCategory, searchTerm, sortBy]);

  const itemsPerPage = isMobile ? 6 : 8;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    if (cat === 'all') {
      searchParams.delete('categoria');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ categoria: cat.toLowerCase().replace(/\s+/g, '-') });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-stockea-graphite-muted bg-stockea-bg font-sans">
        <Loader2 className="animate-spin mb-4 text-stockea-orange" size={40} />
        <p className="font-display font-bold text-lg text-stockea-green tracking-wide">Cargando catálogo comercial...</p>
      </div>
    );
  }

  return (
    <div className="bg-stockea-bg min-h-screen pt-10 pb-24 selection:bg-stockea-orange-soft selection:text-stockea-orange font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* ── ENCABEZADO ── */}
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase tracking-[0.25em] text-stockea-orange font-bold block mb-2">
            Inventario Central
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-stockea-green mb-3 tracking-tight">
            Catálogo Oficial
          </h1>
          <p className="text-stockea-graphite-muted text-sm max-w-xl mx-auto">
            Disponibilidad directa de depósito. Los tramos mayoristas x3, x6 y x12+ se aplican de forma automática en tu pedido.
          </p>
        </div>

        {/* ── BARRA DE BÚSQUEDA Y ORDENAMIENTO ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stockea-graphite-muted/60" />
            <input
              type="text"
              placeholder="Buscar por artículo o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-stockea-surface border border-stockea-border rounded-pill pl-10 pr-4 py-2.5 text-xs text-stockea-graphite outline-none focus:border-stockea-orange shadow-sm font-sans"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <ArrowUpDown size={14} className="text-stockea-graphite-muted hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-stockea-surface border border-stockea-border rounded-pill px-4 py-2.5 text-xs text-stockea-graphite font-semibold outline-none focus:border-stockea-orange shadow-sm cursor-pointer font-sans"
            >
              <option value="relevance">Orden: Relevancia</option>
              <option value="price-asc">Menor precio minorista</option>
              <option value="price-desc">Mayor precio minorista</option>
              <option value="wholesale-asc">Menor precio mayorista</option>
            </select>
          </div>
        </div>

        {/* ── SELECTOR STICKY DE RUBROS ── */}
        <div className="sticky top-[80px] z-30 bg-stockea-bg/95 backdrop-blur-md py-3 mb-8 border-b border-stockea-border shadow-sm">
          <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map(cat => {
              const isSelected = activeCategory === cat || 
                (activeCategory === cat.toLowerCase().replace(/\s+/g, '-'));

              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`whitespace-nowrap px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-pill border transition-all duration-200 flex-shrink-0 ${
                    isSelected
                      ? 'bg-stockea-green text-white border-stockea-green shadow-sm'
                      : 'bg-stockea-surface text-stockea-graphite-muted border-stockea-border hover:border-stockea-green hover:text-stockea-green'
                  }`}
                >
                  {cat === 'all' ? 'Ver Todo' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── LISTADO / GRILLA ── */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-stockea-border rounded-card bg-stockea-surface">
            <Package size={44} strokeWidth={1.2} className="text-stockea-border mb-3" />
            <p className="font-display text-base font-bold text-stockea-green">No encontramos productos en este criterio</p>
            <p className="text-stockea-graphite-muted text-xs mt-1">Modificá los filtros de búsqueda o elegí otra categoría.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stockea-graphite-muted">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'producto listado' : 'productos listados'}
              </span>
            </div>

            {/* 2 Columnas en móvil y 4 en escritorio */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12 mb-16">
              {currentProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* ── PAGINACIÓN ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-6 border-t border-stockea-border">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-stockea-border text-stockea-green text-xs font-bold uppercase tracking-wider rounded-pill disabled:opacity-30 disabled:cursor-not-allowed hover:border-stockea-green bg-white shadow-sm transition-all"
                >
                  <ChevronLeft size={14} /> Anterior
                </button>

                <span className="text-[11px] font-mono font-bold text-stockea-green bg-stockea-surface border border-stockea-border px-3.5 py-1.5 rounded-pill shadow-sm">
                  {currentPage} / {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-stockea-border text-stockea-green text-xs font-bold uppercase tracking-wider rounded-pill disabled:opacity-30 disabled:cursor-not-allowed hover:border-stockea-green bg-white shadow-sm transition-all"
                >
                  Siguiente <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};