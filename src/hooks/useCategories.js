import { useState, useEffect } from 'react';
import { useProducts } from './useProducts';

export const useCategories = () => {
  const { products, loading: productsLoading } = useProducts();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Solo procesamos cuando los productos ya terminaron de cargar
    if (!productsLoading) {
      // 1. Extraemos los nombres de las categorías sin repetir
      const uniqueNames = [...new Set(products.map(p => p.category).filter(Boolean))];
      
      // 2. Armamos el objeto con nombre, slug y una imagen de prueba automática
      const formattedCategories = uniqueNames.map((name, index) => ({
        id: index,
        name: name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        // Genera una imagen aleatoria pero fija basada en el nombre de la categoría
        image: `https://picsum.photos/seed/${name.replace(/\s+/g, '')}/400/400`
      }));

      setCategories(formattedCategories);
      setLoading(false);
    }
  }, [products, productsLoading]);

  return { categories, loading };
};