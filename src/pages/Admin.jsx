import { useState, useEffect } from 'react';
import { Package, CheckCircle, Image as ImageIcon, Lock, LogOut, List, PlusCircle, Edit2, Star, Check, X } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useProducts } from '../hooks/useProducts';

export const Admin = () => {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);

  const { products } = useProducts();
  const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const [formData, setFormData] = useState({
    id: null, title: '', retailPrice: '', wholesalePrice: '', minWholesaleQty: 3, category: '', stock: 'disponible', isFeatured: false
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError('Credenciales incorrectas');
  };

  const handleEditProduct = (product) => {
    setFormData({
      id: product.id,
      title: product.title,
      retailPrice: product.retailPrice,
      wholesalePrice: product.wholesalePrice,
      minWholesaleQty: product.minWholesaleQty,
      category: product.category,
      stock: product.stock,
      isFeatured: product.isFeatured
    });
    setImagePreview(product.image);
    setFileToUpload(null);
    setActiveTab('form');
  };

  const handleNewProduct = () => {
    setFormData({ id: null, title: '', retailPrice: '', wholesalePrice: '', minWholesaleQty: 3, category: '', stock: 'disponible', isFeatured: false });
    setImagePreview(null);
    setFileToUpload(null);
    setActiveTab('form');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          setFileToUpload(new File([blob], `producto_${Date.now()}.webp`, { type: 'image/webp' }));
        }, 'image/webp', 0.8);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id && !fileToUpload) return alert("Seleccioná una imagen para el producto nuevo.");
    setIsSubmitting(true);

    try {
      let publicUrl = imagePreview;

      if (fileToUpload) {
        const { error: uploadError } = await supabase.storage.from('fotos_stockea').upload(fileToUpload.name, fileToUpload);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('fotos_stockea').getPublicUrl(fileToUpload.name);
        publicUrl = data.publicUrl;
      }

      const productData = {
        title: formData.title,
        retailPrice: Number(formData.retailPrice),
        wholesalePrice: Number(formData.wholesalePrice),
        minWholesaleQty: Number(formData.minWholesaleQty),
        category: formData.category,
        stock: formData.stock,
        isFeatured: formData.isFeatured,
        image: publicUrl
      };

      if (formData.id) {
        const { error } = await supabase.from('productos').update(productData).eq('id', formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('productos').insert([productData]);
        if (error) throw error;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      handleNewProduct();
      setActiveTab('list');

    } catch (error) {
      console.error(error);
      alert("Hubo un error al guardar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stockea-bg px-4">
        <div className="bg-stockea-surface p-8 md:p-10 w-full max-w-md shadow-card border border-stockea-border text-center rounded-card">
          <div className="w-16 h-16 mx-auto bg-stockea-navy-950 rounded-full flex items-center justify-center text-stockea-cta mb-6">
            <Lock size={32} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-stockea-navy-950 mb-2">Acceso privado</h1>
          <p className="text-sm text-stockea-text-muted mb-6">Ingresá con tus credenciales de administrador.</p>
          <form onSubmit={handleLogin} className="space-y-4 mt-6 text-left">
            <input type="email" required placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent border-b border-stockea-border py-2 outline-none focus:border-stockea-cta transition-colors" />
            <input type="password" required placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent border-b border-stockea-border py-2 outline-none focus:border-stockea-cta transition-colors" />
            {authError && <span className="text-xs text-stockea-alert block">{authError}</span>}
            <button type="submit" className="w-full bg-stockea-navy-950 text-white font-semibold py-4 mt-4 rounded-card hover:bg-stockea-cta hover:text-stockea-navy-950 transition-colors">
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stockea-bg p-4 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto bg-stockea-surface border border-stockea-border shadow-card p-6 md:p-8 rounded-card">

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border-b border-stockea-border pb-6">
          <div className="flex items-center gap-3">
            <Package className="text-stockea-cta" size={28} />
            <h1 className="font-display text-2xl font-semibold text-stockea-navy-950">Panel de control</h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1 bg-stockea-navy-100 rounded-full p-1 flex-1 md:flex-none">
              <button
                onClick={() => setActiveTab('list')}
                className={`flex-1 md:flex-none px-4 py-2 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 rounded-full transition-colors ${
                  activeTab === 'list' ? 'bg-stockea-navy-950 text-white' : 'text-stockea-text-muted hover:text-stockea-navy-950'
                }`}
              >
                <List size={14}/> Catálogo
              </button>
              <button
                onClick={handleNewProduct}
                className={`flex-1 md:flex-none px-4 py-2 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 rounded-full transition-colors ${
                  activeTab === 'form' ? 'bg-stockea-navy-950 text-white' : 'text-stockea-text-muted hover:text-stockea-navy-950'
                }`}
              >
                <PlusCircle size={14}/> Nuevo
              </button>
            </div>
            <button onClick={() => supabase.auth.signOut()} className="px-4 py-2 text-stockea-alert text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 rounded-full hover:bg-stockea-alert/10 transition-colors">
              <LogOut size={14}/> Salir
            </button>
          </div>
        </div>

        {success && (
          <div className="mb-6 bg-stockea-success/10 border border-stockea-success/30 text-stockea-success p-4 rounded-card flex items-center gap-2 text-sm font-medium">
            <CheckCircle size={18} /> Operación exitosa.
          </div>
        )}

        {activeTab === 'list' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-stockea-navy-100 text-stockea-text-muted uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="p-4 font-semibold rounded-l-card">Producto</th>
                  <th className="p-4 font-semibold">Categoría</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold rounded-r-card">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stockea-border">
                {products.map(prod => (
                  <tr key={prod.id} className="hover:bg-stockea-navy-100/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={prod.image} alt={prod.title} className="w-10 h-10 object-cover rounded-card border border-stockea-border" />
                      <span className="font-medium text-stockea-text flex items-center gap-1.5">
                        {prod.title}
                        {prod.isFeatured && <Star size={13} className="text-stockea-cta fill-stockea-cta" />}
                      </span>
                    </td>
                    <td className="p-4 text-stockea-text-muted">{prod.category}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-pill text-[10px] uppercase tracking-widest font-bold ${
                        prod.stock === 'disponible' ? 'bg-stockea-success/10 text-stockea-success' : 'bg-stockea-alert/10 text-stockea-alert'
                      }`}>
                        {prod.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleEditProduct(prod)} className="flex items-center gap-1 text-stockea-cta hover:text-stockea-navy-950 transition-colors font-semibold">
                        <Edit2 size={14}/> Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && <p className="text-center text-stockea-text-muted py-8 text-sm">No hay productos cargados todavía.</p>}
          </div>
        )}

        {activeTab === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-stockea-text-muted font-semibold mb-1 block">Título</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border-b border-stockea-border py-2 outline-none focus:border-stockea-cta transition-colors" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-stockea-text-muted font-semibold mb-1 block">Categoría</label>
                  <input required type="text" list="category-options" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border-b border-stockea-border py-2 outline-none focus:border-stockea-cta transition-colors" />
                  <datalist id="category-options">{uniqueCategories.map(cat => <option key={cat} value={cat} />)}</datalist>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-stockea-text-muted font-semibold mb-2 block">Estado</label>
                  <div className="flex items-center gap-1 bg-stockea-navy-100 rounded-full p-1 w-fit">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, stock: 'disponible'})}
                      className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5 rounded-full transition-colors ${
                        formData.stock === 'disponible' ? 'bg-stockea-success text-white' : 'text-stockea-text-muted'
                      }`}
                    >
                      <Check size={13} /> Disponible
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, stock: 'agotado'})}
                      className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5 rounded-full transition-colors ${
                        formData.stock === 'agotado' ? 'bg-stockea-alert text-white' : 'text-stockea-text-muted'
                      }`}
                    >
                      <X size={13} /> Agotado
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-stockea-text-muted font-semibold mb-1 block">Minorista ($)</label>
                  <input required type="number" value={formData.retailPrice} onChange={e => setFormData({...formData, retailPrice: e.target.value})} className="w-full border-b border-stockea-border py-2 outline-none focus:border-stockea-cta transition-colors" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-stockea-text-muted font-semibold mb-1 block">Mayorista ($)</label>
                  <input required type="number" value={formData.wholesalePrice} onChange={e => setFormData({...formData, wholesalePrice: e.target.value})} className="w-full border-b border-stockea-border py-2 outline-none focus:border-stockea-cta transition-colors" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-stockea-text-muted font-semibold mb-1 block">Regla mayorista (cant.)</label>
                  <input required type="number" min="1" value={formData.minWholesaleQty} onChange={e => setFormData({...formData, minWholesaleQty: e.target.value})} className="w-full border-b border-stockea-border py-2 outline-none focus:border-stockea-cta transition-colors" />
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-stockea-cta-soft border border-stockea-cta/30 rounded-card flex items-center gap-3">
              <input type="checkbox" id="destacado" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-5 h-5 accent-stockea-cta cursor-pointer" />
              <label htmlFor="destacado" className="text-sm font-semibold text-stockea-navy-950 cursor-pointer select-none flex items-center gap-1.5">
                <Star size={15} className="fill-stockea-cta text-stockea-cta" /> Mostrar producto en Destacados
              </label>
            </div>

            <div className="mt-8">
              <label className="text-xs uppercase tracking-widest text-stockea-text-muted font-semibold mb-2 block">Foto (opcional al editar)</label>
              <div className="relative border-2 border-dashed border-stockea-border bg-stockea-navy-100/40 h-48 flex flex-col items-center justify-center cursor-pointer overflow-hidden rounded-card hover:border-stockea-cta transition-colors">
                <input required={!formData.id && !imagePreview} type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-contain p-2" alt="Vista previa" />
                ) : (
                  <div className="text-center text-stockea-text-muted">
                    <ImageIcon size={32} className="mx-auto mb-2" />
                    <span className="text-sm">Tocá para subir una foto</span>
                  </div>
                )}
              </div>
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full bg-stockea-navy-950 text-white font-display font-semibold py-4 rounded-card hover:bg-stockea-cta hover:text-stockea-navy-950 transition-colors flex items-center justify-center gap-2 mt-8 disabled:opacity-50">
              {isSubmitting ? 'Guardando...' : (formData.id ? 'Actualizar producto' : 'Crear producto')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};