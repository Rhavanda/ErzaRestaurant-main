import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const AboutUs: React.FC = () => {
   const { settings } = useSiteSettings();

   const defaultMapsUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126907.03960916057!2d106.7892255!3d-6.229728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%20Selatan%2C%20Kota%20Jakarta%20Selatan%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1647851234567!5m2!1sid!2sid";

   return (
      <div className="pt-24 pb-20">
         {/* Banner */}
         <div className="bg-brand-green/10 py-16 mb-16">
            <div className="container mx-auto px-4 text-center">
               <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">Tentang Kami</h1>
               <p className="text-gray-600 max-w-2xl mx-auto">
                  Cerita dibalik cita rasa nusantara yang kami sajikan dengan sepenuh hati.
               </p>
            </div>
         </div>

         <div className="container mx-auto px-4">
            {/* Story Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
               <div className="rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img
                     src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80"
                     alt="Restaurant Interior"
                     className="w-full h-full object-cover"
                  />
               </div>
               <div className="space-y-6">
                  <h3 className="text-brand-green font-bold tracking-wider uppercase text-sm">Sejarah Kami</h3>
                  <h2 className="text-3xl font-bold text-brand-dark">Melestarikan Kuliner Asli Indonesia Sejak 2010</h2>
                  <p className="text-gray-500 leading-relaxed">
                     Warung Sedap Nusantara bermula dari sebuah dapur kecil di Jakarta Selatan.
                     Kecintaan kami terhadap rempah-rempah Indonesia mendorong kami untuk menyajikan hidangan
                     yang tidak hanya lezat, tapi juga membangkitkan kenangan akan masakan rumah.
                  </p>
                  <p className="text-gray-500 leading-relaxed">
                     Kami percaya bahwa makanan yang baik berasal dari bahan-bahan terbaik.
                     Itulah sebabnya kami bekerja sama langsung dengan petani lokal untuk memastikan kesegaran setiap hidangan.
                  </p>

                  <div className="grid grid-cols-2 gap-6 pt-4">
                     <div className="border-l-4 border-brand-green pl-4">
                        <h4 className="font-bold text-2xl text-brand-dark">15+</h4>
                        <p className="text-sm text-gray-500">Tahun Pengalaman</p>
                     </div>
                     <div className="border-l-4 border-brand-green pl-4">
                        <h4 className="font-bold text-2xl text-brand-dark">20k+</h4>
                        <p className="text-sm text-gray-500">Pelanggan Bahagia</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Location Section */}
            <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
               <div className="grid md:grid-cols-2">
                  {/* Contact Info */}
                  <div className="p-10 md:p-16 bg-brand-dark text-white">
                     <h3 className="text-3xl font-bold mb-8">Kunjungi Kami</h3>

                     <div className="space-y-8">
                        <div className="flex items-start gap-4">
                           <div className="bg-white/10 p-3 rounded-full">
                              <MapPin size={24} className="text-brand-green" />
                           </div>
                           <div>
                              <h4 className="font-bold text-lg mb-1">Alamat</h4>
                              <p className="text-gray-400">{settings.address}</p>
                           </div>
                        </div>

                        <div className="flex items-start gap-4">
                           <div className="bg-white/10 p-3 rounded-full">
                              <Phone size={24} className="text-brand-green" />
                           </div>
                           <div>
                              <h4 className="font-bold text-lg mb-1">Telepon & WA</h4>
                              <p className="text-gray-400">{settings.phone}</p>
                           </div>
                        </div>

                        <div className="flex items-start gap-4">
                           <div className="bg-white/10 p-3 rounded-full">
                              <Mail size={24} className="text-brand-green" />
                           </div>
                           <div>
                              <h4 className="font-bold text-lg mb-1">Email</h4>
                              <p className="text-gray-400">{settings.email}</p>
                           </div>
                        </div>

                        <div className="flex items-start gap-4">
                           <div className="bg-white/10 p-3 rounded-full">
                              <Clock size={24} className="text-brand-green" />
                           </div>
                           <div>
                              <h4 className="font-bold text-lg mb-1">Jam Operasional</h4>
                              <p className="text-gray-400">{settings.operating_hours}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Map */}
                  <div className="h-full min-h-[400px] bg-gray-200 relative">
                     <iframe
                        src={settings.maps_embed_url || defaultMapsUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-0"
                     ></iframe>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AboutUs;