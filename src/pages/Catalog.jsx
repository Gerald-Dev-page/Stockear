import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, ChevronLeft, ChevronRight, Package, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/stock/ProductCard';

export const Catalog = () => {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  // Estados de Filtros
  const [activeCategory, setActiveCategory] = useState(searchParams.get('categoria') || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  // Estados de Paginado adaptativo
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sincronizar parámetro URL si entra desde el Bento Grid
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

  // 6 artículos en celular / 8 en computadora
  const itemsPerPage = isMobile ? 6 : 8;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 120, behavior: 'smooth' });
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-stockea-text-muted bg-stockea-bg">
        <Loader2 className="animate-spin mb-4 text-stockea-cta" size={40} />
        <p className="font-display text-lg tracking-wide">Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="bg-stockea-bg min-h-screen pt-10 pb-24 selection:bg-stockea-cta selection:text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* ── HEADER ── */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-stockea-navy-950 mb-3 tracking-tight">
            Catálogo Comercial
          </h1>
          <p className="text-stockea-text-muted text-sm max-w-xl mx-auto">
            Inventario unificado. Las listas mayoristas 1, 2 y 3 se calculan dinámicamente al sumar unidades al pedido.
          </p>
        </div>

        {/* ── HERRAMIENTAS: BÚSQUEDA Y ORDENAMIENTO ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stockea-text-muted/60" />
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-stockea-surface border border-stockea-border rounded-pill pl-10 pr-4 py-2.5 text-xs text-stockea-navy-950 outline-none focus:border-stockea-navy-950 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <ArrowUpDown size={14} className="text-stockea-text-muted hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-stockea-surface border border-stockea-border rounded-pill px-4 py-2.5 text-xs text-stockea-navy-950 font-semibold outline-none focus:border-stockea-navy-950 shadow-sm cursor-pointer"
            >
              <option value="relevance">Orden: Relevancia</option>
              <option value="price-asc">Menor precio minorista</option>
              <option value="price-desc">Mayor precio minorista</option>
              <option value="wholesale-asc">Menor precio mayorista</option>
            </select>
          </div>
        </div>

        {/* ── BARRA STICKY DE CATEGORÍAS ── */}
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
                      ? 'bg-stockea-navy-950 text-white border-stockea-navy-950 shadow-sm'
                      : 'bg-stockea-surface text-stockea-text-muted border-stockea-border hover:border-stockea-navy-950 hover:text-stockea-navy-950'
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
            <p className="font-display text-base font-bold text-stockea-navy-950">No hay productos que coincidan</p>
            <p className="text-stockea-text-muted text-xs mt-1">Intentá con otros términos de búsqueda o remové la categoría activa.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stockea-text-muted">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'artículo encontrado' : 'artículos encontrados'}
              </span>
            </div>

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
                  className="flex items-center gap-1.5 px-4 py-2 border border-stockea-border text-stockea-navy-950 text-xs font-bold uppercase tracking-wider rounded-pill disabled:opacity-30 disabled:cursor-not-allowed hover:border-stockea-navy-950 bg-white shadow-sm transition-all"
                >
                  <ChevronLeft size={14} /> Anterior
                </button>

                <span className="text-[11px] font-mono font-bold text-stockea-navy-950 bg-stockea-surface border border-stockea-border px-3.5 py-1.5 rounded-pill shadow-sm">
                  {currentPage} / {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-stockea-border text-stockea-navy-950 text-xs font-bold uppercase tracking-wider rounded-pill disabled:opacity-30 disabled:cursor-not-allowed hover:border-stockea-navy-950 bg-white shadow-sm transition-all"
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