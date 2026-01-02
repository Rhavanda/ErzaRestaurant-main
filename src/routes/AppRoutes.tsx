import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Product, CartItem } from '../types';

// Pages
import HomePage from '../pages/HomePage';
import MenuPage from '../pages/MenuPage';
import AboutPage from '../pages/AboutPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderSuccessPage from '../pages/OrderSuccessPage';
import ReservationPage from '../pages/ReservationPage';
import ProfilePage from '../pages/ProfilePage';
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';

interface AppRoutesProps {
    addToCart: (product: Product) => void;
    cartItems?: CartItem[];
    clearCart?: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ addToCart, cartItems = [], clearCart = () => { } }) => {
    return (
        <Routes>
            <Route path="/" element={<HomePage onAddToCart={addToCart} />} />
            <Route path="/menu" element={<MenuPage onAddToCart={addToCart} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/checkout" element={<CheckoutPage cartItems={cartItems} clearCart={clearCart} />} />
            <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
