import React, { useState } from 'react';
import { formatCurrency } from '../../constants';
import { useProducts } from '../../hooks/useProducts';
import { Product } from '../../types';
import { Plus, Star } from 'lucide-react';

interface MenuSectionProps {
  onAddToCart: (product: Product) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ onAddToCart }) => {
  const { products, loading } = useProducts();
  const [filter, setFilter] = useState<'all' | 'makanan' | 'minuman' | 'snack'>('all');

  if (loading) {
    return (
      <section className="pb-20 bg-white min-h-screen pt-32 text-center">
        <p>Loading menu...</p>
      </section>
    );
  }

  const filteredItems = filter === 'all'
    ? products
    : products.filter(item => item.category === filter);

  return (
    <section className="pb-20 bg-white min-h-screen">
      {/* Header Banner for Menu Page */}
      <div className="bg-brand-light py-16 mb-12 rounded-b-[40px]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-brand-green font-bold text-lg tracking-wider uppercase mb-2">Menu Lengkap</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-brand-dark">Jelajahi Hidangan Kami</h3>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Mulai dari hidangan utama tradisional hingga minuman yang menyegarkan.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap sticky top-24 z-20 bg-white/90 backdrop-blur py-4">
          {['all', 'makanan', 'minuman', 'snack'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-8 py-3 rounded-full capitalize transition-all font-medium text-sm ${filter === cat
                ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20 transform scale-105'
                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
                }`}
            >
              {cat === 'all' ? 'Semua' : cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-[30px] p-5 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group border border-gray-50 hover:border-brand-green/30">
              <div className="relative h-48 w-full mb-4 overflow-hidden rounded-2xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-bold text-brand-dark mb-2 leading-tight group-hover:text-brand-green transition-colors">{item.name}</h4>
                </div>
                <p className="text-gray-400 text-xs line-clamp-2 mb-4">{item.description}</p>
              </div>

              <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 mb-1">Harga</span>
                  <span className="text-lg font-bold text-brand-dark">{formatCurrency(item.price)}</span>
                </div>
                <button
                  onClick={() => onAddToCart(item)}
                  className="bg-brand-green text-white w-10 h-10 rounded-full hover:bg-[#4a8522] active:scale-95 transition-all shadow-lg shadow-brand-green/30 flex items-center justify-center group-hover:rotate-90 duration-300"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p>Tidak ada menu ditemukan dalam kategori ini.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;