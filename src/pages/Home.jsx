import { ArrowRight, Loader2, Truck, ShieldCheck, Store, Star, Sparkles } from 'lucide-react';
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
      <div className="min-h-screen flex flex-col items-center justify-center text-stockea-text-muted bg-stockea-bg">
        <Loader2 className="animate-spin mb-4 text-stockea-cta" size={40} />
        <p className="font-display text-lg tracking-wide">Preparando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="bg-stockea-bg min-h-screen selection:bg-stockea-cta selection:text-white">

      {/* ── BLOQUE HERO + BARRA CONFIANZA ──────────────────────────────── */}
      <div className="bg-stockea-navy-950">
        
        {/* HERO */}
        <section className="relative h-[82vh] flex flex-col justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-stockea-navy-950/95 via-stockea-navy-950/60 to-transparent z-10" />

          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover md:hidden z-0 opacity-60">
            <source src={videoMobile} type="video/mp4" />
          </video>
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover hidden md:block z-0 opacity-60">
            <source src={videoDesktop} type="video/mp4" />
          </video>

          <div className="relative z-20 px-4 md:px-12 lg:px-20 max-w-7xl w-full mx-auto">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-[1px] bg-stockea-cta"></span>
                <span className="text-stockea-cta text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold">
                  Catálogo Digital B2B & Retail
                </span>
              </div>
              
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-[1.05] font-bold drop-shadow-lg tracking-tight">
                Optimizá el stock <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                  de tu negocio.
                </span>
              </h1>

              <p className="text-white/80 text-sm md:text-base max-w-md mb-10 leading-relaxed font-medium">
                Venta mayorista escalonada por volumen y atención minorista ágil, directo con depósito central.
              </p>

              <Link
                to="/catalogo"
                className="group inline-flex items-center gap-4 bg-stockea-cta text-stockea-navy-950 font-bold text-xs uppercase tracking-widest px-8 py-4 md:px-10 md:py-5 hover:bg-white transition-all duration-500 rounded-sm shadow-[0_0_40px_rgba(201,162,39,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
              >
                Ver Colección Completa
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* BARRA DE CONFIANZA */}
        <div className="relative z-30 -mt-16 md:-mt-12 px-4 max-w-7xl mx-auto w-full pb-10 md:pb-12">
          <div className="bg-stockea-navy-950/80 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-card shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="flex items-center gap-4 w-full md:w-1/3 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-full bg-stockea-cta/20 flex items-center justify-center text-stockea-cta flex-shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="text-white font-display font-semibold text-sm">Envíos a Todo el País</h4>
                <p className="text-white/60 text-xs">Despachos diarios y seguimiento</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-1/3 justify-center md:justify-center pt-6 md:pt-0">
              <div className="w-12 h-12 rounded-full bg-stockea-cta/20 flex items-center justify-center text-stockea-cta flex-shrink-0">
                <Store size={20} />
              </div>
              <div>
                <h4 className="text-white font-display font-semibold text-sm">3 Escalas Mayoristas</h4>
                <p className="text-white/60 text-xs">Precios automáticos x3, x6 y x12+</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-1/3 justify-center md:justify-end pt-6 md:pt-0">
              <div className="w-12 h-12 rounded-full bg-stockea-cta/20 flex items-center justify-center text-stockea-cta flex-shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-white font-display font-semibold text-sm">Atención Personalizada</h4>
                <p className="text-white/60 text-xs">Confirmación directa por WhatsApp</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── CINTA PASANTE (MARQUEE) ────────────────────────────────────── */}
      <div className="w-full overflow-hidden bg-stockea-cta py-3 border-y border-stockea-cta-hover flex whitespace-nowrap">
        <div 
          className="flex items-center text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-stockea-navy-950"
          style={{ animation: 'stockeaMarquee 25s linear infinite' }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="mx-6">Stock Real en Depósito</span>
              <Sparkles size={12} />
              <span className="mx-6">Precios por Mayor y Menor</span>
              <Sparkles size={12} />
              <span className="mx-6">Facturación y Despacho Rápido</span>
              <Sparkles size={12} />
            </div>
          ))}
        </div>
        <style>{`@keyframes stockeaMarquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </div>

      {/* ── SELECCIÓN DESTACADA ────────────────────────────────────────── */}
      <section className="py-24 bg-stockea-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star size={16} className="text-stockea-cta fill-stockea-cta" />
                <span className="text-[10px] uppercase tracking-widest text-stockea-navy-600 font-bold">
                  Top Picks
                </span>
              </div>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-stockea-navy-950 tracking-tight">
                Selección Destacada
              </h2>
            </div>
            <Link
              to="/catalogo"
              className="group flex items-center gap-3 text-xs uppercase tracking-widest font-bold text-stockea-navy-950 hover:text-stockea-cta transition-colors border-b-2 border-stockea-navy-950 pb-1 hover:border-stockea-cta"
            >
              Ver Catálogo Completo <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => <ProductCard key={product.id} product={product} />)
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center bg-white border border-dashed border-stockea-border py-20 rounded-card shadow-sm">
                <Star size={40} className="text-stockea-border mb-4" />
                <p className="font-display text-lg text-stockea-navy-950 font-semibold mb-1">Sin destacados asignados</p>
                <p className="text-sm text-stockea-text-muted">Podés marcar productos como destacados desde el panel administrativo.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CATEGORÍAS EDITORIALES (SIN FOTOS ROTAS) ────────────────────────── */}
      <section className="py-24 bg-stockea-surface border-y border-stockea-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <span className="w-6 h-[2px] bg-stockea-cta"></span>
                <span className="text-[10px] uppercase tracking-widest text-stockea-navy-600 font-bold">
                  Familias de Productos
                </span>
              </div>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-stockea-navy-950 tracking-tight">
                Explorá por Rubro
              </h2>
            </div>
            <p className="text-stockea-text-muted text-xs md:text-sm max-w-md">
              Seleccioná un rubro para filtrar el catálogo mayorista y acceder a precios por volumen.
            </p>
          </div>

          {loadingCategories ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-44 bg-stockea-navy-100 animate-pulse rounded-card" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-stockea-border rounded-card bg-stockea-bg">
              <p className="text-stockea-text-muted text-sm">No hay categorías cargadas aún en la base de datos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => {
                // Cantidad real de artículos en stock de este rubro
                const productCount = products.filter(
                  p => p.category?.toLowerCase() === category.name?.toLowerCase()
                ).length;

                return (
                  <Link
                    key={category.id}
                    to={`/catalogo?categoria=${category.slug}`}
                    className="group relative overflow-hidden rounded-card p-8 bg-stockea-navy-950 border border-white/10 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between min-h-[200px]"
                  >
                    {/* Marca de agua tipográfica decorativa de fondo */}
                    <span className="absolute -right-4 -bottom-6 font-display font-black text-7xl text-white/[0.04] select-none pointer-events-none group-hover:text-stockea-cta/[0.08] transition-colors duration-500">
                      0{index + 1}
                    </span>

                    {/* Resplandor radial dorado sutil al hacer hover */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.15),transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Encabezado de la Card: Índice y Cantidad */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-stockea-cta/80 tracking-widest">
                        // 0{index + 1}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-pill bg-white/10 text-white/80 border border-white/10 group-hover:border-stockea-cta/40 group-hover:text-stockea-cta transition-colors">
                        {productCount} {productCount === 1 ? 'artículo' : 'artículos'}
                      </span>
                    </div>

                    {/* Nombre del Rubro y Flecha CTA */}
                    <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">
                          Rubro Comercial
                        </span>
                        <h3 className="font-display font-bold text-2xl text-white group-hover:text-stockea-cta transition-colors duration-300">
                          {category.name}
                        </h3>
                      </div>

                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 group-hover:bg-stockea-cta group-hover:text-stockea-navy-950 group-hover:border-stockea-cta group-hover:translate-x-1 transition-all duration-300 flex-shrink-0">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* ── ÚLTIMOS INGRESOS ───────────────────────────────────────────── */}
      <section className="py-24 bg-stockea-bg">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-stockea-navy-950 tracking-tight mb-4">
              Últimos Ingresos
            </h2>
            <div className="h-1 w-16 bg-stockea-cta rounded-full" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
            {latestProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>

          <div className="mt-20 flex justify-center">
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-3 bg-stockea-navy-950 text-white font-bold text-xs uppercase tracking-widest px-12 py-5 rounded-pill shadow-xl hover:bg-stockea-cta hover:text-stockea-navy-950 hover:-translate-y-1 transition-all duration-300"
            >
              Explorar Todo el Catálogo <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};