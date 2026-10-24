import { useState, useEffect, useMemo } from 'react';
import { Package, CheckCircle, Image as ImageIcon, LogOut, List, PlusCircle, Edit2, Check, X, Loader2, Star, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useProducts } from '../hooks/useProducts';
import { AdminLogin } from '../components/admin/AdminLogin';

export const Admin = () => {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      const { data, error } = await supabase.from('categorias').select('id, nombre').order('nombre');
      if (!error && data) setCategoriesList(data);
    };
    loadCategories();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // Filtrado y paginado del panel
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
        const { error } = await supabase.from('productos').update(productData).eq('id_producto', formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('productos').insert([productData]);
        if (error) throw error;
      }

      setSuccess(true);
      if (refetch) refetch();

      setTimeout(() => {
        setSuccess(false);
        handleNewProduct();
        setActiveTab('list');
      }, 1000);

    } catch (error) {
      console.error(error);
      alert("Hubo un error al guardar el producto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return <AdminLogin onLoginSuccess={(s) => setSession(s)} />;
  }

  return (
    <div className="min-h-screen bg-stockea-bg p-4 md:p-8 pt-24 md:pt-28 font-sans">
      <div className="max-w-6xl mx-auto bg-stockea-surface border border-stockea-border shadow-card p-6 md:p-8 rounded-card">

        {/* Encabezado */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border-b border-stockea-border pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stockea-green-soft flex items-center justify-center text-stockea-green">
              <Package size={22} />
            </div>
            <div>
              <h1 className="font-display text-xl font-black text-stockea-green">Gestión de Catálogo</h1>
              <p className="text-[11px] text-stockea-graphite-muted">Administración comercial en tiempo real</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex bg-stockea-green-soft rounded-pill p-1 flex-1 md:flex-none">
              <button
                onClick={() => setActiveTab('list')}
                className={`flex-1 md:flex-none px-4 py-1.5 text-[10px] font-bold uppercase rounded-pill transition-colors ${
                  activeTab === 'list' ? 'bg-stockea-green text-white' : 'text-stockea-graphite-muted hover:text-stockea-green'
                }`}
              >
                <List size={13} className="inline mr-1" /> Catálogo
              </button>
              <button
                onClick={handleNewProduct}
                className={`flex-1 md:flex-none px-4 py-1.5 text-[10px] font-bold uppercase rounded-pill transition-colors ${
                  activeTab === 'form' ? 'bg-stockea-green text-white' : 'text-stockea-graphite-muted hover:text-stockea-green'
                }`}
              >
                <PlusCircle size={13} className="inline mr-1" /> Nuevo
              </button>
            </div>

            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 text-stockea-alert border border-stockea-alert/30 text-[10px] font-bold uppercase rounded-pill hover:bg-red-50 flex items-center gap-1"
            >
              <LogOut size={13} /> Salir
            </button>
          </div>
        </div>

        {success && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs font-bold flex items-center gap-2">
            <CheckCircle size={16} /> Operación guardada con éxito en la base de datos.
          </div>
        )}

        {/* TAB 1: LISTADO PAGINADO */}
        {activeTab === 'list' && (
          <div>
            <div className="flex justify-between items-center mb-4 gap-4">
              <div className="relative w-full max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stockea-graphite-muted" />
                <input
                  type="text"
                  placeholder="Filtrar por nombre, SKU o categoría..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-stockea-bg border border-stockea-border rounded-pill pl-9 pr-3 py-1.5 text-xs outline-none focus:border-stockea-orange"
                />
              </div>
              <span className="text-[11px] text-stockea-graphite-muted font-mono">{filteredProducts.length} productos</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-stockea-green-soft text-stockea-graphite-muted uppercase tracking-widest text-[9px]">
                  <tr>
                    <th className="p-3.5 font-bold rounded-l-lg">Producto</th>
                    <th className="p-3.5 font-bold">Categoría</th>
                    <th className="p-3.5 font-bold">Minorista</th>
                    <th className="p-3.5 font-bold">Mayorista (1/2/3)</th>
                    <th className="p-3.5 font-bold">Estado</th>
                    <th className="p-3.5 font-bold text-right rounded-r-lg">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stockea-border">
                  {paginatedProducts.map(prod => (
                    <tr key={prod.id} className="hover:bg-stockea-green-soft/20 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <img src={prod.image} alt={prod.title} className="w-9 h-11 object-cover rounded border border-stockea-border bg-white" />
                        <div>
                          <span className="font-semibold text-stockea-green flex items-center gap-1.5">
                            {prod.title}
                            {prod.isFeatured && <Star size={12} className="text-stockea-orange fill-stockea-orange" />}
                          </span>
                          {prod.sku && <span className="text-[10px] font-mono text-stockea-graphite-muted">{prod.sku}</span>}
                        </div>
                      </td>
                      <td className="p-3.5 text-xs text-stockea-graphite-muted">{prod.category}</td>
                      <td className="p-3.5 font-bold text-stockea-graphite">${prod.retailPrice?.toLocaleString('es-AR')}</td>
                      <td className="p-3.5 text-xs">
                        <span className="text-stockea-green font-bold">${prod.wholesalePrice?.toLocaleString('es-AR')}</span> / 
                        <span> ${prod.wholesalePriceTier2?.toLocaleString('es-AR')}</span> / 
                        <span className="text-stockea-orange font-bold"> ${prod.wholesalePriceTier3?.toLocaleString('es-AR')}</span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-pill text-[9px] font-bold uppercase ${
                          prod.stock === 'disponible' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-stockea-alert'
                        }`}>
                          {prod.stock}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleEditProduct(prod)}
                          className="px-2.5 py-1 border border-stockea-border rounded text-xs hover:border-stockea-green text-stockea-green"
                        >
                          <Edit2 size={12} className="inline mr-1" /> Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación de la tabla */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-stockea-border pt-4 mt-4 text-xs">
                <span className="text-stockea-graphite-muted">Página {currentPage} de {totalPages}</span>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="p-1.5 border border-stockea-border rounded hover:border-stockea-green disabled:opacity-30"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="p-1.5 border border-stockea-border rounded hover:border-stockea-green disabled:opacity-30"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FORMULARIO */}
        {activeTab === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-stockea-graphite-muted font-bold block mb-1">Nombre</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-stockea-bg border border-stockea-border rounded-lg px-3 py-2 text-sm outline-none focus:border-stockea-orange"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-stockea-graphite-muted font-bold block mb-1">SKU</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={e => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="STK-01"
                      className="w-full bg-stockea-bg border border-stockea-border rounded-lg px-3 py-2 text-sm outline-none focus:border-stockea-orange"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-stockea-graphite-muted font-bold block mb-1">Rubro</label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full bg-stockea-bg border border-stockea-border rounded-lg px-3 py-2 text-sm outline-none focus:border-stockea-orange"
                    >
                      <option value="">Seleccionar...</option>
                      {categoriesList.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-stockea-graphite-muted font-bold block mb-1">Stock</label>
                    <div className="flex gap-1 bg-stockea-green-soft rounded-pill p-1">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, stock: 'disponible' })}
                        className={`px-3 py-1 text-[10px] font-bold uppercase rounded-pill ${
                          formData.stock === 'disponible' ? 'bg-stockea-green text-white' : 'text-stockea-graphite-muted'
                        }`}
                      >
                        <Check size={11} className="inline mr-1" /> Disponible
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, stock: 'agotado' })}
                        className={`px-3 py-1 text-[10px] font-bold uppercase rounded-pill ${
                          formData.stock === 'agotado' ? 'bg-stockea-alert text-white' : 'text-stockea-graphite-muted'
                        }`}
                      >
                        <X size={11} className="inline mr-1" /> Agotado
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-stockea-graphite-muted font-bold block mb-1">Destacado</label>
                    <label className="flex items-center gap-2 cursor-pointer bg-stockea-bg border border-stockea-border px-3 py-1.5 rounded-lg">
                      <input
                        type="checkbox"
                        checked={formData.destacado}
                        onChange={e => setFormData({ ...formData, destacado: e.target.checked })}
                        className="accent-stockea-orange w-4 h-4"
                      />
                      <span className="text-xs font-semibold text-stockea-green flex items-center gap-1">
                        <Star size={12} className={formData.destacado ? "fill-stockea-orange text-stockea-orange" : "text-stockea-graphite-muted"} /> Estrella
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-stockea-graphite-muted font-bold block mb-1">Precio Minorista ($)</label>
                  <input
                    required
                    type="number"
                    value={formData.retailPrice}
                    onChange={e => setFormData({ ...formData, retailPrice: e.target.value })}
                    className="w-full bg-stockea-bg border border-stockea-border rounded-lg px-3 py-2 text-sm outline-none focus:border-stockea-orange font-bold text-stockea-graphite"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-bold text-stockea-graphite-muted block mb-1">Mayorista 1 (x3+)</label>
                    <input
                      required
                      type="number"
                      value={formData.wholesalePrice1}
                      onChange={e => setFormData({ ...formData, wholesalePrice1: e.target.value })}
                      className="w-full bg-stockea-bg border border-stockea-border rounded-lg px-2 py-1.5 text-xs outline-none focus:border-stockea-orange"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-bold text-stockea-graphite-muted block mb-1">Mayorista 2 (x6+)</label>
                    <input
                      required
                      type="number"
                      value={formData.wholesalePrice2}
                      onChange={e => setFormData({ ...formData, wholesalePrice2: e.target.value })}
                      className="w-full bg-stockea-bg border border-stockea-border rounded-lg px-2 py-1.5 text-xs outline-none focus:border-stockea-orange"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-bold text-stockea-graphite-muted block mb-1">Mayorista 3 (x12+)</label>
                    <input
                      required
                      type="number"
                      value={formData.wholesalePrice3}
                      onChange={e => setFormData({ ...formData, wholesalePrice3: e.target.value })}
                      className="w-full bg-stockea-bg border border-stockea-border rounded-lg px-2 py-1.5 text-xs outline-none focus:border-stockea-orange"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-stockea-graphite-muted font-bold block mb-1">Foto del Producto</label>
                  <div className="relative border-2 border-dashed border-stockea-border bg-stockea-bg h-32 flex flex-col items-center justify-center rounded-card hover:border-stockea-orange transition-colors">
                    <input
                      required={!formData.id && !imagePreview}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-contain p-2" alt="Vista previa" />
                    ) : (
                      <div className="text-center text-stockea-graphite-muted">
                        <ImageIcon size={22} className="mx-auto mb-1 opacity-50" />
                        <span className="text-[11px]">Click o arrastrá una imagen</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-stockea-orange hover:bg-stockea-orange-hover text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : (formData.id ? 'Actualizar Producto' : 'Crear Producto')}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};