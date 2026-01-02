import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Clock, ArrowLeft, Edit2, Save, Loader2, LogOut, ChevronRight, X, MapPin, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { Order } from '../types';

interface Profile {
    id: string;
    full_name: string | null;
    username: string | null;
    email: string | null;
    avatar_url: string | null;
}

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const { settings } = useSiteSettings();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const [fullName, setFullName] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        if (!user) return;

        setLoading(true);

        // Fetch profile
        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileData) {
            setProfile(profileData);
            setFullName(profileData.full_name || '');
        }

        // Fetch orders
        const { data: ordersData } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20);

        if (ordersData) {
            setOrders(ordersData as Order[]);
        }

        setLoading(false);
    };

    const handleSaveProfile = async () => {
        if (!user) return;

        setSaving(true);

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: fullName,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

        if (error) {
            alert('Gagal menyimpan profil');
        } else {
            setEditing(false);
            fetchData();
        }

        setSaving(false);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDateFull = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-700',
            confirmed: 'bg-blue-100 text-blue-700',
            preparing: 'bg-purple-100 text-purple-700',
            ready: 'bg-green-100 text-green-700',
            completed: 'bg-gray-100 text-gray-700',
            cancelled: 'bg-red-100 text-red-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            pending: 'Menunggu',
            confirmed: 'Dikonfirmasi',
            preparing: 'Diproses',
            ready: 'Siap Diambil',
            completed: 'Selesai',
            cancelled: 'Dibatalkan'
        };
        return labels[status] || status;
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-brand-green" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 bg-gray-50">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-brand-green mb-6"
                >
                    <ArrowLeft size={20} />
                    Kembali
                </button>

                <h1 className="text-3xl font-bold text-gray-800 mb-8">Profil Saya</h1>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="text-center mb-6">
                                <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User size={40} className="text-brand-green" />
                                </div>
                                <h2 className="font-bold text-xl text-gray-800">
                                    {profile?.full_name || 'User'}
                                </h2>
                                <p className="text-gray-500 text-sm">{profile?.email}</p>
                            </div>

                            {editing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl mt-1"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="flex-1 bg-brand-green text-white py-2 rounded-xl flex items-center justify-center gap-2"
                                        >
                                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                            Simpan
                                        </button>
                                        <button
                                            onClick={() => setEditing(false)}
                                            className="px-4 py-2 border border-gray-200 rounded-xl"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200"
                                >
                                    <Edit2 size={16} />
                                    Edit Profil
                                </button>
                            )}

                            <button
                                onClick={() => signOut()}
                                className="w-full mt-4 text-red-500 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-red-50"
                            >
                                <LogOut size={16} />
                                Keluar
                            </button>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                                    <Package size={24} className="text-brand-green" />
                                    Riwayat Pesanan
                                </h3>
                            </div>

                            {orders.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <Package size={48} className="mx-auto mb-3 opacity-50" />
                                    <p>Belum ada pesanan</p>
                                    <Link to="/menu" className="text-brand-green font-medium mt-2 inline-block">
                                        Mulai Pesan →
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div
                                            key={order.id}
                                            onClick={() => setSelectedOrder(order)}
                                            className="border border-gray-100 rounded-xl p-4 hover:border-brand-green/30 hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <span className="font-mono text-sm font-medium text-brand-green">
                                                        {order.order_number}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                                        <Clock size={12} />
                                                        {formatDate(order.created_at)}
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-600">
                                                    {order.order_type === 'pickup' ? '📦 Pickup' : '🍽️ Reservasi'}
                                                    {order.items?.length > 0 && (
                                                        <span className="ml-2">• {order.items.length} item</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {order.subtotal > 0 && (
                                                        <span className="font-bold text-gray-800">
                                                            Rp {order.subtotal.toLocaleString('id-ID')}
                                                        </span>
                                                    )}
                                                    <ChevronRight size={16} className="text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white rounded-t-2xl">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Detail Pesanan</h2>
                                <p className="text-brand-green font-mono text-sm">{selectedOrder.order_number}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status */}
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Status</span>
                                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                                    {getStatusLabel(selectedOrder.status)}
                                </span>
                            </div>

                            {/* Order Info */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tipe</span>
                                    <span className="font-medium">
                                        {selectedOrder.order_type === 'pickup' ? '📦 Pickup Order' : '🍽️ Reservasi Meja'}
                                    </span>
                                </div>
                                {selectedOrder.pickup_time && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Waktu</span>
                                        <span className="font-medium">{formatDateFull(selectedOrder.pickup_time)}</span>
                                    </div>
                                )}
                                {selectedOrder.guest_count && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Jumlah Tamu</span>
                                        <span className="font-medium">{selectedOrder.guest_count} Orang</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Dibuat</span>
                                    <span className="font-medium">{formatDateFull(selectedOrder.created_at)}</span>
                                </div>
                            </div>

                            {/* Items */}
                            {selectedOrder.items && selectedOrder.items.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-3">Item Pesanan</h4>
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                                <div>
                                                    <span className="font-medium text-gray-800">{item.name}</span>
                                                    <span className="text-gray-400 ml-2">x{item.quantity}</span>
                                                </div>
                                                <span className="font-medium text-gray-800">
                                                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-200">
                                        <span className="font-bold text-gray-800">Total</span>
                                        <span className="font-bold text-xl text-brand-green">
                                            Rp {selectedOrder.subtotal.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            {selectedOrder.notes && (
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-2">Catatan</h4>
                                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-xl">{selectedOrder.notes}</p>
                                </div>
                            )}

                            {/* Location Info */}
                            <div className="bg-blue-50 rounded-xl p-4">
                                <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                                    <MapPin size={16} />
                                    Lokasi Pengambilan
                                </h4>
                                <p className="text-blue-700 text-sm mb-2">{settings.address}</p>
                                <div className="flex items-center gap-2 text-blue-600 text-sm">
                                    <Phone size={14} />
                                    {settings.phone}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
