import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/layout/Navbar';
import { CartDrawer } from './components/layout/CartDrawer';
import { FloatingWhatsApp } from './components/ui/FloatingWhatsApp';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Admin } from './pages/Admin';

// Tu firma de agencia
import logoGerald from './assets/logo-gerald.png';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-stockea-bg relative">
          
          <Navbar />
          <CartDrawer />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalogo" element={<Catalog />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          
          <FloatingWhatsApp />
          
          {/* ── FOOTER CORPORATIVO ── */}
          <footer className="bg-stockea-surface border-t border-stockea-border py-14 px-4 text-center mt-auto flex flex-col items-center">
            
            <p className="text-stockea-text-muted text-[10px] font-bold tracking-widest uppercase mb-10">
              © {new Date().getFullYear()} STOCKea. Todos los derechos reservados.
            </p>

            <a
              href="https://geralddev.com.ar/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-3 group"
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-stockea-text-muted/60 group-hover:text-stockea-navy-950 transition-colors duration-300">
                Desarrollado por
              </span>
              <img
                src={logoGerald}
                alt="Gerald.Dev"
                className="h-7 md:h-8 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 grayscale group-hover:grayscale-0"
              />
            </a>
            
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;