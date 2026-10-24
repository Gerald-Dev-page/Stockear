import { ArrowRight, Loader2, Truck, ShieldCheck, Store, Star, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { ProductCard } from '../components/stock/ProductCard';

import videoDesktop from '../assets/video-desktop.mp4';
import videoMobile from '../assets/video-mobile.mp4';

export const Home = () => {
  const { products, loading } = useProducts();
  const { categories, loading: loadingCategories } = useCategories();

  const featuredProducts = products.filter(p => p.isFeatured === true).slice(0, 4);
  const latestProducts = products.filter(p => !p.isFeatured).slice(0, 8);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-stockea-graphite-muted bg-stockea-bg font-sans">
        <Loader2 className="animate-spin mb-4 text-stockea-orange" size={40} />
        <p className="font-display font-bold text-lg text-stockea-green">Cargando catálogo oficial...</p>
      </div>
    );
  }

  return (
    <div className="bg-stockea-bg min-h-screen font-sans selection:bg-stockea-orange-soft selection:text-stockea-orange">

      {/* HERO CON FILTRO NEUTRO (GRIS/GRAFITO PARA EVITAR EL VERDE LAVADO) */}
      <div className="bg-stockea-graphite">
        <section className="relative h-[78vh] flex flex-col justify-center overflow-hidden">
          {/* Capa de contraste neutra según manual (Grafito #202020 con degradé) */}
          <div className="absolute inset-0 bg-gradient-to-r from-stockea-graphite via-stockea-graphite/1 to-transparent z-1" />

          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover md:hidden z-0 opacity-45">
            <source src={videoMobile} type="video/mp4" />
          </video>
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover hidden md:block z-0 opacity-45">
            <source src={videoDesktop} type="video/mp4" />
          </video>

          <div className="relative z-20 px-4 md:px-12 lg:px-20 max-w-7xl w-full mx-auto">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-[2px] bg-stockea-orange"></span>
                <span className="text-stockea-orange text-[10px] md:text-xs uppercase tracking-[0.25em] font-bold">
                  Abastecimiento Mayorista & Minorista
                </span>
              </div>
              
              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl text-white mb-5 leading-[1.05] font-black tracking-tight">
                Stock para <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60">
                  seguir creciendo.
                </span>
              </h1>

              <p className="text-white/80 text-xs md:text-base max-w-lg mb-8 leading-relaxed">
                Escalas de precios por volumen automatizadas y logística directa para comerciantes y revendedores.
              </p>

              <Link
                to="/catalogo"
                className="group inline-flex items-center gap-3 bg-stockea-orange hover:bg-stockea-orange-hover text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-pill shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Explorar Catálogo Completo
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* BARRA DE BENEFICIOS */}
        <div className="relative z-30 -mt-10 px-4 max-w-7xl mx-auto w-full pb-8">
          <div className="bg-stockea-surface border border-stockea-border p-5 md:p-6 rounded-card shadow-xl flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-stockea-border">
            <div className="flex items-center gap-3 w-full md:w-1/3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-full bg-stockea-green-soft flex items-center justify-center text-stockea-green flex-shrink-0">
                <Truck size={18} />
              </div>
              <div>
                <h4 className="text-stockea-green font-display font-bold text-xs">Envíos a Todo el País</h4>
                <p className="text-stockea-graphite-muted text-[11px]">Despachos diarios y seguimiento</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-1/3 justify-center md:justify-center pt-4 md:pt-0">
              <div className="w-10 h-10 rounded-full bg-stockea-orange-soft flex items-center justify-center text-stockea-orange flex-shrink-0">
                <Store size={18} />
              </div>
              <div>
                <h4 className="text-stockea-green font-display font-bold text-xs">Precios Mayoristas x3, x6 y x12+</h4>
                <p className="text-stockea-graphite-muted text-[11px]">Descuento automático en el pedido</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-1/3 justify-center md:justify-end pt-4 md:pt-0">
              <div className="w-10 h-10 rounded-full bg-stockea-green-soft flex items-center justify-center text-stockea-green flex-shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="text-stockea-green font-display font-bold text-xs">Atención por WhatsApp</h4>
                <p className="text-stockea-graphite-muted text-[11px]">Asistencia directa del depósito</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CINTA PASANTE */}
      <div className="w-full overflow-hidden bg-stockea-orange py-2.5 border-y border-stockea-orange-hover flex whitespace-nowrap">
        <div className="flex items-center text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white" style={{ animation: 'stockeaMarquee 25s linear infinite' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="mx-6">Stock Directo de Depósito</span>
              <Sparkles size={12} />
              <span className="mx-6">Escala x3, x6 y x12+</span>
              <Sparkles size={12} />
              <span className="mx-6">Atención Mayorista Inmediata</span>
              <Sparkles size={12} />
            </div>
          ))}
        </div>
        <style>{`@keyframes stockeaMarquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </div>

      {/* DESTACADOS */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star size={14} className="text-stockea-orange fill-stockea-orange" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-stockea-green">Selección Especial</span>
            </div>
            <h2 className="font-display font-black text-2xl md:text-4xl text-stockea-green">Productos Destacados</h2>
          </div>
          <Link to="/catalogo" className="text-xs uppercase font-bold text-stockea-green hover:text-stockea-orange transition-colors flex items-center gap-1 border-b border-stockea-green pb-0.5">
            Ver Catálogo <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {featuredProducts.length > 0 ? (
            featuredProducts.map(product => <ProductCard key={product.id} product={product} />)
          ) : (
            <div className="col-span-full py-12 text-center text-xs text-stockea-graphite-muted border border-dashed border-stockea-border rounded-lg bg-white">
              No hay productos marcados como destacados.
            </div>
          )}
        </div>
      </section>

      {/* EXPLORÁ POR RUBRO: OPTIMIZADO PARA MOBILE (Compacto y en 2 columnas en móvil) */}
      <section className="py-16 bg-stockea-surface border-y border-stockea-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase font-bold tracking-widest text-stockea-orange block mb-1">Familias de Artículos</span>
            <h2 className="font-display font-black text-2xl md:text-4xl text-stockea-green">Explorá por Rubro</h2>
          </div>

          {loadingCategories ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 md:h-40 bg-stockea-green-soft animate-pulse rounded-card" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
              {categories.map((category, index) => {
                const productCount = products.filter(
                  p => p.category?.toLowerCase() === category.name?.toLowerCase()
                ).length;

                return (
                  <Link
                    key={category.id}
                    to={`/catalogo?categoria=${category.slug}`}
                    className="group relative overflow-hidden rounded-card p-4 md:p-6 bg-stockea-green border border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[120px] md:min-h-[170px]"
                  >
                    <span className="absolute -right-2 -bottom-4 font-display font-black text-5xl md:text-7xl text-white/[0.06] select-none pointer-events-none group-hover:text-stockea-orange/[0.12] transition-colors">
                      0{index + 1}
                    </span>

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-stockea-orange tracking-wider">// 0{index + 1}</span>
                      <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-pill bg-white/10 text-white/90">
                        {productCount} {productCount === 1 ? 'art.' : 'arts.'}
                      </span>
                    </div>

                    <div className="relative z-10 mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                      <h3 className="font-display font-bold text-sm md:text-xl text-white group-hover:text-stockea-orange transition-colors truncate">
                        {category.name}
                      </h3>
                      <ChevronRight size={16} className="text-white/60 group-hover:text-stockea-orange group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ÚLTIMOS INGRESOS */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center mb-10 text-center">
          <h2 className="font-display font-black text-2xl md:text-4xl text-stockea-green mb-2">Últimos Ingresos</h2>
          <div className="h-1 w-12 bg-stockea-orange rounded-full" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-12">
          {latestProducts.map(product => <ProductCard key={product.id} product={product} />)}
        </div>

        <div className="flex justify-center">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 bg-stockea-green hover:bg-stockea-orange text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-pill shadow transition-colors"
          >
            Ver Todo el Catálogo <ArrowRight size={14} />
          </Link>
        </div>
      </section>

    </div>
  );
};