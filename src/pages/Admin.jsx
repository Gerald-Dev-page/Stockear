import { useState, useEffect, useMemo } from 'react';
import { Package, CheckCircle, Image as ImageIcon, LogOut, List, PlusCircle, Edit2, Check, X, Loader2, Star, Search, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useProducts } from '../hooks/useProducts';
import { AdminLogin } from '../components/admin/AdminLogin';

export const Admin = () => {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [activeSubTab, setActiveSubTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Estados para productos
  const [imagePreviews, setImagePreviews] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]);

  // Estados para categorías/rubros
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ nombre: '', imagen_url: '', posicion_imagen: 'center' });
  const [categoryImagePreview, setCategoryImagePreview] = useState(null);
  const [categoryFileToUpload, setCategoryFileToUpload] = useState(null);

  const { products, refetch } = useProducts();
  const [categoriesList, setCategoriesList] = useState([]);

  const [formData, setFormData] = useState({
    id: null,
    title: '',
    retailPrice: '',
    wholesalePrice1: '',
    wholesalePrice2: '',
    wholesalePrice3: '',
    category_ids: [],
    stock: 'disponible',
    sku: '',
    description: '',
    characteristics: '',
    destacado: false
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadCategories = async () => {
    const { data, error } = await supabase.from('categorias').select('*').order('nombre');
    if (!error && data) setCategoriesList(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return products.filter(p => 
      p.title?.toLowerCase().includes(term) ||
      p.sku?.toLowerCase().includes(term) ||
      p.category?.toLowerCase().includes(term) ||
      p.categories?.some(cat => cat.toLowerCase().includes(term))
    );
  }, [products, searchTerm]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleEditProduct = (product) => {
    // Recupera todos los IDs de categorías asociadas (desde categoryIds o buscando por nombre)
    let initialCatIds = Array.isArray(product.categoryIds) && product.categoryIds.length > 0
      ? product.categoryIds.map(Number)
      : [];

    if (initialCatIds.length === 0 && product.categoryId) {
      initialCatIds = [Number(product.categoryId)];
    }

    if (initialCatIds.length === 0 && Array.isArray(product.categories)) {
      initialCatIds = categoriesList
        .filter(c => product.categories.includes(c.nombre))
        .map(c => Number(c.id));
    }

    setFormData({
      id: product.id,
      title: product.title,
      retailPrice: product.retailPrice,
      wholesalePrice1: product.wholesalePrice,
      wholesalePrice2: product.wholesalePriceTier2,
      wholesalePrice3: product.wholesalePriceTier3,
      category_ids: initialCatIds,
      stock: product.stock === 'agotado' ? 'agotado' : 'disponible',
      sku: product.sku || '',
      description: product.description || '',
      characteristics: product.characteristics || '',
      destacado: Boolean(product.isFeatured)
    });
    setImagePreviews(product.images || [product.image]);
    setFilesToUpload([]);
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
      category_ids: categoriesList[0]?.id ? [Number(categoriesList[0].id)] : [],
      stock: 'disponible',
      sku: '',
      description: '',
      characteristics: '',
      destacado: false
    });
    setImagePreviews([]);
    setFilesToUpload([]);
    setActiveTab('form');
  };

  const toggleCategorySelection = (catId) => {
    const numericId = Number(catId);
    setFormData(prev => {
      const exists = prev.category_ids.includes(numericId);
      const updated = exists
        ? prev.category_ids.filter(id => id !== numericId)
        : [...prev.category_ids, numericId];
      return { ...prev, category_ids: updated };
    });
  };

  const handleImagesChange = (e) => {
    const chosenFiles = Array.from(e.target.files);
    if (chosenFiles.length === 0) return;

    const newPreviews = chosenFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setFilesToUpload(prev => [...prev, ...chosenFiles]);
  };

  const removeImagePreview = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFilesToUpload(prev => prev.filter((_, i) => i !== index));
  };

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCategoryImagePreview(URL.createObjectURL(file));
    setCategoryFileToUpload(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imagePreviews.length === 0) return alert("Seleccioná al menos una imagen para el producto.");
    if (formData.category_ids.length === 0) return alert("Seleccioná al menos un rubro/categoría para el producto.");
    
    setIsSubmitting(true);

    try {
      let finalUrls = [...imagePreviews.filter(url => url.startsWith('http'))];

      for (const file of filesToUpload) {
        const fileName = `prod_${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;
        const { error: uploadError } = await supabase.storage
          .from('fotos_stockea')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('fotos_stockea')
          .getPublicUrl(fileName);

        finalUrls.push(data.publicUrl);
      }

      const primaryCategoryId = formData.category_ids[0] || null;

      const productData = {
        nombre: formData.title,
        sku: formData.sku || null,
        descripcion: formData.description || '',
        caracteristicas: formData.characteristics || '',
        precio_venta: Number(formData.retailPrice),
        precio_mayorista_1: Number(formData.wholesalePrice1),
        precio_mayorista_2: Number(formData.wholesalePrice2 || formData.wholesalePrice1),
        precio_mayorista_3: Number(formData.wholesalePrice3 || formData.wholesalePrice2 || formData.wholesalePrice1),
        categoria_id: primaryCategoryId,
        activo: true,
        destacado: formData.destacado,
        fotos: finalUrls
      };

      let savedProductId = formData.id;

      if (formData.id) {
        // Al editar, no pisamos stock_actual para respetar el inventario real compartido
        const { error } = await supabase
          .from('productos')
          .update(productData)
          .eq('id_producto', formData.id);
        if (error) throw error;
      } else {
        // Solo al crear un producto nuevo asignamos stock inicial
        const newProductPayload = {
          ...productData,
          stock_actual: formData.stock === 'disponible' ? 10 : 0
        };
        const { data: insertedData, error } = await supabase
          .from('productos')
          .insert([newProductPayload])
          .select('id_producto')
          .single();
        if (error) throw error;
        savedProductId = insertedData.id_producto;
      }

      // Sincronizar múltiples categorías en la tabla intermedia producto_categorias
      if (savedProductId) {
        const { error: deleteRelError } = await supabase
          .from('producto_categorias')
          .delete()
          .eq('id_producto', savedProductId);
        if (deleteRelError) throw deleteRelError;

        const relacionesAInsertar = formData.category_ids.map(catId => ({
          id_producto: savedProductId,
          categoria_id: Number(catId)
        }));

        if (relacionesAInsertar.length > 0) {
          const { error: insertRelError } = await supabase
            .from('producto_categorias')
            .insert(relacionesAInsertar);
          if (insertRelError) throw insertRelError;
        }
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
      alert("Hubo un error al guardar el producto: " + (error.message || ''));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.nombre) return;

    try {
      let finalCategoryImg = categoryForm.imagen_url;

      if (categoryFileToUpload) {
        const fileName = `cat_${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;
        const { error: uploadError } = await supabase.storage
          .from('fotos_stockea')
          .upload(fileName, categoryFileToUpload);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('fotos_stockea')
          .getPublicUrl(fileName);

        finalCategoryImg = data.publicUrl;
      }

      const payload = {
        nombre: categoryForm.nombre,
        imagen_url: finalCategoryImg,
        posicion_imagen: categoryForm.posicion_imagen || 'center'
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('categorias')
          .update(payload)
          .eq('id', editingCategory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categorias')
          .insert([payload]);
        if (error) throw error;
      }

      setCategoryModalOpen(false);
      setEditingCategory(null);
      setCategoryForm({ nombre: '', imagen_url: '', posicion_imagen: 'center' });
      setCategoryImagePreview(null);
      setCategoryFileToUpload(null);
      loadCategories();
      if (refetch) refetch();
    } catch (err) {
      console.error("Error detallado al guardar categoría:", err.message || err);
      alert("No se pudo guardar el rubro. Verificá los permisos del bucket Storage en Supabase.");
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
              <h1 className="font-display text-xl font-black text-stockea-green">Gestión de Catálogo & Rubros</h1>
              <p className="text-[11px] text-stockea-graphite-muted">Panel de administración comercial</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex bg-stockea-green-soft rounded-pill p-1 flex-1 md:flex-none">
              <button
                onClick={() => { setActiveTab('list'); setActiveSubTab('products'); }}
                className={`flex-1 md:flex-none px-4 py-1.5 text-[10px] font-bold uppercase rounded-pill transition-colors ${
                  activeTab === 'list' && activeSubTab === 'products' ? 'bg-stockea-green text-white' : 'text-stockea-graphite-muted hover:text-stockea-green'
                }`}
              >
                <List size={13} className="inline mr-1" /> Productos
              </button>
              <button
                onClick={() => { setActiveTab('list'); setActiveSubTab('categories'); }}
                className={`flex-1 md:flex-none px-4 py-1.5 text-[10px] font-bold uppercase rounded-pill transition-colors ${
                  activeTab === 'list' && activeSubTab === 'categories' ? 'bg-stockea-green text-white' : 'text-stockea-graphite-muted hover:text-stockea-green'
                }`}
              >
                <Layers size={13} className="inline mr-1" /> Rubros / Categorías
              </button>
              <button
                onClick={handleNewProduct}
                className={`flex-1 md:flex-none px-4 py-1.5 text-[10px] font-bold uppercase rounded-pill transition-colors ${
                  activeTab === 'form' ? 'bg-stockea-green text-white' : 'text-stockea-graphite-muted hover:text-stockea-green'
                }`}
              >
                <PlusCircle size={13} className="inline mr-1" /> Nuevo Producto
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

        {/* TAB 1A: LISTADO DE PRODUCTOS */}
        {activeTab === 'list' && activeSubTab === 'products' && (
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
                    <th className="p-3.5 font-bold">Categorías</th>
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
                      <td className="p-3.5 text-xs text-stockea-graphite-muted">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {(prod.categories && prod.categories.length > 0 ? prod.categories : [prod.category]).map((catName, idx) => (
                            <span 
                              key={idx} 
                              className="bg-stockea-green-soft text-stockea-green px-2 py-0.5 rounded-pill text-[10px] font-semibold"
                            >
                              {catName}
                            </span>
                          ))}
                        </div>
                      </td>
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
                          {prod.stock} ({prod.stockQuantity ?? 0})
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

        {/* TAB 1B: LISTADO DE CATEGORÍAS / RUBROS CON IMAGEN */}
        {activeTab === 'list' && activeSubTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-base text-stockea-green">Rubros y Familias de Artículos</h3>
              <button
                onClick={() => { 
                  setEditingCategory(null); 
                  setCategoryForm({ nombre: '', imagen_url: '', posicion_imagen: 'center' }); 
                  setCategoryImagePreview(null);
                  setCategoryFileToUpload(null);
                  setCategoryModalOpen(true); 
                }}
                className="bg-stockea-orange hover:bg-stockea-orange-hover text-white text-xs font-bold uppercase px-4 py-2 rounded-pill transition-colors flex items-center gap-1.5"
              >
                <PlusCircle size={14} /> Nuevo Rubro
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categoriesList.map(cat => (
                <div key={cat.id} className="bg-stockea-bg border border-stockea-border rounded-card overflow-hidden flex flex-col justify-between">
                  <div className="relative h-32 bg-stockea-green-soft">
                    {cat.imagen_url ? (
                      <img 
                        src={cat.imagen_url} 
                        alt={cat.nombre} 
                        className="w-full h-full object-cover" 
                        style={{ objectPosition: cat.posicion_imagen || 'center' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stockea-graphite-muted text-xs">Sin imagen</div>
                    )}
                    <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-pill font-bold">
                      {cat.nombre}
                    </span>
                  </div>
                  <div className="p-3 flex justify-between items-center bg-stockea-surface">
                    <span className="text-xs font-bold text-stockea-green truncate">{cat.nombre}</span>
                    <button
                      onClick={() => { 
                        setEditingCategory(cat); 
                        setCategoryForm({ 
                          nombre: cat.nombre, 
                          imagen_url: cat.imagen_url || '',
                          posicion_imagen: cat.posicion_imagen || 'center'
                        }); 
                        setCategoryImagePreview(cat.imagen_url || null);
                        setCategoryFileToUpload(null);
                        setCategoryModalOpen(true); 
                      }}
                      className="px-2.5 py-1 border border-stockea-border rounded text-xs hover:border-stockea-green text-stockea-green flex items-center gap-1"
                    >
                      <Edit2 size={11} /> Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: FORMULARIO DE PRODUCTO */}
        {activeTab === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-stockea-graphite-muted font-bold block mb-1">Nombre del Producto</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-stockea-bg border border-stockea-border rounded-lg px-3 py-2 text-sm outline-none focus:border-stockea-orange"
                  />
                </div>

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

                {/* SELECTOR MÚLTIPLE DE RUBROS / CATEGORÍAS */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-stockea-graphite-muted font-bold">
                      Rubros / Categorías (Podés elegir más de uno)
                    </label>
                    <span className="text-[10px] font-semibold text-stockea-orange">
                      {formData.category_ids.length} seleccionado(s)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-stockea-bg border border-stockea-border rounded-lg p-3 max-h-40 overflow-y-auto">
                    {categoriesList.map(cat => {
                      const isChecked = formData.category_ids.includes(Number(cat.id));
                      return (
                        <label
                          key={cat.id}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-stockea-green-soft border-stockea-green text-stockea-green font-bold'
                              : 'bg-stockea-surface border-stockea-border text-stockea-graphite hover:border-stockea-green/50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCategorySelection(cat.id)}
                            className="accent-stockea-green w-3.5 h-3.5 rounded"
                          />
                          <span className="truncate">{cat.nombre}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-stockea-graphite-muted font-bold block mb-1">Descripción General</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detalles principales del artículo..."
                    className="w-full bg-stockea-bg border border-stockea-border rounded-lg px-3 py-2 text-xs outline-none focus:border-stockea-orange resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-stockea-graphite-muted font-bold block mb-1">Características (Especificaciones / Materiales)</label>
                  <textarea
                    rows="3"
                    value={formData.characteristics}
                    onChange={e => setFormData({ ...formData, characteristics: e.target.value })}
                    placeholder="Ej: Material ABS, Medidas 20x10cm, Origen China..."
                    className="w-full bg-stockea-bg border border-stockea-border rounded-lg px-3 py-2 text-xs outline-none focus:border-stockea-orange resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {!formData.id && (
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-stockea-graphite-muted font-bold block mb-1">Stock Inicial</label>
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
                  )}

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

                {/* Galería de Imágenes */}
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-stockea-graphite-muted font-bold block mb-1">Galería de Imágenes (Múltiples fotos)</label>
                  <div className="relative border-2 border-dashed border-stockea-border bg-stockea-bg p-4 flex flex-col items-center justify-center rounded-card hover:border-stockea-orange transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImagesChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="text-center text-stockea-graphite-muted">
                      <ImageIcon size={22} className="mx-auto mb-1 opacity-50" />
                      <span className="text-[11px]">Click o arrastrá imágenes para la galería</span>
                    </div>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group aspect-square bg-stockea-bg border border-stockea-border rounded-lg overflow-hidden">
                          <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                          <button
                            type="button"
                            onClick={() => removeImagePreview(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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

        {/* MODAL EDITAR / CREAR CATEGORÍA CON PREVISUALIZACIÓN Y ENCUADRE */}
        {categoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-stockea-surface border border-stockea-border rounded-card p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-4 border-b border-stockea-border pb-3">
                <h3 className="font-display font-bold text-base text-stockea-green">
                  {editingCategory ? 'Editar Rubro' : 'Nuevo Rubro'}
                </h3>
                <button onClick={() => setCategoryModalOpen(false)} className="text-stockea-graphite-muted hover:text-stockea-green">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-stockea-graphite-muted font-bold block mb-1">Nombre del Rubro</label>
                  <input
                    required
                    type="text"
                    value={categoryForm.nombre}
                    onChange={e => setCategoryForm({ ...categoryForm, nombre: e.target.value })}
                    placeholder="Ej: Camping, Cocina..."
                    className="w-full bg-stockea-bg border border-stockea-border rounded-lg px-3 py-2 text-sm outline-none focus:border-stockea-orange"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-stockea-graphite-muted font-bold block mb-1">Imagen Ilustrativa del Rubro</label>
                  <div className="relative border-2 border-dashed border-stockea-border bg-stockea-bg h-32 flex flex-col items-center justify-center rounded-card hover:border-stockea-orange transition-colors overflow-hidden">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCategoryImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    {categoryImagePreview ? (
                      <img 
                        src={categoryImagePreview} 
                        className="w-full h-full object-cover" 
                        style={{ objectPosition: categoryForm.posicion_imagen || 'center' }}
                        alt="Rubro Preview"
                      />
                    ) : (
                      <div className="text-center text-stockea-graphite-muted">
                        <ImageIcon size={20} className="mx-auto mb-1 opacity-50" />
                        <span className="text-[11px]">Click o arrastrá una imagen</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Selector de encuadre / posición de la imagen */}
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-stockea-graphite-muted font-bold block mb-1">Encuadre de la imagen en la tarjeta</label>
                  <select
                    value={categoryForm.posicion_imagen || 'center'}
                    onChange={e => setCategoryForm({ ...categoryForm, posicion_imagen: e.target.value })}
                    className="w-full bg-stockea-bg border border-stockea-border rounded-lg px-3 py-2 text-xs outline-none focus:border-stockea-orange"
                  >
                    <option value="center">Centrado (Por defecto)</option>
                    <option value="top">Arriba</option>
                    <option value="bottom">Abajo</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-stockea-orange hover:bg-stockea-orange-hover text-white font-bold text-xs uppercase tracking-widest py-3 rounded-lg transition-colors"
                >
                  Guardar Rubro
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};