import { useState, useEffect } from 'react';
import { Package, CheckCircle, Image as ImageIcon, Lock, LogOut, List, PlusCircle, Edit2, Check, X, Loader2, Star } from 'lucide-react';
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

  const { products, refetch } = useProducts();
  const [categoriesList, setCategoriesList] = useState([]);

  const [formData, setFormData] = useState({
    id: null,
    title: '',
    retailPrice: '',
    wholesalePrice1: '',
    wholesalePrice2: '',
    wholesalePrice3: '',
    category_id: '',
    stock: 'disponible',
    sku: '',
    description: '',
    destacado: false
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      const { data, error } = await supabase.from('categorias').select('id, nombre').order('nombre');
      if (!error && data) setCategoriesList(data);
    };
    loadCategories();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError('Credenciales incorrectas');
  };

  const handleEditProduct = (product) => {
    const matchedCategory = categoriesList.find(c => c.nombre === product.category);

    setFormData({
      id: product.id,
      title: product.title,
      retailPrice: product.retailPrice,
      wholesalePrice1: product.wholesalePrice,
      wholesalePrice2: product.wholesalePriceTier2,
      wholesalePrice3: product.wholesalePriceTier3,
      category_id: matchedCategory ? matchedCategory.id : (product.categoryId || ''),
      stock: product.stock === 'agotado' ? 'agotado' : 'disponible',
      sku: product.sku || '',
      description: product.description || '',
      destacado: Boolean(product.isFeatured)
    });
    setImagePreview(product.image);
    setFileToUpload(null);
    setActiveTab('form');
  };

  const handleNewProduct = () => {
    setFormData({
      id: null,
      title: '',
      retailPrice: '',
      wholesalePrice1: '',
      wholesalePrice2: '',
      wholesalePrice3: '',
      category_id: categoriesList[0]?.id || '',
      stock: 'disponible',
      sku: '',
      description: '',
      destacado: false
    });
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
        const { error: uploadError } = await supabase.storage
          .from('fotos_stockea')
          .upload(fileToUpload.name, fileToUpload);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('fotos_stockea')
          .getPublicUrl(fileToUpload.name);

        publicUrl = data.publicUrl;
      }

      const productData = {
        nombre: formData.title,
        sku: formData.sku || null,
        descripcion: formData.description || '',
        precio_venta: Number(formData.retailPrice),
        precio_mayorista_1: Number(formData.wholesalePrice1),
        precio_mayorista_2: Number(formData.wholesalePrice2 || formData.wholesalePrice1),
        precio_mayorista_3: Number(formData.wholesalePrice3 || formData.wholesalePrice2 || formData.wholesalePrice1),
        categoria_id: formData.category_id || null,
        stock_actual: formData.stock === 'disponible' ? 10 : 0,
        activo: true,
        destacado: formData.destacado,
        fotos: [publicUrl]
      };

      if (formData.id) {
        const { error } = await supabase
          .from('productos')
          .update(productData)
          .eq('id_producto', formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('productos')
          .insert([productData]);
        if (error) throw error;
      }

      setSuccess(true);
      if (refetch) refetch();

      setTimeout(() => {
        setSuccess(false);
        handleNewProduct();
        setActiveTab('list');
      }, 1200);

    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert("Hubo un error al guardar los cambios en la base de datos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stockea-bg px-4 pt-28 pb-12">
        <div className="bg-stockea-surface p-8 md:p-10 w-full max-w-md shadow-card border border-stockea-border text-center rounded-card">
          <div className="w-16 h-16 mx-auto bg-stockea-navy-950 rounded-full flex items-center justify-center text-stockea-cta mb-6 shadow-sm">
            <Lock size={28} strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-2xl font-bold text-stockea-navy-950 mb-2">Acceso Administrativo</h1>
          <p className="text-xs text-stockea-text-muted mb-8 tracking-wide">Ingresá tus credenciales de operador STOCKea.</p>

          <form onSubmit={handleLogin} className="space-y-5 text-left">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-widest text-stockea-text-muted block mb-1">Email</label>
              <input 
                type="email" 
                required 
                placeholder="operador@stockea.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-stockea-navy-100/40 border border-stockea-border rounded-lg px-4 py-2.5 text-sm text-stockea-navy-950 outline-none focus:border-stockea-cta transition-colors" 
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-widest text-stockea-text-muted block mb-1">Contraseña</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-stockea-navy-100/40 border border-stockea-border rounded-lg px-4 py-2.5 text-sm text-stockea-navy-950 outline-none focus:border-stockea-cta transition-colors" 
              />
            </div>

            {authError && <span className="text-xs font-semibold text-stockea-alert block">{authError}</span>}

            <button 
              type="submit" 
              className="w-full bg-stockea-navy-950 text-white font-bold text-xs uppercase tracking-widest py-3.5 mt-2 rounded-lg hover:bg-stockea-cta hover:text-stockea-navy-950 transition-colors shadow-sm"
            >
              Ingresar al Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stockea-bg p-4 md:p-10 pt-28 md:pt-32 font-sans selection:bg-stockea-cta selection:text-white">
      <div className="max-w-5xl mx-auto bg-stockea-surface border border-stockea-border shadow-card p-6 md:p-8 rounded-card">

        {/* Encabezado */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border-b border-stockea-border pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stockea-navy-100 flex items-center justify-center text-stockea-cta">
              <Package size={22} strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-stockea-navy-950">Inventario Comercial</h1>
              <p className="text-[11px] text-stockea-text-muted">Gestión de precios por volumen y destacados</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center bg-stockea-navy-100 rounded-pill p-1 flex-1 md:flex-none">
              <button
                onClick={() => setActiveTab('list')}
                className={`flex-1 md:flex-none px-5 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-pill transition-colors ${
                  activeTab === 'list' ? 'bg-stockea-navy-950 text-white shadow-sm' : 'text-stockea-text-muted hover:text-stockea-navy-950'
                }`}
              >
                <List size={13}/> Catálogo
              </button>
              <button
                onClick={handleNewProduct}
                className={`flex-1 md:flex-none px-5 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-pill transition-colors ${
                  activeTab === 'form' ? 'bg-stockea-navy-950 text-white shadow-sm' : 'text-stockea-text-muted hover:text-stockea-navy-950'
                }`}
              >
                <PlusCircle size={13}/> Nuevo
              </button>
            </div>

            <button 
              onClick={() => supabase.auth.signOut()} 
              className="px-4 py-2 text-stockea-alert text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 rounded-pill border border-stockea-alert/20 hover:bg-stockea-alert/10 transition-colors"
            >
              <LogOut size={13}/> Salir
            </button>
          </div>
        </div>

        {success && (
          <div className="mb-6 bg-stockea-success/10 border border-stockea-success/30 text-stockea-success p-4 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <CheckCircle size={16} /> Operación completada con éxito.
          </div>
        )}

        {/* TAB 1: LISTADO */}
        {activeTab === 'list' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-stockea-navy-100 text-stockea-text-muted uppercase tracking-widest text-[9px]">
                <tr>
                  <th className="p-4 font-bold rounded-l-lg">Producto</th>
                  <th className="p-4 font-bold">Categoría</th>
                  <th className="p-4 font-bold">Minorista</th>
                  <th className="p-4 font-bold">Mayorista (1/2/3)</th>
                  <th className="p-4 font-bold">Estado</th>
                  <th className="p-4 font-bold text-right rounded-r-lg">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stockea-border">
                {products.map(prod => (
                  <tr key={prod.id} className="hover:bg-stockea-navy-100/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={prod.image} alt={prod.title} className="w-10 h-12 object-cover rounded-md border border-stockea-border bg-white flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-stockea-navy-950 flex items-center gap-1.5">
                          {prod.title}
                          {prod.isFeatured && <Star size={13} className="text-stockea-cta fill-stockea-cta" />}
                        </span>
                        {prod.sku && <span className="text-[10px] font-mono text-stockea-text-muted">SKU: {prod.sku}</span>}
                      </div>
                    </td>
                    <td className="p-4 text-stockea-text-muted text-xs">{prod.category}</td>
                    <td className="p-4 font-bold text-stockea-navy-950">${prod.retailPrice?.toLocaleString('es-AR')}</td>
                    <td className="p-4 text-xs font-medium text-stockea-text-muted">
                      <span className="text-stockea-navy-950 font-bold">${prod.wholesalePrice?.toLocaleString('es-AR')}</span> / 
                      <span> ${prod.wholesalePriceTier2?.toLocaleString('es-AR')}</span> / 
                      <span className="text-stockea-cta font-bold"> ${prod.wholesalePriceTier3?.toLocaleString('es-AR')}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-pill text-[9px] uppercase tracking-widest font-bold ${
                        prod.stock === 'disponible' ? 'bg-stockea-success/10 text-stockea-success' : 'bg-stockea-alert/10 text-stockea-alert'
                      }`}>
                        {prod.stock}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleEditProduct(prod)} 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-stockea-border text-stockea-navy-950 text-xs font-semibold rounded-md hover:border-stockea-navy-950 hover:bg-white transition-all"
                      >
                        <Edit2 size={12}/> Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: FORMULARIO */}
        {activeTab === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Información y Categoría */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-stockea-text-muted font-bold mb-1.5 block">Nombre del Producto</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({ ...formData, title: e.target.value })} 
                    className="w-full bg-stockea-navy-100/30 border border-stockea-border rounded-lg px-4 py-2.5 text-sm text-stockea-navy-950 outline-none focus:border-stockea-cta transition-colors" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-stockea-text-muted font-bold mb-1.5 block">SKU / Código</label>
                    <input 
                      type="text" 
                      value={formData.sku} 
                      onChange={e => setFormData({ ...formData, sku: e.target.value })} 
                      placeholder="STK-001" 
                      className="w-full bg-stockea-navy-100/30 border border-stockea-border rounded-lg px-4 py-2.5 text-sm text-stockea-navy-950 outline-none focus:border-stockea-cta transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-stockea-text-muted font-bold mb-1.5 block">Categoría</label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full bg-stockea-navy-100/30 border border-stockea-border rounded-lg px-3 py-2.5 text-sm text-stockea-navy-950 outline-none focus:border-stockea-cta transition-colors"
                    >
                      <option value="">Seleccionar...</option>
                      {categoriesList.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Destacado y Stock */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-stockea-text-muted font-bold mb-1.5 block">Disponibilidad</label>
                    <div className="flex items-center gap-1 bg-stockea-navy-100 rounded-pill p-1 w-fit">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, stock: 'disponible' })}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 rounded-pill transition-colors ${
                          formData.stock === 'disponible' ? 'bg-stockea-success text-white shadow-sm' : 'text-stockea-text-muted'
                        }`}
                      >
                        <Check size={11} strokeWidth={2.5} /> Disponible
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, stock: 'agotado' })}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 rounded-pill transition-colors ${
                          formData.stock === 'agotado' ? 'bg-stockea-alert text-white shadow-sm' : 'text-stockea-text-muted'
                        }`}
                      >
                        <X size={11} strokeWidth={2.5} /> Agotado
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-stockea-text-muted font-bold mb-1.5 block">Destacado Home</label>
                    <label className="flex items-center gap-2 cursor-pointer bg-stockea-navy-100/60 border border-stockea-border px-3 py-1.5 rounded-lg">
                      <input 
                        type="checkbox" 
                        checked={formData.destacado} 
                        onChange={e => setFormData({ ...formData, destacado: e.target.checked })} 
                        className="accent-stockea-cta w-4 h-4"
                      />
                      <span className="text-xs font-semibold text-stockea-navy-950 flex items-center gap-1">
                        <Star size={12} className={formData.destacado ? "fill-stockea-cta text-stockea-cta" : "text-stockea-text-muted"} /> Estrella
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Precios Escalonados y Foto */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-stockea-text-muted font-bold mb-1.5 block">Precio Minorista ($ ARS)</label>
                  <input 
                    required 
                    type="number" 
                    value={formData.retailPrice} 
                    onChange={e => setFormData({ ...formData, retailPrice: e.target.value })} 
                    className="w-full bg-stockea-navy-100/30 border border-stockea-border rounded-lg px-4 py-2.5 text-sm font-semibold text-stockea-navy-950 outline-none focus:border-stockea-cta transition-colors" 
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[9px] uppercase tracking-wider text-stockea-text-muted font-bold mb-1 block">Mayorista 1 (x3+)</label>
                    <input 
                      required 
                      type="number" 
                      value={formData.wholesalePrice1} 
                      onChange={e => setFormData({ ...formData, wholesalePrice1: e.target.value })} 
                      className="w-full bg-stockea-navy-100/30 border border-stockea-border rounded-lg px-3 py-2 text-xs font-semibold text-stockea-navy-950 outline-none focus:border-stockea-cta" 
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-wider text-stockea-text-muted font-bold mb-1 block">Mayorista 2 (x6+)</label>
                    <input 
                      required 
                      type="number" 
                      value={formData.wholesalePrice2} 
                      onChange={e => setFormData({ ...formData, wholesalePrice2: e.target.value })} 
                      className="w-full bg-stockea-navy-100/30 border border-stockea-border rounded-lg px-3 py-2 text-xs font-semibold text-stockea-navy-950 outline-none focus:border-stockea-cta" 
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-wider text-stockea-text-muted font-bold mb-1 block">Mayorista 3 (x12+)</label>
                    <input 
                      required 
                      type="number" 
                      value={formData.wholesalePrice3} 
                      onChange={e => setFormData({ ...formData, wholesalePrice3: e.target.value })} 
                      className="w-full bg-stockea-navy-100/30 border border-stockea-border rounded-lg px-3 py-2 text-xs font-semibold text-stockea-navy-950 outline-none focus:border-stockea-cta" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-stockea-text-muted font-bold mb-1.5 block">Fotografía del Producto</label>
                  <div className="relative border-2 border-dashed border-stockea-border bg-stockea-navy-100/30 h-32 flex flex-col items-center justify-center cursor-pointer overflow-hidden rounded-card hover:border-stockea-cta transition-colors">
                    <input 
                      required={!formData.id && !imagePreview} 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    />
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-contain p-2" alt="Vista previa" />
                    ) : (
                      <div className="text-center text-stockea-text-muted">
                        <ImageIcon size={24} className="mx-auto mb-1 opacity-50" />
                        <span className="text-[11px] font-medium">Click para cargar imagen</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            <button 
              disabled={isSubmitting} 
              type="submit" 
              className="w-full bg-stockea-navy-950 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-lg hover:bg-stockea-cta hover:text-stockea-navy-950 transition-colors flex items-center justify-center gap-2 mt-8 disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Guardando en Supabase...
                </>
              ) : (
                formData.id ? 'Actualizar Producto' : 'Guardar en Catálogo'
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};