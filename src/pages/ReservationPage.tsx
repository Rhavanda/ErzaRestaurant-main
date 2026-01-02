import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, User, Phone, FileText, ArrowLeft, Loader2, UtensilsCrossed } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const ReservationPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [reservationDate, setReservationDate] = useState('');
    const [reservationTime, setReservationTime] = useState('');
    const [guestCount, setGuestCount] = useState(2);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    const generateOrderNumber = () => {
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `RSV-${dateStr}-${random}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!customerName || !customerPhone || !reservationDate || !reservationTime) {
            setError('Mohon lengkapi semua data');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const pickupDateTime = `${reservationDate}T${reservationTime}:00`;
            const newOrderNumber = generateOrderNumber();

            const reservationData = {
                order_number: newOrderNumber,
                user_id: user?.id || null,
                customer_name: customerName,
                customer_phone: customerPhone,
                order_type: 'reservation',
                pickup_time: new Date(pickupDateTime).toISOString(),
                guest_count: guestCount,
                items: [],
                subtotal: 0,
                notes: notes || null,
                status: 'pending',
                payment_status: 'unpaid'
            };

            const { error: insertError } = await supabase
                .from('orders')
                .insert(reservationData);

            if (insertError) throw insertError;

            setOrderNumber(newOrderNumber);
            setSuccess(true);
        } catch (err: any) {
            console.error('Error creating reservation:', err);
            setError('Gagal membuat reservasi. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    // Get minimum date (today)
    const getMinDate = () => {
        return new Date().toISOString().slice(0, 10);
    };

    if (success) {
        return (
            <div className="min-h-screen pt-24 pb-20 bg-gray-50">
                <div className="container mx-auto px-4 max-w-lg text-center">
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UtensilsCrossed size={40} className="text-brand-green" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Reservasi Berhasil!</h1>
                        <p className="text-gray-500 mb-6">
                            Reservasi Anda telah kami terima. Kami akan mengkonfirmasi via WhatsApp.
                        </p>

                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <p className="text-sm text-gray-500">Nomor Reservasi</p>
                            <p className="text-xl font-bold text-brand-green">{orderNumber}</p>
                        </div>

                        <div className="space-y-3 text-left bg-blue-50 rounded-xl p-4 mb-6">
                            <p className="font-medium text-blue-800">📝 Informasi Penting:</p>
                            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                                <li>Simpan nomor reservasi Anda</li>
                                <li>Datang 10 menit sebelum waktu reservasi</li>
                                <li>Reservasi akan dibatalkan jika terlambat 30 menit</li>
                            </ul>
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-brand-green text-white py-3 rounded-xl font-medium"
                        >
                            Kembali ke Beranda
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 bg-gray-50">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Header */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-brand-green mb-6"
                >
                    <ArrowLeft size={20} />
                    Kembali
                </button>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Reservasi Meja</h1>
                    <p className="text-gray-500">Pesan meja untuk pengalaman makan yang lebih nyaman</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* Date & Time */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Tanggal *
                            </label>
                            <div className="relative">
                                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    value={reservationDate}
                                    onChange={(e) => setReservationDate(e.target.value)}
                                    min={getMinDate()}
                                    required
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Waktu *
                            </label>
                            <div className="relative">
                                <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    value={reservationTime}
                                    onChange={(e) => setReservationTime(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green appearance-none"
                                >
                                    <option value="">Pilih Waktu</option>
                                    <option value="10:00">10:00</option>
                                    <option value="11:00">11:00</option>
                                    <option value="12:00">12:00</option>
                                    <option value="13:00">13:00</option>
                                    <option value="14:00">14:00</option>
                                    <option value="15:00">15:00</option>
                                    <option value="16:00">16:00</option>
                                    <option value="17:00">17:00</option>
                                    <option value="18:00">18:00</option>
                                    <option value="19:00">19:00</option>
                                    <option value="20:00">20:00</option>
                                    <option value="21:00">21:00</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Guest Count */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Jumlah Tamu *
                        </label>
                        <div className="relative">
                            <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                value={guestCount}
                                onChange={(e) => setGuestCount(Number(e.target.value))}
                                required
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green appearance-none"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map(num => (
                                    <option key={num} value={num}>{num} Orang</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Nama Lengkap *
                            </label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Nama Anda"
                                    required
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Nomor WhatsApp *
                            </label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    placeholder="08123456789"
                                    required
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Catatan / Permintaan Khusus (opsional)
                        </label>
                        <div className="relative">
                            <FileText size={18} className="absolute left-4 top-4 text-gray-400" />
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Contoh: Meja dekat jendela, kursi bayi, dll..."
                                rows={3}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green resize-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-green text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#4a8522] transition-colors disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                <UtensilsCrossed size={20} />
                                Buat Reservasi
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReservationPage;
