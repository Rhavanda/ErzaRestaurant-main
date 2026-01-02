import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock, MapPin, Phone, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { Order } from '../types';

const OrderSuccessPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { settings } = useSiteSettings();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            if (error) {
                console.error('Error fetching order:', error);
                setError('Pesanan tidak ditemukan');
            } else {
                setOrder(data as Order);
            }
            setLoading(false);
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-brand-green" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle size={64} className="mx-auto text-red-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-500">{error || 'Pesanan tidak ditemukan'}</p>
                    <Link to="/" className="inline-block mt-6 bg-brand-green text-white px-6 py-3 rounded-xl">
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen pt-24 pb-20 bg-gray-50">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={40} className="text-brand-green" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Pesanan Berhasil!</h1>
                    <p className="text-gray-500">
                        Terima kasih! Pesanan Anda telah kami terima.
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-sm text-gray-500">Nomor Pesanan</p>
                            <p className="text-xl font-bold text-brand-green">{order.order_number}</p>
                        </div>
                        <span className="px-4 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                            {order.status === 'pending' ? 'Menunggu Konfirmasi' : order.status}
                        </span>
                    </div>

                    <div className="space-y-4 border-t border-gray-100 pt-4">
                        <div className="flex items-start gap-3">
                            <Clock size={20} className="text-brand-green mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Waktu Pengambilan</p>
                                <p className="font-medium text-gray-800">
                                    {order.pickup_time ? formatDate(order.pickup_time) : '-'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <MapPin size={20} className="text-brand-green mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Lokasi Pengambilan</p>
                                <p className="font-medium text-gray-800">{settings.address}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Phone size={20} className="text-brand-green mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Kontak Restoran</p>
                                <p className="font-medium text-gray-800">{settings.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <h3 className="font-bold text-gray-800 mb-4">Detail Pesanan</h3>
                    <div className="space-y-3">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                                <span className="text-gray-600">
                                    {item.name} x{item.quantity}
                                </span>
                                <span className="font-medium text-gray-800">
                                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
                        <span className="font-bold text-gray-800">Total</span>
                        <span className="font-bold text-brand-green text-xl">
                            Rp {order.subtotal.toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                    <h4 className="font-bold text-blue-800 mb-2">📝 Langkah Selanjutnya</h4>
                    <ol className="list-decimal list-inside space-y-2 text-blue-700 text-sm">
                        <li>Kami akan mengkonfirmasi pesanan Anda via WhatsApp</li>
                        <li>Datang ke lokasi sesuai waktu pengambilan</li>
                        <li>Tunjukkan nomor pesanan saat mengambil</li>
                        <li>Lakukan pembayaran di tempat</li>
                    </ol>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Link
                        to="/menu"
                        className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium text-center hover:bg-gray-50"
                    >
                        Pesan Lagi
                    </Link>
                    <Link
                        to="/"
                        className="flex-1 bg-brand-green text-white py-3 rounded-xl font-medium text-center flex items-center justify-center gap-2"
                    >
                        Kembali <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
