import React from 'react';

const NewsletterCTA: React.FC = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="bg-brand-green rounded-[50px] p-12 md:p-20 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Dapatkan Diskon 10% Pesanan Pertama</h2>
                        <p className="text-green-100 max-w-xl mx-auto mb-10">
                            Berlangganan newsletter kami dan dapatkan penawaran serta promo eksklusif langsung ke inbox Anda.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
                            <input
                                type="email"
                                placeholder="Masukkan email Anda"
                                className="px-6 py-4 rounded-full text-gray-800 flex-1 focus:outline-none"
                            />
                            <button className="bg-brand-dark text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-colors">
                                Berlangganan
                            </button>
                        </div>
                    </div>
                    {/* Background Circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>
                </div>
            </div>
        </section>
    );
};

export default NewsletterCTA;
