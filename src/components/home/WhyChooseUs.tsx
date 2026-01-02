import React from 'react';
import { Heart, ShieldCheck, Clock } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-brand-dark mb-4">MENGAPA KAMI?</h2>
        <p className="text-gray-500 max-w-xl mx-auto mb-16">
          Anda memilih kami karena Anda mendapatkan makanan berkualitas terbaik yang disiapkan dengan sepenuh hati.
        </p>

        <div className="grid md:grid-cols-3 gap-10 px-4 lg:px-20">
          {/* Feature 1 */}
          <div className="p-8 rounded-[40px] bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(92,158,45,0.2)] transition-all duration-300 group">
            <div className="w-20 h-20 mx-auto bg-brand-light rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-green transition-colors duration-300">
              <Heart size={32} className="text-brand-green group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-brand-dark mb-3">Sajikan Makanan Sehat</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Kami menyajikan semua makanan sehat di sini. Anda dapat memilih makanan apa pun yang Anda suka.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-[40px] bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(92,158,45,0.2)] transition-all duration-300 group">
            <div className="w-20 h-20 mx-auto bg-brand-light rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-green transition-colors duration-300">
              <ShieldCheck size={32} className="text-brand-green group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-brand-dark mb-3">Kualitas Terbaik</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Kualitas makanan kami sangat baik. Anda akan mendapatkan persis apa yang Anda inginkan di sini.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-[40px] bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(92,158,45,0.2)] transition-all duration-300 group">
            <div className="w-20 h-20 mx-auto bg-brand-light rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-green transition-colors duration-300">
              <Clock size={32} className="text-brand-green group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-brand-dark mb-3">Siap Ambil Cepat</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Pesan online, bayar, dan ambil pesanan Anda yang sudah siap di lokasi kami.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;