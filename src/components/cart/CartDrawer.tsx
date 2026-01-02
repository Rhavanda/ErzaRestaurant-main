import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, MessageCircle, ArrowRight } from 'lucide-react';
import { CartItem } from '../../types';
import { formatCurrency, WHATSAPP_NUMBER } from '../../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem
}) => {
  const navigate = useNavigate();

  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    const itemsList = cartItems.map((item, index) => {
      return `${index + 1}. ${item.name} (${item.quantity}x) - ${formatCurrency(item.price * item.quantity)}`;
    }).join('\n');

    const message = `Halo Warung Sedap, saya mau pesan:\n\n${itemsList}\n\n*Total: ${formatCurrency(totalAmount)}*\n\nMohon diproses ya, Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="p-6 bg-brand-green text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShoppingBag size={24} />
            <h2 className="text-xl font-bold">Pesanan Anda</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <ShoppingBag size={64} strokeWidth={1} className="text-gray-300" />
              <p>Keranjang Anda kosong.</p>
              <button onClick={onClose} className="text-brand-green font-semibold hover:underline">
                Mulai Pesan
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-2xl" />
                <div className="flex-1">
                  <h4 className="font-bold text-brand-dark text-sm mb-1">{item.name}</h4>
                  <p className="text-brand-green font-bold text-sm mb-2">{formatCurrency(item.price)}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-gray-500 hover:text-brand-green"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold w-4 text-center text-gray-700">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-gray-500 hover:text-brand-green"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-brand-light border-t border-green-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">Total</span>
              <span className="text-2xl font-bold text-brand-dark">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full bg-brand-green hover:bg-[#4a8522] text-white py-4 rounded-full font-bold flex items-center justify-center gap-3 shadow-lg shadow-green-500/30 transition-all active:scale-95"
              >
                <ArrowRight size={24} />
                Lanjut Checkout
              </button>
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full bg-white border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white py-3 rounded-full font-bold flex items-center justify-center gap-3 transition-all"
              >
                <MessageCircle size={20} />
                Pesan via WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;