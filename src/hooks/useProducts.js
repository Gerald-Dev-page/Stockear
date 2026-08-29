import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('productos')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("Error cargando productos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading };
};