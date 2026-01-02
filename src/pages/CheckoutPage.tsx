import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Clock, User, Phone, FileText, ArrowLeft, Loader2, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { CartItem, OrderItem } from '../types';

declare global {
    interface Window {
        snap: {
            pay: (token: string, options: {
                onSuccess: (result: any) => void;
                onPending: (result: any) => void;
                onError: (result: any) => void;
                onClose: () => void;
            }) => void;
        };
    }
}

interface CheckoutPageProps {
    cartItems: CartItem[];
    clearCart: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, clearCart }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [snapReady, setSnapReady] = useState(false);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

    // Load Snap.js script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
        script.onload = () => setSnapReady(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [MIDTRANS_CLIENT_KEY]);

    const generateOrderNumber = () => {
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `ORD-${dateStr}-${random}`;
    };

    // Function to create order in database
    const createOrder = async (orderNumber: string, paymentStatus: string, paymentId?: string) => {
        const orderItems: OrderItem[] = cartItems.map(item => ({
            product_id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            notes: item.notes
        }));

        const orderData = {
            order_number: orderNumber,
            user_id: user?.id || null,
            customer_name: customerName,
            customer_phone: customerPhone,
            order_type: 'pickup',
            pickup_time: new Date(pickupTime).toISOString(),
            items: orderItems,
            subtotal: subtotal,
            notes: notes || null,
            status: paymentStatus === 'paid' ? 'confirmed' : 'pending',
            payment_status: paymentStatus,
            payment_id: paymentId || null
        };

        const { data, error: insertError } = await supabase
            .from('orders')
            .insert(orderData)
            .select()
            .single();

        if (insertError) throw insertError;
        return data;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            setError('Keranjang kosong!');
            return;
        }

        if (!customerName || !customerPhone || !pickupTime) {
            setError('Mohon lengkapi semua data');
            return;
        }

        if (!snapReady) {
            setError('Payment gateway loading, mohon tunggu...');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const orderNumber = generateOrderNumber();

            // 1. Get Midtrans token FIRST (without creating order)
            const { data: tokenData, error: tokenError } = await supabase.functions.invoke(
                'create-midtrans-transaction',
                {
                    body: {
                        order_id: orderNumber,
                        gross_amount: subtotal,
                        customer_name: customerName,
                        customer_email: user?.email || '',
                        customer_phone: customerPhone,
                        items: cartItems.map(item => ({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity
                        }))
                    }
                }
            );

            if (tokenError) {
                console.error('Token error:', tokenError);
                throw new Error('Gagal membuat transaksi pembayaran');
            }

            // 2. Open Snap payment popup
            window.snap.pay(tokenData.token, {
                onSuccess: async (result: any) => {
                    console.log('Payment success:', result);
                    try {
                        // Create order ONLY on success
                        const order = await createOrder(orderNumber, 'paid', result.transaction_id);
                        clearCart();
                        navigate(`/order-success/${order.id}`);
                    } catch (err) {
                        console.error('Error creating order:', err);
                        setError('Pembayaran berhasil tapi gagal membuat pesanan. Hubungi admin.');
                        setLoading(false);
                    }
                },
                onPending: (result: any) => {
                    console.log('Payment pending:', result);
                    // Don't create order for pending - user needs to complete payment
                    setLoading(false);
                    setError('Pembayaran belum selesai. Silakan selesaikan pembayaran untuk membuat pesanan. Anda bisa mencoba lagi.');
                },
                onError: (result: any) => {
                    console.error('Payment error:', result);
                    setError('Pembayaran gagal. Silakan coba lagi.');
                    setLoading(false);
                },
                onClose: () => {
                    console.log('Payment popup closed without completing');
                    setLoading(false);
                    // NO order created - user can try again
                    setError('Pembayaran dibatalkan. Pesanan tidak dibuat.');
                }
            });

        } catch (err: any) {
            console.error('Error:', err);
            setError(err.message || 'Gagal memproses. Silakan coba lagi.');
            setLoading(false);
        }
    };

    // Get minimum pickup time (30 minutes from now)
    const getMinPickupTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 30);
        return now.toISOString().slice(0, 16);
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center py-20">
                    <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Keranjang Kosong</h2>
                    <p className="text-gray-500 mb-6">Tambahkan menu terlebih dahulu</p>
                    <button
                        onClick={() => navigate('/menu')}
                        className="bg-brand-green text-white px-6 py-3 rounded-xl font-medium"
                    >
                        Lihat Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-brand-green mb-6"
                >
                    <ArrowLeft size={20} />
                    Kembali
                </button>

                <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <User size={20} className="text-brand-green" />
                                Data Pemesan
                            </h2>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

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

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Waktu Pengambilan *
                                </label>
                                <div className="relative">
                                    <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="datetime-local"
                                        value={pickupTime}
                                        onChange={(e) => setPickupTime(e.target.value)}
                                        min={getMinPickupTime()}
                                        required
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                                    />
                                </div>
                                <p className="text-xs text-gray-400">Minimal 30 menit dari sekarang</p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Catatan (opsional)
                                </label>
                                <div className="relative">
                                    <FileText size={18} className="absolute left-4 top-4 text-gray-400" />
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Catatan tambahan untuk pesanan..."
                                        rows={3}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green resize-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !snapReady}
                                className="w-full bg-brand-green text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#4a8522] transition-colors disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={20} />
                                        Bayar Sekarang
                                    </>
                                )}
                            </button>

                            {!snapReady && (
                                <p className="text-center text-sm text-gray-400">
                                    Memuat payment gateway...
                                </p>
                            )}
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Ringkasan Pesanan</h2>

                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-xl object-cover"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-800">{item.name}</h4>
                                            <p className="text-sm text-gray-500">{item.quantity}x</p>
                                        </div>
                                        <span className="font-medium text-gray-800">
                                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-brand-green">
                                        Rp {subtotal.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
                                <strong>💳 Pembayaran Online</strong>
                                <p className="mt-1">Bayar dengan QRIS, Transfer Bank, E-Wallet, atau Kartu Kredit via Midtrans.</p>
                            </div>

                            <div className="mt-3 p-4 bg-green-50 rounded-xl text-sm text-green-700">
                                <strong>✅ Aman</strong>
                                <p className="mt-1">Pesanan hanya dibuat setelah pembayaran berhasil.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
