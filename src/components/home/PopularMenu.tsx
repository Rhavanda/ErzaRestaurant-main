import React from 'react';
import { formatCurrency } from '../../constants';
import { useProducts } from '../../hooks/useProducts';
import { Product } from '../../types';
import { Plus } from 'lucide-react';

interface PopularMenuProps {
  onAddToCart: (product: Product) => void;
  onSeeAll: () => void;
}

const PopularMenu: React.FC<PopularMenuProps> = ({ onAddToCart, onSeeAll }) => {
  const { products, loading } = useProducts();
  // Take only the first 3 items as highlights
  const popularItems = products.slice(0, 3);

  if (loading) {
    return <div className="py-24 text-center">Loading popular menu...</div>;
  }

  if (products.length === 0) {
    return (
      <section className="py-24 bg-brand-light/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-brand-dark mb-4">MENU FAVORIT KAMI</h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-8">Belum ada menu yang ditambahkan.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-brand-light/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-brand-dark mb-4">MENU FAVORIT KAMI</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Ini adalah daftar menu harian kami. Di sini Anda akan menemukan segala jenis makanan, pilihlah favorit Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {popularItems.map((item) => (
            <div key={item.id} className="bg-white rounded-[30px] p-6 shadow-sm hover:shadow-xl transition-all duration-300 text-center group border border-gray-100 relative mt-12">
              {/* Floating Image */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-40 h-40 rounded-full border-4 border-white shadow-md overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>

              <div className="pt-28">
                <h3 className="text-xl font-bold text-brand-dark mb-2">{item.name}</h3>



                <p className="text-gray-400 text-sm mb-6 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between px-4">
                  <span className="font-bold text-lg text-brand-dark">{formatCurrency(item.price)}</span>
                  <button
                    onClick={() => onAddToCart(item)}
                    className="bg-brand-green text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#4a8522] transition-colors shadow-lg shadow-brand-green/20"
                  >
                    Beli
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button
            onClick={onSeeAll}
            className="text-brand-dark font-bold border-b-2 border-brand-green pb-1 hover:text-brand-green transition-colors"
          >
            Lihat Semua Menu &rarr;
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularMenu;