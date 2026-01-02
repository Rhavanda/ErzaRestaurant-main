import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { CartItem, Product } from '../types';

interface CartItemDB {
    id: string;
    user_id: string;
    product_id: string;
    quantity: number;
    notes: string | null;
    products: {
        id: string;
        name: string;
        description: string;
        price: number;
        image_url: string;
        category: string;
        calories: number | null;
    };
}

export const useCart = () => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch cart from database
    const fetchCart = useCallback(async () => {
        if (!user) {
            setCartItems([]);
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('carts')
                .select(`
                    id,
                    user_id,
                    product_id,
                    quantity,
                    notes,
                    products (
                        id,
                        name,
                        description,
                        price,
                        image_url,
                        category,
                        calories
                    )
                `)
                .eq('user_id', user.id);

            if (error) {
                console.error('Error fetching cart:', error);
                return;
            }

            if (data) {
                const items: CartItem[] = (data as unknown as CartItemDB[]).map(item => ({
                    id: item.products.id,
                    name: item.products.name,
                    description: item.products.description,
                    price: item.products.price,
                    image: item.products.image_url,
                    category: item.products.category as 'makanan' | 'minuman' | 'snack',
                    calories: item.products.calories || undefined,
                    quantity: item.quantity,
                    notes: item.notes || undefined
                }));
                setCartItems(items);
            }
        } catch (err) {
            console.error('Error in fetchCart:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Fetch cart when user changes
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Add item to cart
    const addToCart = async (product: Product) => {
        if (!user) return false;

        try {
            // Check if already in cart
            const existingItem = cartItems.find(item => item.id === product.id);

            if (existingItem) {
                // Update quantity
                const { error } = await supabase
                    .from('carts')
                    .update({
                        quantity: existingItem.quantity + 1,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', user.id)
                    .eq('product_id', product.id);

                if (error) throw error;

                setCartItems(prev => prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ));
            } else {
                // Add new item
                const { error } = await supabase
                    .from('carts')
                    .insert({
                        user_id: user.id,
                        product_id: product.id,
                        quantity: 1
                    });

                if (error) throw error;

                setCartItems(prev => [...prev, { ...product, quantity: 1 }]);
            }

            return true;
        } catch (err) {
            console.error('Error adding to cart:', err);
            return false;
        }
    };

    // Update quantity
    const updateQuantity = async (productId: string, delta: number) => {
        if (!user) return;

        const item = cartItems.find(item => item.id === productId);
        if (!item) return;

        const newQuantity = item.quantity + delta;

        if (newQuantity <= 0) {
            await removeItem(productId);
            return;
        }

        try {
            const { error } = await supabase
                .from('carts')
                .update({
                    quantity: newQuantity,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', user.id)
                .eq('product_id', productId);

            if (error) throw error;

            setCartItems(prev => prev.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        } catch (err) {
            console.error('Error updating quantity:', err);
        }
    };

    // Remove item
    const removeItem = async (productId: string) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('carts')
                .delete()
                .eq('user_id', user.id)
                .eq('product_id', productId);

            if (error) throw error;

            setCartItems(prev => prev.filter(item => item.id !== productId));
        } catch (err) {
            console.error('Error removing item:', err);
        }
    };

    // Clear cart
    const clearCart = async () => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('carts')
                .delete()
                .eq('user_id', user.id);

            if (error) throw error;

            setCartItems([]);
        } catch (err) {
            console.error('Error clearing cart:', err);
        }
    };

    const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        cartItemCount,
        cartTotal,
        refetch: fetchCart
    };
};
