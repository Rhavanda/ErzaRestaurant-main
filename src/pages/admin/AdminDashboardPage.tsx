import React from 'react';
import { useProducts } from '../../hooks/useProducts';

const AdminDashboardPage: React.FC = () => {
    const { products } = useProducts();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Total Menu Items</h3>
                    <p className="text-4xl font-bold text-brand-dark">{products.length}</p>
                </div>

                {/* Placeholder Stats */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 opacity-60">
                    <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Total Orders</h3>
                    <p className="text-4xl font-bold text-brand-dark">0</p>
                    <span className="text-xs text-gray-400">Coming soon</span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 opacity-60">
                    <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Total Revenue</h3>
                    <p className="text-4xl font-bold text-brand-dark">Orders</p>
                    <span className="text-xs text-gray-400">Coming soon</span>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
