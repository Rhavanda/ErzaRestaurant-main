import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { formatCurrency } from '../../constants';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ProductFormModal from '../../components/admin/ProductFormModal';
import { Product } from '../../types';

const AdminProductsPage: React.FC = () => {
    const { products, loading: productsLoading, refetch } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        setIsDeleting(id);
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Optionally delete image from storage if it exists
            // ...

            refetch(); // Refresh list without page reload
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        } finally {
            setIsDeleting(null);
        }
    };

    if (productsLoading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
                <button
                    onClick={handleAdd}
                    className="bg-brand-green text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#4a8522] transition-colors shadow-lg shadow-brand-green/20"
                >
                    <Plus size={20} />
                    <span>Add New Product</span>
                </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600">Product</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Category</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Price</th>

                                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{product.name}</h4>
                                                <p className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{product.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                                            ${product.category === 'makanan' ? 'bg-orange-100 text-orange-600' :
                                                product.category === 'minuman' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-purple-100 text-purple-600'}`}>
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-700">
                                        {formatCurrency(product.price)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="p-2 text-gray-400 hover:text-brand-green hover:bg-brand-green/10 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id, product.image)}
                                                disabled={isDeleting === product.id}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                {isDeleting === product.id ? '...' : <Trash2 size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                onSuccess={() => refetch()}
            />
        </div>
    );
};

export default AdminProductsPage;
