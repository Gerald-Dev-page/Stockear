import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data, error: err } = await supabase
        .from('productos')
        .select(`
          id_producto,
          sku,
          nombre,
          descripcion,
          fotos,
          precio_venta,
          precio_mayorista_1,
          precio_mayorista_2,
          precio_mayorista_3,
          stock_actual,
          stock_minimo,
          activo,
          destacado,
          categorias ( id, nombre )
        `)
        .eq('activo', true)
        .order('id_producto', { ascending: false });

      if (err) throw err;

      const formatted = (data || []).map((p) => {
        const fotoPrincipal = Array.isArray(p.fotos) && p.fotos.length > 0 
          ? p.fotos[0] 
          : 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop';

        const retailPrice = Number(p.precio_venta || 0);
        const wholesale1 = Number(p.precio_mayorista_1 || 0) || retailPrice;
        const wholesale2 = Number(p.precio_mayorista_2 || 0) || wholesale1;
        const wholesale3 = Number(p.precio_mayorista_3 || 0) || wholesale2;

        return {
          id: p.id_producto,
          sku: p.sku,
          title: p.nombre,
          description: p.descripcion || '',
          retailPrice,
          wholesalePrice: wholesale1,
          wholesalePriceTier2: wholesale2,
          wholesalePriceTier3: wholesale3,
          minWholesaleQty: 3,
          minTier2Qty: 6,
          minTier3Qty: 12,
          stock: p.stock_actual > 0 ? (p.stock_actual <= (p.stock_minimo || 2) ? 'low' : 'disponible') : 'agotado',
          stockQuantity: p.stock_actual,
          category: p.categorias?.nombre || 'General',
          categoryId: p.categorias?.id || null,
          image: fotoPrincipal,
          images: Array.isArray(p.fotos) ? p.fotos : [fotoPrincipal],
          isFeatured: Boolean(p.destacado)
        };
      });

      setProducts(formatted);
    } catch (err) {
      console.error('Error al consultar productos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
};