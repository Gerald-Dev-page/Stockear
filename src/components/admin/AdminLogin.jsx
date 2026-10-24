import { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { supabase } from '../../services/supabase';

export const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data?.session && onLoginSuccess) {
        onLoginSuccess(data.session);
      }
    } catch (err) {
      setErrorMsg(err.message === 'Invalid login credentials' ? 'Credenciales inválidas' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 font-sans">
      <div className="bg-stockea-surface p-8 max-w-md w-full rounded-card border border-stockea-border shadow-card text-center">
        <div className="w-14 h-14 mx-auto bg-stockea-green text-stockea-orange rounded-full flex items-center justify-center mb-5">
          <Lock size={26} />
        </div>
        <h2 className="font-display font-black text-2xl text-stockea-green mb-1">Acceso Administrativo</h2>
        <p className="text-xs text-stockea-graphite-muted mb-6">Iniciá sesión para administrar el catálogo.</p>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-stockea-graphite-muted block mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operador@stockea.com"
              className="w-full bg-stockea-bg border border-stockea-border rounded-lg px-3.5 py-2 text-sm outline-none focus:border-stockea-orange"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-stockea-graphite-muted block mb-1">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-stockea-bg border border-stockea-border rounded-lg px-3.5 py-2 text-sm outline-none focus:border-stockea-orange"
            />
          </div>

          {errorMsg && <p className="text-xs text-stockea-alert font-medium">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stockea-orange hover:bg-stockea-orange-hover text-white font-bold text-xs uppercase tracking-widest py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Ingresar al Panel'}
          </button>
        </form>
      </div>
    </div>
  );
};