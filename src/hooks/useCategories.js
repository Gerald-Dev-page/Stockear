import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) throw error;

      const formatted = (data || []).map((c) => ({
        id: c.id,
        name: c.nombre,
        slug: c.nombre.toLowerCase().replace(/\s+/g, '-'),
        image: c.imagen_url || null, // <--- Aquí leemos la imagen real de la base de datos
        position: c.posicion_imagen || 'center' // Para el encuadre si lo usamos
      }));

      setCategories(formatted);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, refetch: fetchCategories };
};