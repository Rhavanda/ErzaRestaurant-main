import React from 'react';
import { WHATSAPP_NUMBER } from '../../constants';

interface HeroProps {
  onViewMenu: () => void;
}

const Hero: React.FC<HeroProps> = ({ onViewMenu }) => {

  const handleReservation = () => {
    const message = "Halo Warung Sedap, saya ingin reservasi meja untuk [Jumlah Orang] pada jam [Waktu].";
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
  };

  return (
    <section className="relative w-full pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">

      {/* Green Background Shape (The Wave) */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[120%] bg-[#6bbd32] rounded-bl-[200px] opacity-100 hidden lg:block transform translate-x-20"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[85%] h-[125%] bg-[#5c9e2d] rounded-bl-[220px] hidden lg:block"></div>
        {/* Mobile background */}
        <div className="absolute top-0 w-full h-[60%] bg-gradient-to-b from-brand-green to-white opacity-1 lg:hidden"></div>
      </div>

      {/* Decorative Floating Leaves */}
      <img src="https://cdn-icons-png.flaticon.com/512/1147/1147560.png" className="absolute top-20 left-10 w-12 opacity-20 rotate-45 hidden lg:block" alt="leaf" />
      <img src="https://cdn-icons-png.flaticon.com/512/1147/1147560.png" className="absolute bottom-20 right-1/2 w-16 opacity-20 -rotate-12 hidden lg:block" alt="leaf" />

      <div className="container mx-auto px-4 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left: Text Content */}
        <div className="order-2 lg:order-1 space-y-6 text-center lg:text-left z-10">
          <div className="inline-block px-4 py-1 border border-brand-green text-brand-green rounded-full text-sm font-bold mb-2 bg-brand-light">
            Lapar?
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-brand-dark leading-[1.1]">
            Datang Saja ke <br />
            <span className="text-brand-green">Warung Sedap</span> & Pesan
          </h1>
          <p className="text-gray-500 text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Di sini Anda akan menemukan makanan Indonesia terbaik dan murni.
            Pesan sekarang untuk memuaskan rasa lapar Anda.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
            <button
              onClick={onViewMenu}
              className="bg-brand-green text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-brand-green/30 hover:bg-[#4a8522] transition-all hover:-translate-y-1"
            >
              Pesan Sekarang
            </button>
            <button
              onClick={handleReservation}
              className="bg-white text-brand-dark border border-gray-200 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-50 hover:border-brand-green transition-all hover:shadow-lg"
            >
              Reservasi
            </button>
          </div>
        </div>

        {/* Right: Image Content */}
        <div className="order-1 lg:order-2 relative flex justify-center items-center">
          <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[550px] lg:h-[550px]">
            {/* Main Plate */}
            <div className="absolute inset-4 bg-white/20 rounded-full blur-xl"></div>
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"
              alt="Main Dish"
              className="w-full h-full object-cover rounded-full shadow-2xl border-[10px] border-white/30 relative z-10"
            />

            {/* Floating Mini Dishes (Decorations) */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-lg z-20 hidden lg:block animate-[bounce_4s_infinite]">
              <img src="https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&q=80" className="w-full h-full object-cover" alt="Small dish 1" />
            </div>
            <div className="absolute bottom-10 -left-8 w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg z-20 hidden lg:block animate-[bounce_5s_infinite]">
              <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&q=80" className="w-full h-full object-cover" alt="Small dish 2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;