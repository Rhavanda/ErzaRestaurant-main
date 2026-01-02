import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Loader2, Eye, Check, X, Clock, Package, UtensilsCrossed, Filter } from 'lucide-react';
import { Order } from '../../types';

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    preparing: 'bg-purple-100 text-purple-700',
    ready: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700'
};

const statusLabels: Record<string, string> = {
    pending: 'Menunggu',
    confirmed: 'Dikonfirmasi',
    preparing: 'Diproses',
    ready: 'Siap',
    completed: 'Selesai',
    cancelled: 'Dibatalkan'
};

const AdminOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'pickup' | 'reservation'>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        let query = supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (filterType !== 'all') {
            query = query.eq('order_type', filterType);
        }
        if (filterStatus !== 'all') {
            query = query.eq('status', filterStatus);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching orders:', error);
        } else {
            setOrders(data as Order[] || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, [filterType, filterStatus]);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', orderId);

        if (error) {
            console.error('Error updating order:', error);
            alert('Gagal update status');
        } else {
            fetchOrders();
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus as Order['status'] });
            }
        }
    };

    const filteredOrders = orders.filter(order =>
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_phone?.includes(searchTerm)
    );

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Pesanan</h1>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari nomor pesanan, nama, HP..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:outline-none"
                    />
                </div>

                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:outline-none"
                >
                    <option value="all">Semua Tipe</option>
                    <option value="pickup">📦 Pickup</option>
                    <option value="reservation">🍽️ Reservasi</option>
                </select>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:outline-none"
                >
                    <option value="all">Semua Status</option>
                    <option value="pending">Menunggu</option>
                    <option value="confirmed">Dikonfirmasi</option>
                    <option value="preparing">Diproses</option>
                    <option value="ready">Siap</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                </select>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600">Pesanan</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Customer</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Tipe</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Waktu</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Total</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        <Loader2 className="animate-spin mx-auto" size={24} />
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        Tidak ada pesanan
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-medium text-brand-green">
                                                {order.order_number || '-'}
                                            </span>
                                            <div className="text-xs text-gray-400">
                                                {formatDate(order.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-800">{order.customer_name}</div>
                                            <div className="text-sm text-gray-500">{order.customer_phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${order.order_type === 'pickup'
                                                    ? 'bg-orange-100 text-orange-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {order.order_type === 'pickup' ? <Package size={12} /> : <UtensilsCrossed size={12} />}
                                                {order.order_type === 'pickup' ? 'Pickup' : 'Reservasi'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {order.pickup_time ? formatDate(order.pickup_time) : '-'}
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {order.subtotal > 0 ? `Rp ${order.subtotal.toLocaleString('id-ID')}` : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                                {statusLabels[order.status]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
                                                    title="Lihat Detail"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                {order.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                                            className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600"
                                                            title="Konfirmasi"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                                            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600"
                                                            title="Tolak"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Detail Pesanan</h2>
                                <p className="text-brand-green font-mono">{selectedOrder.order_number}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Customer</p>
                                    <p className="font-medium">{selectedOrder.customer_name}</p>
                                    <p className="text-sm text-gray-500">{selectedOrder.customer_phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Tipe</p>
                                    <p className="font-medium capitalize">{selectedOrder.order_type}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Waktu Pickup/Visit</p>
                                    <p className="font-medium">
                                        {selectedOrder.pickup_time ? formatDate(selectedOrder.pickup_time) : '-'}
                                    </p>
                                </div>
                                {selectedOrder.guest_count && (
                                    <div>
                                        <p className="text-sm text-gray-500">Jumlah Tamu</p>
                                        <p className="font-medium">{selectedOrder.guest_count} Orang</p>
                                    </div>
                                )}
                            </div>

                            {selectedOrder.items && selectedOrder.items.length > 0 && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Items</p>
                                    <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                                        {selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span>{item.name} x{item.quantity}</span>
                                                <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedOrder.notes && (
                                <div>
                                    <p className="text-sm text-gray-500">Catatan</p>
                                    <p className="text-sm">{selectedOrder.notes}</p>
                                </div>
                            )}

                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-500 mb-2">Update Status</p>
                                <div className="flex flex-wrap gap-2">
                                    {['confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => updateOrderStatus(selectedOrder.id, status)}
                                            disabled={selectedOrder.status === status}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedOrder.status === status
                                                    ? 'bg-brand-green text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {statusLabels[status]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrdersPage;
