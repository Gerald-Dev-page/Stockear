import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowUpRight, ShieldCheck } from 'lucide-react';
import logoGerald from '../../assets/logo-gerald.png';
import logoStockea from '../../assets/logo.png';

export const Footer = () => {
  return (
    <footer className="bg-stockea-green text-white border-t border-white/10 mt-auto font-sans">
      {/* Zona Principal de Enlaces y Datos */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Columna 1: Marca y Propósito */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-block bg-white/95 px-3 py-1.5 rounded-md">
              <img src={logoStockea} alt="STOCKea" className="h-7 object-contain" />
            </Link>
            <p className="text-white/75 text-xs leading-relaxed">
              Plataforma digital de abastecimiento comercial minorista y mayorista con escalas automáticas x3, x6 y x12+.
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
                  Catálogo Completo
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-stockea-orange transition-colors">
                  Acceso Operadores
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Escalas Comerciales */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-stockea-orange mb-4">
              Condiciones de Compra
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stockea-orange" />
                Minorista: Desde 1 unidad
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stockea-orange" />
                Mayorista 1: A partir de 3 unidades
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stockea-orange" />
                Mayorista 2: A partir de 6 unidades
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stockea-orange" />
                Mayorista 3: Compras de 12+ unidades
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-stockea-orange mb-4">
              Depósito Central
            </h4>
            <div className="space-y-2.5 text-xs text-white/80">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-stockea-orange flex-shrink-0" />
                San Luis, Argentina
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-stockea-orange flex-shrink-0" />
                Atención y Pedidos por WhatsApp
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-stockea-orange flex-shrink-0" />
                contacto@stockea.com.ar
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Franja Inferior: Copyright y Firma de Agencia */}
      <div className="border-t border-white/10 bg-stockea-green-dark py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          <p className="text-white/60 text-[11px] tracking-wide">
            © {new Date().getFullYear()} STOCKea. Todos los derechos reservados.
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