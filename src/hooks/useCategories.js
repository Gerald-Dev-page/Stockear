import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('categorias')
          .select('id, nombre')
          .order('nombre', { ascending: true });

        if (error) throw error;

        const formatted = (data || []).map((c) => ({
          id: c.id,
          name: c.nombre,
          slug: c.nombre.toLowerCase().replace(/\s+/g, '-'),
          image: 'https://images.unsplash.com/photo-1591557304192-36c57fbc82ce?q=80&w=600&auto=format&fit=crop'
        }));

        setCategories(formatted);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
};