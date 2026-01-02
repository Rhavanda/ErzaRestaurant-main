import React, { useState } from 'react';
import { BrowserRouter as Router, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/cart/CartDrawer';
import SearchOverlay from './components/search/SearchOverlay';
import ScrollToTop from './components/common/ScrollToTop';
import AppRoutes from './routes/AppRoutes';
import { useAuth } from './hooks/useAuth';
import { useCart } from './hooks/useCart';

const AppContent: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading: authLoading } = useAuth();
  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    cartItemCount
  } = useCart();

  // Helper to determine current page from path
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/menu') return 'menu';
    if (path === '/about') return 'about';
    return 'home';
  };

  const handlePageChange = (page: 'home' | 'menu' | 'about') => {
    if (page === 'home') navigate('/');
    else if (page === 'menu') navigate('/menu');
    else if (page === 'about') navigate('/about');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-brand-green">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  const handleAddToCart = async (product: any) => {
    if (!user) {
      navigate('/login');
      return;
    }
    await addToCart(product);
    setIsCartOpen(true);
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden flex flex-col font-sans">
      <ScrollToTop />

      {!isAdminRoute && (
        <Navbar
          currentPage={getCurrentPage()}
          setCurrentPage={handlePageChange}
          cartItemCount={cartItemCount}
          setIsCartOpen={setIsCartOpen}
          setIsSearchOpen={setIsSearchOpen}
        />
      )}

      {/* Content */}
      <main className="flex-grow">
        <AppRoutes addToCart={handleAddToCart} cartItems={cartItems} clearCart={clearCart} />
      </main>

      {!isAdminRoute && <Footer setCurrentPage={handlePageChange} />}

      {/* Overlays */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onAddToCart={handleAddToCart}
      />

    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;