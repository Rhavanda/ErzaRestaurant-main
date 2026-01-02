import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            console.log('Products fetch result:', { data, error });

            if (error) {
                console.error('Error fetching products:', error);
                setError(error.message);
                setProducts([]);
            } else {
                const mappedData: Product[] = (data || []).map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: item.image_url,
                    category: item.category,
                    calories: item.calories,
                }));
                setProducts(mappedData);
            }
        } catch (err: any) {
            console.error('Exception fetching products:', err);
            setError(err.message);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return { products, loading, error, refetch: fetchProducts };
};
