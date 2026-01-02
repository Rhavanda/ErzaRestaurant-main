import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SiteSettings {
    store_name: string;
    store_tagline: string;
    logo_url: string | null;
    phone: string;
    email: string;
    address: string;
    maps_embed_url: string;
    operating_hours: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
    store_name: 'Warung Sedap',
    store_tagline: 'Nusantara',
    logo_url: null,
    phone: '+62 812 3456 7890',
    email: 'hello@warungsedap.com',
    address: 'Jl. Merdeka No. 45, Jakarta',
    maps_embed_url: '',
    operating_hours: 'Setiap Hari: 10:00 - 22:00 WIB'
};

export const useSiteSettings = () => {
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('key, value');

            if (error) {
                console.error('Error fetching site settings:', error);
                return;
            }

            if (data) {
                const settingsObj: Record<string, string> = {};
                data.forEach((item: { key: string; value: string }) => {
                    settingsObj[item.key] = item.value;
                });

                setSettings({
                    store_name: settingsObj.store_name || DEFAULT_SETTINGS.store_name,
                    store_tagline: settingsObj.store_tagline || DEFAULT_SETTINGS.store_tagline,
                    logo_url: settingsObj.logo_url || null,
                    phone: settingsObj.phone || DEFAULT_SETTINGS.phone,
                    email: settingsObj.email || DEFAULT_SETTINGS.email,
                    address: settingsObj.address || DEFAULT_SETTINGS.address,
                    maps_embed_url: settingsObj.maps_embed_url || '',
                    operating_hours: settingsObj.operating_hours || DEFAULT_SETTINGS.operating_hours
                });
            }
        } catch (error) {
            console.error('Error in fetchSettings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return { settings, loading, refetch: fetchSettings };
};
