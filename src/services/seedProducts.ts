import { supabase } from '../lib/supabase';
import { MENU_ITEMS } from '../constants';

const seedProducts = async () => {
    console.log('Seeding products...');

    // Check if products already exist
    const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('Error checking products:', countError);
        return;
    }

    if (count && count > 0) {
        console.log('Products already seeded. Skipping...');
        return;
    }

    console.log('Starting seed process...');

    const productsToInsert = [];

    for (const item of MENU_ITEMS) {
        let imageUrl = item.image;

        try {
            // Try to upload to Supabase Storage
            // NOTE: This requires a public bucket named 'products' and a policy ensuring insert access
            console.log(`Processing image for ${item.name}...`);
            const response = await fetch(item.image);
            const blob = await response.blob();
            const fileName = `${item.id}-${Date.now()}.jpg`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('products')
                .upload(fileName, blob);

            if (!uploadError && uploadData) {
                const { data: publicUrlData } = supabase.storage
                    .from('products')
                    .getPublicUrl(fileName);

                if (publicUrlData.publicUrl) {
                    imageUrl = publicUrlData.publicUrl;
                    console.log(`Uploaded image to Supabase: ${imageUrl}`);
                }
            } else {
                console.warn(`Failed to upload image for ${item.name}, using original URL. Error:`, uploadError?.message);
            }
        } catch (err) {
            console.warn(`Error processing image for ${item.name}, using original URL:`, err);
        }

        productsToInsert.push({
            name: item.name,
            description: item.description,
            price: item.price,
            image_url: imageUrl,
            category: item.category,
            calories: item.calories,
            // rating: item.rating
        });
    }

    const { data, error } = await supabase
        .from('products')
        .upsert(productsToInsert, { onConflict: 'name', ignoreDuplicates: true })
        .select();

    if (error) {
        console.error('Error seeding products:', error);
    } else {
        console.log('Successfully seeded products:', data);
    }
};

// Uncomment to run this function via console in browser if needed, 
// or call it from a temporary useEffect in App.tsx
// seedProducts();

export default seedProducts;
