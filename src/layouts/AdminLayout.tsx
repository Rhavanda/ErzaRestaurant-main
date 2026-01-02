import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Settings, Menu, X, LogOut, Users, ArrowLeft, ClipboardList } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AdminLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const { user, role, loading, signOut } = useAuth();

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green mx-auto mb-4"></div>
                    <p className="text-gray-600">Memverifikasi akses...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not logged in
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Redirect to home if not admin
    if (role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
        { name: 'Orders', path: '/admin/orders', icon: <ClipboardList size={20} /> },
        { name: 'Products', path: '/admin/products', icon: <ShoppingBag size={20} /> },
        { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                        <span className="text-xl font-bold text-brand-dark">Admin Panel</span>
                        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                  ${isActive(item.path)
                                        ? 'bg-brand-green/10 text-brand-green font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'}
                `}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Back to Website & Logout */}
                    <div className="p-4 border-t border-gray-100 space-y-1">
                        <Link to="/" className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                            <ArrowLeft size={20} />
                            <span>Kembali ke Website</span>
                        </Link>
                        <button
                            onClick={() => signOut()}
                            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <LogOut size={20} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header (Mobile only) */}
                <header className="h-16 bg-white shadow-sm flex items-center px-4 md:hidden z-10">
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
                        <Menu size={24} />
                    </button>
                    <span className="ml-4 font-bold text-gray-800">Warung Sedap Admin</span>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
