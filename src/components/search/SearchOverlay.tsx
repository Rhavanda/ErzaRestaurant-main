import React, { useState, useEffect, useRef } from 'react';
import { X, Search, ShoppingBag, AlertCircle, ArrowRight } from 'lucide-react';
import { MENU_ITEMS, formatCurrency } from '../../constants';
import { Product } from '../../types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, onAddToCart }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const filteredItems = query.trim() === ''
    ? []
    : MENU_ITEMS.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="container mx-auto px-4 h-full flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center gap-2 text-brand-green font-bold text-xl">
            <Search size={24} />
            <span>Pencarian</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-red-500"
          >
            <X size={32} />
          </button>
        </div>

        {/* Search Input */}
        <div className="mt-4 mb-8">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari Nasi Goreng, Sate..."
            className="w-full bg-transparent text-3xl md:text-5xl font-bold text-brand-dark placeholder-gray-200 border-b-2 border-gray-100 focus:border-brand-green focus:outline-none py-4 transition-colors"
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pb-20">

          {/* State: Initial (No Query) */}
          {query.trim() === '' && (
            <div className="text-center mt-20 text-gray-400">
              <p className="text-lg">Ketik nama makanan yang ingin Anda cari</p>
            </div>
          )}

          {/* State: Results Found */}
          {query.trim() !== '' && filteredItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group cursor-pointer"
                  onClick={() => {
                    onAddToCart(item);
                    // Optional: close on add or keep open
                  }}
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-brand-dark group-hover:text-brand-green transition-colors">{item.name}</h4>
                      <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <span className="font-bold text-brand-green">{formatCurrency(item.price)}</span>
                      <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-brand-dark group-hover:bg-brand-green group-hover:text-white transition-colors">
                        <ShoppingBag size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* State: Not Found */}
          {query.trim() !== '' && filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-10 text-center animate-in zoom-in-95 duration-300">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-400">
                <AlertCircle size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Yah, tidak ketemu...</h3>
              <p className="text-gray-500 max-w-md">
                Maaf, kami tidak dapat menemukan menu dengan kata kunci <span className="font-bold text-brand-dark">"{query}"</span>.
              </p>
              <p className="text-gray-400 text-sm mt-4">Coba cari "Nasi", "Ayam", atau "Es"</p>

              <button
                onClick={() => setQuery('')}
                className="mt-8 px-6 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-bold"
              >
                Hapus Pencarian
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;