import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Upload, Loader2, Phone, Mail, MapPin, Map, Store, Palette } from 'lucide-react';

interface SettingItem {
    key: string;
    value: string;
}

const AdminSettingsPage: React.FC = () => {
    // Branding
    const [storeName, setStoreName] = useState('');
    const [storeTagline, setStoreTagline] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    // Contact Info
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [mapsEmbedUrl, setMapsEmbedUrl] = useState('');
    const [operatingHours, setOperatingHours] = useState('');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'branding' | 'contact'>('branding');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const { data, error } = await supabase
            .from('site_settings')
            .select('key, value');

        if (error) {
            console.error('Error fetching settings:', error);
        } else if (data) {
            data.forEach((item: SettingItem) => {
                if (item.key === 'store_name') setStoreName(item.value || '');
                if (item.key === 'store_tagline') setStoreTagline(item.value || '');
                if (item.key === 'logo_url') {
                    setLogoUrl(item.value || '');
                    setLogoPreview(item.value || null);
                }
                if (item.key === 'phone') setPhone(item.value || '');
                if (item.key === 'email') setEmail(item.value || '');
                if (item.key === 'address') setAddress(item.value || '');
                if (item.key === 'maps_embed_url') setMapsEmbedUrl(item.value || '');
                if (item.key === 'operating_hours') setOperatingHours(item.value || '');
            });
        }
        setLoading(false);
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const uploadLogo = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `logo_${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('products')
            .getPublicUrl(fileName);

        return data.publicUrl;
    };

    const updateSetting = async (key: string, value: string) => {
        const { error } = await supabase
            .from('site_settings')
            .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

        if (error) throw error;
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            let finalLogoUrl = logoUrl;
            if (logoFile) {
                finalLogoUrl = await uploadLogo(logoFile);
            }

            await updateSetting('store_name', storeName);
            await updateSetting('store_tagline', storeTagline);
            await updateSetting('logo_url', finalLogoUrl);
            await updateSetting('phone', phone);
            await updateSetting('email', email);
            await updateSetting('address', address);
            await updateSetting('maps_embed_url', mapsEmbedUrl);
            await updateSetting('operating_hours', operatingHours);

            setLogoUrl(finalLogoUrl);
            setLogoFile(null);
            alert('Pengaturan berhasil disimpan!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Gagal menyimpan pengaturan.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-brand-green" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Pengaturan Toko</h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola branding dan informasi kontak toko Anda</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-brand-green text-white px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#4a8522] transition-colors shadow-lg shadow-brand-green/20 disabled:opacity-50"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('branding')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'branding'
                        ? 'bg-white text-brand-green shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    <Palette size={16} />
                    Branding
                </button>
                <button
                    onClick={() => setActiveTab('contact')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'contact'
                        ? 'bg-white text-brand-green shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    <MapPin size={16} />
                    Kontak & Lokasi
                </button>
            </div>

            {/* Branding Tab */}
            {activeTab === 'branding' && (
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left Column - Logo Upload */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Store size={18} className="text-brand-green" />
                            Logo Toko
                        </h3>

                        <div className="flex flex-col items-center gap-6">
                            {/* Logo Preview */}
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-green/20 to-brand-green/5 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-5xl font-bold text-brand-green">
                                            {storeName?.[0] || 'W'}
                                        </span>
                                    )}
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-brand-green text-white p-2 rounded-full shadow-lg">
                                    <Upload size={16} />
                                </div>
                            </div>

                            <label className="cursor-pointer w-full">
                                <div className="bg-gray-50 border-2 border-dashed border-gray-200 hover:border-brand-green text-gray-600 px-4 py-4 rounded-xl text-center transition-colors">
                                    <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                                    <span className="font-medium">Klik untuk upload logo</span>
                                    <p className="text-xs text-gray-400 mt-1">PNG atau JPG, maks 1MB</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                            </label>
                        </div>
                    </div>

                    {/* Right Column - Store Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Palette size={18} className="text-brand-green" />
                            Identitas Toko
                        </h3>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Nama Toko</label>
                            <input
                                type="text"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                placeholder="Warung Sedap"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green text-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Tagline / Slogan</label>
                            <input
                                type="text"
                                value={storeTagline}
                                onChange={(e) => setStoreTagline(e.target.value)}
                                placeholder="Nusantara"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                            />
                        </div>

                        {/* Live Preview */}
                        <div className="pt-4 border-t border-gray-100">
                            <label className="block text-sm font-medium text-gray-500 mb-3">Preview di Navbar</label>
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo" className="w-12 h-12 rounded-full object-cover shadow-md" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-brand-green flex items-center justify-center text-white font-bold text-xl shadow-md">
                                            {storeName?.[0] || 'W'}
                                        </div>
                                    )}
                                    <div>
                                        <span className="font-bold text-xl text-brand-dark">{storeName || 'Warung Sedap'}</span>
                                        {storeTagline && <span className="text-brand-green ml-2 font-medium">{storeTagline}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left Column - Contact Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Phone size={18} className="text-brand-green" />
                            Informasi Kontak
                        </h3>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Phone size={14} className="text-gray-400" /> Nomor Telepon / WhatsApp
                            </label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+62 812 3456 7890"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Mail size={14} className="text-gray-400" /> Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="hello@warungsedap.com"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                <MapPin size={14} className="text-gray-400" /> Alamat Lengkap
                            </label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Jl. Merdeka No. 45, Jakarta Selatan"
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                ⏰ Jam Operasional
                            </label>
                            <input
                                type="text"
                                value={operatingHours}
                                onChange={(e) => setOperatingHours(e.target.value)}
                                placeholder="Setiap Hari: 10:00 - 22:00 WIB"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                            />
                        </div>
                    </div>

                    {/* Right Column - Google Maps */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Map size={18} className="text-brand-green" />
                            Lokasi di Google Maps
                        </h3>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Google Maps Embed URL</label>
                            <input
                                type="text"
                                value={mapsEmbedUrl}
                                onChange={(e) => setMapsEmbedUrl(e.target.value)}
                                placeholder="https://www.google.com/maps/embed?pb=..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green text-sm"
                            />
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
                                <strong>Cara mendapatkan URL:</strong>
                                <ol className="list-decimal ml-4 mt-1 space-y-0.5">
                                    <li>Buka Google Maps dan cari lokasi toko</li>
                                    <li>Klik tombol Share → Embed a map</li>
                                    <li>Copy URL dari atribut src="..."</li>
                                </ol>
                            </div>
                        </div>

                        {/* Maps Preview */}
                        <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                            {mapsEmbedUrl ? (
                                <iframe
                                    src={mapsEmbedUrl}
                                    width="100%"
                                    height="220"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            ) : (
                                <div className="h-[220px] flex items-center justify-center text-gray-400">
                                    <div className="text-center">
                                        <Map size={48} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Masukkan URL untuk melihat preview peta</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSettingsPage;
