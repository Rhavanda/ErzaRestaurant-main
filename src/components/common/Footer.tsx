import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

interface FooterProps {
    setCurrentPage: (page: 'home' | 'menu' | 'about') => void;
}

const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
    const { settings } = useSiteSettings();

    return (
        <footer className="bg-brand-dark text-white pt-20 pb-10">
            <div className="container mx-auto px-8 grid md:grid-cols-4 gap-12 mb-12">
                <div className="space-y-6 md:col-span-1">
                    <div className="flex items-center gap-2">
                        {settings.logo_url ? (
                            <img src={settings.logo_url} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                            <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-xl">
                                {settings.store_name[0] || 'W'}
                            </div>
                        )}
                        <span className="font-bold text-2xl">{settings.store_name}</span>
                    </div>
                    <p className="text-gray-400 leading-relaxed text-sm">
                        Kami menyajikan makanan terbaik di kota, membawa cita rasa otentik langsung ke depan pintu Anda.
                    </p>
                </div>

                <div>
                    <h4 className="font-bold mb-6 text-lg">Menu</h4>
                    <ul className="space-y-3 text-gray-400 text-sm">
                        <li onClick={() => setCurrentPage('home')} className="hover:text-brand-green cursor-pointer">Beranda</li>
                        <li onClick={() => setCurrentPage('about')} className="hover:text-brand-green cursor-pointer">Mengapa Kami</li>
                        <li onClick={() => setCurrentPage('menu')} className="hover:text-brand-green cursor-pointer">Menu Spesial</li>
                        <li onClick={() => setCurrentPage('menu')} className="hover:text-brand-green cursor-pointer">Makanan Reguler</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-6 text-lg">Bantuan</h4>
                    <ul className="space-y-3 text-gray-400 text-sm">
                        <li className="hover:text-brand-green cursor-pointer">Kebijakan Privasi</li>
                        <li className="hover:text-brand-green cursor-pointer">Syarat & Ketentuan</li>
                        <li className="hover:text-brand-green cursor-pointer">Kebijakan</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-6 text-lg">Kontak</h4>
                    <ul className="space-y-3 text-gray-400 text-sm">
                        <li className="flex items-start gap-3">
                            <Phone className="text-brand-green shrink-0" size={18} />
                            <span>{settings.phone}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Mail className="text-brand-green shrink-0" size={18} />
                            <span>{settings.email}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <MapPin className="text-brand-green shrink-0" size={18} />
                            <span>{settings.address}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="text-center text-gray-600 border-t border-gray-800 pt-8 text-sm">
                &copy; 2024 {settings.store_name}. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
