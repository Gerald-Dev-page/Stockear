import { Link } from 'react-router-dom';
import { MapPin, Phone, ShieldCheck, ArrowUpRight } from 'lucide-react';
import logoGerald from '../../assets/logo-gerald.png';
import logoStockea from '../../assets/logo.png';

export const Footer = () => {
  const WHATSAPP_URL = "https://wa.me/5492664885550?text=Hola%20Stockea,%20quiero%20hacer%20una%20consulta%20sobre%20los%20productos.";
  const INSTAGRAM_URL = "https://www.instagram.com/stockeasl/";

  return (
    <footer className="bg-stockea-green text-white border-t border-white/10 mt-auto font-sans">
      {/* Zona Principal de Enlaces y Datos */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Columna 1: Marca y Propósito */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-block py-1 group">
              <img src={logoStockea} alt="STOCKea" className="h-12 md:h-14 object-contain transition-transform group-hover:scale-105" />
            </Link>
            <p className="text-white/75 text-xs leading-relaxed">
              Empresa familiar dedicada a la importación directa desde China. Apoyamos al pequeño y mediano revendedor con responsabilidad, seriedad y atención personalizada.
            </p>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-stockea-orange bg-black/20 px-2.5 py-1 rounded-pill border border-white/10">
              <ShieldCheck size={13} /> Venta Directa de Depósito
            </div>
          </div>

          {/* Columna 2: Navegación Rápida */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-stockea-orange mb-4">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80">
              <li>
                <Link to="/" className="hover:text-stockea-orange transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="hover:text-stockea-orange transition-colors">
                  Catálogo / Productos
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-stockea-orange transition-colors">
                  Acceso Operadores
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Condiciones Comerciales */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-stockea-orange mb-4">
              Condiciones de Compra
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stockea-orange" />
                Venta Minorista y Mayorista
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stockea-orange" />
                Descuentos por volumen automáticos
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stockea-orange" />
                Atención especial a revendedores
              </li>
            </ul>
          </div>

          {/* Columna 4: Depósito Central y Redes */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-stockea-orange mb-4">
              Depósito Central
            </h4>
            <div className="space-y-3 text-xs text-white/80">
              <p className="flex items-start gap-2">
                <MapPin size={14} className="text-stockea-orange flex-shrink-0 mt-0.5" />
                Leandro N. Alem 2233, D5700 San Luis, Argentina
              </p>
              <a 
                href={WHATSAPP_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-stockea-orange transition-colors"
              >
                <Phone size={14} className="text-stockea-orange flex-shrink-0" />
                +54 9 2664 88-5550
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-stockea-orange transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current text-stockea-orange flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>@stockeasl</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Franja Inferior: Copyright y Firma de Agencia */}
      <div className="border-t border-white/10 bg-stockea-green-dark py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          <p className="text-white/60 text-[11px] tracking-wide">
            © {new Date().getFullYear()} STOCKea San Luis. Todos los derechos reservados.
          </p>

          <a
            href="https://geralddev.com.ar/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group text-white/60 hover:text-white transition-colors"
          >
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] group-hover:text-stockea-orange transition-colors">
              Desarrollado por Gerald.Dev
            </span>
            <img
              src={logoGerald}
              alt="Gerald.Dev"
              className="h-5 object-contain opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all grayscale group-hover:grayscale-0"
            />
            <ArrowUpRight size={13} className="text-stockea-orange opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

        </div>
      </div>
    </footer>
  );
};