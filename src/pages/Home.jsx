import { ArrowRight, Loader2, Truck, ShieldCheck, Store, Star, Sparkles, ChevronRight, ShoppingCart, FileText, Send, MessageSquare } from 'lucide-react';
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

  const WHATSAPP_URL = "https://wa.me/5492664885550?text=Hola%20Stockea,%20quiero%20hacer%20una%20consulta%20sobre%20los%20productos.";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-stockea-graphite-muted bg-stockea-bg font-sans px-4 text-center">
        <Loader2 className="animate-spin mb-4 text-stockea-orange" size={40} />
        <p className="font-display font-bold text-lg text-stockea-green">Cargando catálogo oficial...</p>
      </div>
    );
  }

  return (
    <div className="bg-stockea-bg min-h-screen font-sans selection:bg-stockea-orange-soft selection:text-stockea-orange overflow-x-hidden">

      {/* ── HERO CON FILTRO NEUTRO (GRAFITO) ── */}
      <div className="bg-stockea-graphite">
        <section className="relative h-[78vh] flex flex-col justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-stockea-graphite via-stockea-graphite/1 to-transparent z-10" />

          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover md:hidden z-0 opacity-45">
            <source src={videoMobile} type="video/mp4" />
          </video>
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover hidden md:block z-0 opacity-45">
            <source src={videoDesktop} type="video/mp4" />
          </video>

          <div className="relative z-20 px-4 md:px-12 lg:px-20 max-w-7xl w-full mx-auto text-center md:text-left">
            <div className="max-w-2xl mx-auto md:mx-0">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <span className="w-6 h-[2px] bg-stockea-orange"></span>
                <span className="text-stockea-orange text-[10px] md:text-xs uppercase tracking-[0.25em] font-bold">
                  Importación Directa & Distribución
                </span>
              </div>
              
              <h1 className="font-display text-3xl sm:text-6xl md:text-7xl text-white mb-5 leading-[1.05] font-black tracking-tight">
                Stock para <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60">
                  seguir creciendo.
                </span>
              </h1>

              <p className="text-white/80 text-xs md:text-base max-w-lg mx-auto md:mx-0 mb-8 leading-relaxed">
                Abastecimiento inteligente con precios minoristas y mayoristas automáticos para comerciantes y revendedores de todo el país.
              </p>

              <Link
                to="/catalogo"
                className="group inline-flex items-center justify-center gap-3 bg-stockea-orange hover:bg-stockea-orange-hover text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-pill shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Explorar Catálogo Completo
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── BARRA DE BENEFICIOS ── */}
        <div className="relative z-30 -mt-8 md:-mt-10 px-4 max-w-7xl mx-auto w-full pb-8">
          <div className="bg-stockea-surface border border-stockea-border p-4 md:p-6 rounded-card shadow-xl flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-stockea-border">
            <div className="flex items-center gap-3 w-full md:w-1/3 justify-center md:justify-start text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-stockea-green-soft flex items-center justify-center text-stockea-green flex-shrink-0">
                <Truck size={18} />
              </div>
              <div>
                <h4 className="text-stockea-green font-display font-bold text-xs">Envíos a Todo el País</h4>
                <p className="text-stockea-graphite-muted text-[11px]">Optimización de costos de flete</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-1/3 justify-center md:justify-center pt-4 md:pt-0 text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-stockea-orange-soft flex items-center justify-center text-stockea-orange flex-shrink-0">
                <Store size={18} />
              </div>
              <div>
                <h4 className="text-stockea-green font-display font-bold text-xs">Precios Mayoristas</h4>
                <p className="text-stockea-graphite-muted text-[11px]">Descuento automático a partir de 3 unidades</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-1/3 justify-center md:justify-end pt-4 md:pt-0 text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-stockea-green-soft flex items-center justify-center text-stockea-green flex-shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="text-stockea-green font-display font-bold text-xs">Atención Personalizada</h4>
                <p className="text-stockea-graphite-muted text-[11px]">Empresa familiar y directa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CINTA PASANTE ── */}
      <div className="w-full overflow-hidden bg-stockea-orange py-2.5 border-y border-stockea-orange-hover flex whitespace-nowrap">
        <div className="flex items-center text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white" style={{ animation: 'stockeaMarquee 25s linear infinite' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="mx-6">Importación Directa de China</span>
              <Sparkles size={12} />
              <span className="mx-6">Apoyo al Pequeño y Mediano Revendedor</span>
              <Sparkles size={12} />
              <span className="mx-6">Envíos desde San Luis a todo el país</span>
              <Sparkles size={12} />
            </div>
          ))}
        </div>
        <style>{`@keyframes stockeaMarquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </div>

      {/* ── DESTACADOS ── */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 gap-4 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
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

      {/* ── EXPLORÁ POR RUBRO (CON IMAGEN PERSONALIZADA DEL ADMIN) ── */}
      <section className="py-16 bg-stockea-surface border-y border-stockea-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <span className="text-[10px] uppercase font-bold tracking-widest text-stockea-orange block mb-1">Familias de Artículos</span>
            <h2 className="font-display font-black text-2xl md:text-4xl text-stockea-green">Explorá por Rubro</h2>
          </div>

          {loadingCategories ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 md:h-40 bg-stockea-green-soft animate-pulse rounded-card" />
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
                    className="group relative overflow-hidden rounded-card p-4 md:p-6 bg-stockea-green border border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[130px] md:min-h-[170px]"
                  >
                    {/* Imagen de fondo personalizada del rubro (si el operador la cargó) o fallback */}
                    {category.image ? (
                      <>
                        <img 
  src={category.image} 
  alt={category.name} 
  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
  style={{ objectPosition: category.position || 'center' }}
/>
                        <div className="absolute inset-0 bg-gradient-to-t from-stockea-green/95 via-stockea-green/60 to-black/30" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-stockea-green" />
                    )}

                    <span className="absolute -right-2 -bottom-4 font-display font-black text-5xl md:text-7xl text-white/[0.08] select-none pointer-events-none group-hover:text-stockea-orange/[0.18] transition-colors">
                      0{index + 1}
                    </span>

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-stockea-orange tracking-wider bg-black/30 px-2 py-0.5 rounded-pill backdrop-blur-xs">// 0{index + 1}</span>
                      <span className="text-[9px] uppercase font-bold px-2.5 py-0.5 rounded-pill bg-white/20 text-white backdrop-blur-xs">
                        {productCount} {productCount === 1 ? 'art.' : 'arts.'}
                      </span>
                    </div>

                    <div className="relative z-10 mt-3 pt-2 border-t border-white/20 flex items-center justify-between">
                      <h3 className="font-display font-bold text-sm md:text-xl text-white group-hover:text-stockea-orange transition-colors truncate">
                        {category.name}
                      </h3>
                      <ChevronRight size={16} className="text-white/80 group-hover:text-stockea-orange group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CÓMO PEDIR (2x2 EN MOBILE CON ESENCIA PROPIA) ── */}
      <section className="py-16 md:py-20 bg-stockea-bg border-b border-stockea-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-stockea-orange block mb-2">
            Rápido, Simple y Directo
          </span>
          <h2 className="font-display font-black text-3xl md:text-4xl text-stockea-green mb-2">
            ¿Cómo hacer tu pedido?
          </h2>
          <p className="text-stockea-graphite-muted text-xs md:text-sm mb-10 font-sans max-w-md mx-auto">
            Sin vueltas ni complicaciones. Armás tu carrito y lo charlamos por WhatsApp al instante.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            <div className="bg-stockea-surface border border-stockea-border p-4 md:p-6 rounded-card shadow-sm flex flex-col items-center text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-stockea-green-soft flex items-center justify-center text-stockea-green mb-3">
                <ShoppingCart size={20} />
              </div>
              <h3 className="font-display font-bold text-xs md:text-base text-stockea-green mb-1">1. Elegí lo que necesitás</h3>
              <p className="text-[11px] md:text-xs text-stockea-graphite-muted">Navegá el catálogo y sumá artículos al pedido.</p>
            </div>

            <div className="bg-stockea-surface border border-stockea-border p-4 md:p-6 rounded-card shadow-sm flex flex-col items-center text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-stockea-green-soft flex items-center justify-center text-stockea-green mb-3">
                <FileText size={20} />
              </div>
              <h3 className="font-display font-bold text-xs md:text-base text-stockea-green mb-1">2. Dejanos tus datos</h3>
              <p className="text-[11px] md:text-xs text-stockea-graphite-muted">Nombre, teléfono y localidad de entrega.</p>
            </div>

            <div className="bg-stockea-surface border border-stockea-border p-4 md:p-6 rounded-card shadow-sm flex flex-col items-center text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-stockea-green-soft flex items-center justify-center text-stockea-green mb-3">
                <Send size={20} />
              </div>
              <h3 className="font-display font-bold text-xs md:text-base text-stockea-green mb-1">3. Envianos la lista</h3>
              <p className="text-[11px] md:text-xs text-stockea-graphite-muted">El pedido nos llega directo a nuestro WhatsApp.</p>
            </div>

            <div className="bg-stockea-surface border border-stockea-border p-4 md:p-6 rounded-card shadow-sm flex flex-col items-center text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-stockea-green-soft flex items-center justify-center text-stockea-green mb-3">
                <MessageSquare size={20} />
              </div>
              <h3 className="font-display font-bold text-xs md:text-base text-stockea-green mb-1">4. ¡Listo! Coordinamos</h3>
              <p className="text-[11px] md:text-xs text-stockea-graphite-muted">Te escribimos al toque para cerrar pago y envío.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ÚLTIMOS INGRESOS ── */}
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

      {/* ── DESCRIPCIÓN INSTITUCIONAL (JUSTO ANTES DEL FOOTER) ── */}
      <section className="py-16 md:py-20 bg-stockea-surface border-t border-stockea-border">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-stockea-orange block mb-3">
            Nuestra Esencia
          </span>
          <h2 className="font-display font-black text-2xl md:text-3xl text-stockea-green mb-4">
            Stockea San Luis
          </h2>
          <p className="text-stockea-graphite text-xs md:text-sm leading-relaxed font-sans max-w-3xl mx-auto mb-8">
            En Stockea San Luis somos una empresa familiar dedicada a la importación directa desde China. Sabemos lo que cuesta emprender. Por eso, nos enfocamos en apoyar al pequeño y mediano revendedor con responsabilidad, seriedad y atención personalizada. Queremos que reduzcas tus costos de flete, optimices tus compras y juntos hagamos crecer tu emprendimiento.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-stockea-orange hover:bg-stockea-orange-hover text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-pill shadow transition-colors"
          >
            Contactar por WhatsApp <ArrowRight size={14} />
          </a>
        </div>
      </section>

    </div>
  );
};