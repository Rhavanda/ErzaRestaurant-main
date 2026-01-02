import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu as MenuIcon, X, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSiteSettings } from '../../hooks/useSiteSettings';

interface NavbarProps {
    currentPage: string;
    setCurrentPage: (page: 'home' | 'menu' | 'about') => void;
    cartItemCount: number;
    setIsCartOpen: (isOpen: boolean) => void;
    setIsSearchOpen: (isOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({
    currentPage,
    setCurrentPage,
    cartItemCount,
    setIsCartOpen,
    setIsSearchOpen
}) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, role, signOut } = useAuth();
    const { settings } = useSiteSettings();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || currentPage !== 'home' || mobileMenuOpen ? 'bg-white shadow-sm py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center relative z-50">
                {/* Logo */}
                <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 focus:outline-none">
                    {settings.logo_url ? (
                        <img src={settings.logo_url} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
                            {settings.store_name[0] || 'W'}
                        </div>
                    )}
                    <span className="font-bold text-2xl text-brand-dark">
                        {settings.store_name}
                        {settings.store_tagline && <span className="text-brand-green ml-1">{settings.store_tagline}</span>}
                    </span>
                </button>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-10 font-medium text-gray-600">
                    <button
                        onClick={() => setCurrentPage('home')}
                        className={`transition-colors ${currentPage === 'home' ? 'text-brand-green font-bold' : 'hover:text-brand-green'}`}
                    >
                        Beranda
                    </button>
                    <button
                        onClick={() => setCurrentPage('menu')}
                        className={`transition-colors ${currentPage === 'menu' ? 'text-brand-green font-bold' : 'hover:text-brand-green'}`}
                    >
                        Menu
                    </button>
                    <button
                        onClick={() => setCurrentPage('about')}
                        className={`transition-colors ${currentPage === 'about' ? 'text-brand-green font-bold' : 'hover:text-brand-green'}`}
                    >
                        Tentang Kami
                    </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"
                    >
                        <Search size={24} className="text-gray-600" />
                    </button>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 hover:bg-brand-light rounded-full transition-colors group"
                    >
                        <ShoppingCart size={24} className="text-gray-800" />
                        {cartItemCount > 0 && (
                            <span className="absolute top-0 right-0 bg-brand-green text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                    <button
                        className="md:hidden p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
                    </button>

                    {/* Auth Button */}
                    {user ? (
                        <div className="relative group hidden sm:block">
                            <button className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-bold border border-brand-green/20">
                                    {user.email?.[0].toUpperCase()}
                                </div>
                            </button>
                            {/* Dropdown */}
                            <div className="absolute right-0 top-full pt-2 w-56 hidden group-hover:block origin-top-right transition-all z-50">
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2">
                                    <div className="px-4 py-3 text-xs text-gray-500 border-b border-gray-50 mb-2 truncate">
                                        Signed in as<br />
                                        <span className="font-bold text-gray-800 text-sm">{user.email}</span>
                                    </div>
                                    {role === 'admin' && (
                                        <Link to="/admin" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-xl text-sm text-gray-700 mb-1 font-medium">
                                            <LayoutDashboard size={16} /> Admin Panel
                                        </Link>
                                    )}
                                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-xl text-sm text-gray-700 mb-1 font-medium">
                                        <UserIcon size={16} /> Profil Saya
                                    </Link>
                                    <button
                                        onClick={() => { signOut(); navigate('/'); }}
                                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 rounded-xl text-sm flex items-center gap-2 font-medium"
                                    >
                                        <LogOut size={16} /> Keluar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-brand-green text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#4a8522] transition-colors shadow-lg shadow-brand-green/20 hidden sm:block"
                        >
                            Masuk
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-start pt-32 gap-8 transition-all duration-300 md:hidden ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
                <button
                    onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}
                    className={`text-2xl font-bold ${currentPage === 'home' ? 'text-brand-green' : 'text-brand-dark'}`}
                >
                    Beranda
                </button>
                <button
                    onClick={() => { setCurrentPage('menu'); setMobileMenuOpen(false); }}
                    className={`text-2xl font-bold ${currentPage === 'menu' ? 'text-brand-green' : 'text-brand-dark'}`}
                >
                    Menu
                </button>
                <button
                    onClick={() => { setCurrentPage('about'); setMobileMenuOpen(false); }}
                    className={`text-2xl font-bold ${currentPage === 'about' ? 'text-brand-green' : 'text-brand-dark'}`}
                >
                    Tentang Kami
                </button>

                <div className="w-16 h-1 bg-gray-100 rounded-full my-2"></div>

                <button onClick={() => {
                    setMobileMenuOpen(false);
                    setIsSearchOpen(true);
                }} className="text-xl text-gray-500 flex items-center gap-2 font-medium hover:text-brand-green">
                    <Search size={20} /> Cari Menu
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
