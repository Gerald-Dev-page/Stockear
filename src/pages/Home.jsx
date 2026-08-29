import { ArrowRight, Loader2, Truck, ShieldCheck, Store, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { ProductCard } from '../components/catalog/ProductCard';

import videoDesktop from '../assets/video-desktop.mp4';
import videoMobile from '../assets/video-mobile.mp4';

export const Home = () => {
  const { products, loading } = useProducts();
  const { categories, loading: loadingCategories } = useCategories();

  const featuredProducts = products.filter(p => p.isFeatured === true).slice(0, 4);
  const latestProducts = products.filter(p => p.isFeatured !== true).slice(0, 8);

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

      {/* ── BLOQUE OSCURO CONTINUO (HERO + BARRA) ───────────────────────────── */}
      <div className="bg-stockea-navy-950">
        
        {/* HERO EDITORIAL */}
        <section className="relative h-[80vh] flex flex-col justify-center overflow-hidden">
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
                  Colección Premium
                </span>
              </div>
              
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-[1.05] font-bold drop-shadow-lg tracking-tight">
                Elevá el nivel <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                  de tu stock.
                </span>
              </h1>

              <p className="text-white/80 text-sm md:text-base max-w-md mb-10 leading-relaxed font-medium">
                El catálogo digital mayorista y minorista diseñado para que tu negocio potencie sus ventas con agilidad y estilo.
              </p>

              <Link
                to="/catalogo"
                className="group inline-flex items-center gap-4 bg-stockea-cta text-stockea-navy-950 font-bold text-xs uppercase tracking-widest px-8 py-4 md:px-10 md:py-5 hover:bg-white transition-all duration-500 rounded-sm shadow-[0_0_40px_rgba(201,162,39,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
              >
                Explorar Colección 
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* BARRA DE CONFIANZA FLOTANTE (Ahora integrada sin dejar huecos blancos) */}
        <div className="relative z-30 -mt-16 md:-mt-12 px-4 max-w-7xl mx-auto w-full pb-10 md:pb-12">
          <div className="bg-stockea-navy-950/80 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-card shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="flex items-center gap-4 w-full md:w-1/3 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-full bg-stockea-cta/20 flex items-center justify-center text-stockea-cta flex-shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="text-white font-display font-semibold text-sm">Envíos Nacionales</h4>
                <p className="text-white/60 text-xs">Llegamos a todo el país</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-1/3 justify-center md:justify-center pt-6 md:pt-0">
              <div className="w-12 h-12 rounded-full bg-stockea-cta/20 flex items-center justify-center text-stockea-cta flex-shrink-0">
                <Store size={20} />
              </div>
              <div>
                <h4 className="text-white font-display font-semibold text-sm">Mayorista & Minorista</h4>
                <p className="text-white/60 text-xs">Precios por volumen</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-1/3 justify-center md:justify-end pt-6 md:pt-0">
              <div className="w-12 h-12 rounded-full bg-stockea-cta/20 flex items-center justify-center text-stockea-cta flex-shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-white font-display font-semibold text-sm">Compra Segura</h4>
                <p className="text-white/60 text-xs">Atención por WhatsApp</p>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* ── FIN BLOQUE OSCURO ─────────────────────────────────────────────────── */}

      {/* ── MARQUEE (CINTA PASANTE) ──────────────────────────────────────── */}
      <div className="w-full overflow-hidden bg-stockea-cta py-3 border-y border-stockea-cta-hover flex whitespace-nowrap">
        <div 
          className="flex items-center text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-stockea-navy-950"
          style={{ animation: 'stockeaMarquee 25s linear infinite' }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="mx-6">Calidad Premium</span>
              <Sparkles size={12} />
              <span className="mx-6">Venta Mayorista</span>
              <Sparkles size={12} />
              <span className="mx-6">Envíos a todo el país</span>
              <Sparkles size={12} />
            </div>
          ))}
        </div>
        <style>{`@keyframes stockeaMarquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </div>

      {/* ── DESTACADOS ────────────────────────────────────── */}
      <section className="py-24 bg-stockea-bg relative overflow-hidden">
        <div className="absolute top-10 left-0 text-[150px] font-display font-bold text-stockea-navy-950/5 select-none pointer-events-none whitespace-nowrap z-0">
          TOP PICKS TOP PICKS
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star size={16} className="text-stockea-cta fill-stockea-cta" />
                <span className="text-[10px] uppercase tracking-widest text-stockea-navy-600 font-bold">
                  Must Haves
                </span>
              </div>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-stockea-navy-950 tracking-tight">
                Selección Estelar.
              </h2>
            </div>
            <Link
              to="/catalogo"
              className="group flex items-center gap-3 text-xs uppercase tracking-widest font-bold text-stockea-navy-950 hover:text-stockea-cta transition-colors border-b-2 border-stockea-navy-950 pb-1 hover:border-stockea-cta"
            >
              Ver Catálogo <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => <ProductCard key={product.id} product={product} />)
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center bg-white border border-dashed border-stockea-border py-20 rounded-card shadow-sm">
                <Star size={40} className="text-stockea-border mb-4" />
                <p className="font-display text-lg text-stockea-navy-950 font-semibold mb-1">Aún no hay destacados</p>
                <p className="text-sm text-stockea-text-muted">Marcá tus productos estrella desde el panel de control.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CATEGORÍAS (BENTO GRID) ────────────────────────────────────── */}
      <section className="py-24 bg-stockea-surface border-y border-stockea-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-stockea-navy-950 tracking-tight mb-4">
              Explorá la colección.
            </h2>
            <p className="text-stockea-text-muted max-w-lg mx-auto">Encontrá exactamente lo que tu negocio necesita navegando por nuestras secciones principales.</p>
          </div>

          {loadingCategories ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
              <div className="bg-stockea-navy-100 animate-pulse rounded-card md:col-span-2 md:row-span-2"></div>
              <div className="bg-stockea-navy-100 animate-pulse rounded-card"></div>
              <div className="bg-stockea-navy-100 animate-pulse rounded-card"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px] md:auto-rows-[300px]">
              {categories.slice(0, 5).map((category, index) => (
                <Link
                  key={category.id}
                  to={`/catalogo?categoria=${category.slug}`}
                  className={`group relative overflow-hidden rounded-card bg-stockea-navy-950 shadow-sm hover:shadow-xl transition-all duration-500
                    ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''} 
                    ${index === 3 ? 'md:col-span-2' : ''}
                  `}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stockea-navy-950/90 via-stockea-navy-950/20 to-transparent" />
                  
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-stockea-cta text-[10px] uppercase tracking-widest font-bold mb-2 block opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        Ver Colección
                      </span>
                      <h3 className={`text-white font-display font-bold leading-none ${index === 0 ? 'text-4xl md:text-6xl' : 'text-2xl md:text-3xl'}`}>
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── ÚLTIMOS PRODUCTOS ──────────────────── */}
      <section className="py-24 bg-stockea-bg">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-stockea-navy-950 tracking-tight mb-6">
              Últimos Ingresos.
            </h2>
            <div className="h-1 w-20 bg-stockea-cta rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {latestProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>

          <div className="mt-20 flex justify-center">
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-3 bg-stockea-navy-950 text-white font-bold text-xs uppercase tracking-widest px-12 py-5 rounded-pill shadow-xl hover:bg-stockea-cta hover:text-stockea-navy-950 hover:-translate-y-1 transition-all duration-300"
            >
              Ver Todo el Catálogo <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};