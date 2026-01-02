import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Loader2, UserCog, Shield, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface Profile {
    id: string;
    email: string | null;
    full_name: string | null;
    role: 'admin' | 'user';
    avatar_url: string | null;
    username: string | null;
}

const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleting, setDeleting] = useState<string | null>(null);
    const { user: currentUser } = useAuth();

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('role', { ascending: true });

        console.log('Users fetch result:', { data, error });

        if (error) {
            console.error('Error fetching users:', error);
        } else {
            setUsers(data as Profile[] || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';

        if (userId === currentUser?.id) {
            alert("Anda tidak bisa mengubah role Anda sendiri.");
            return;
        }

        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) {
            console.error('Error updating role:', error);
            alert('Gagal mengubah role.');
        } else {
            fetchUsers();
        }
    };

    const deleteUser = async (userId: string, email: string | null) => {
        if (userId === currentUser?.id) {
            alert("Anda tidak bisa menghapus diri sendiri.");
            return;
        }

        if (!window.confirm(`Yakin ingin menghapus user ${email || 'ini'}? Tindakan ini tidak dapat dibatalkan.`)) {
            return;
        }

        setDeleting(userId);

        // Delete from profiles table (auth.users cannot be deleted from client)
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId);

        if (error) {
            console.error('Error deleting user:', error);
            alert('Gagal menghapus user. ' + error.message);
        } else {
            fetchUsers();
        }

        setDeleting(null);
    };

    const filteredUsers = searchTerm
        ? users.filter(user =>
            (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.username || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
        : users;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen User</h1>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Cari user (nama atau email)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:outline-none"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600">User</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Email</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Role</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <Loader2 className="animate-spin" size={20} />
                                            Loading users...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        Tidak ada user ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((profile) => (
                                    <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                                                    {profile.avatar_url ? (
                                                        <img src={profile.avatar_url} alt={profile.full_name || ''} className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        (profile.full_name?.[0] || profile.email?.[0] || '?').toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{profile.full_name || 'Tanpa Nama'}</div>
                                                    {profile.username && <div className="text-sm text-gray-400">@{profile.username}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {profile.email || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${profile.role === 'admin'
                                                ? 'bg-purple-50 text-purple-600 border-purple-100'
                                                : 'bg-gray-50 text-gray-600 border-gray-100'
                                                }`}>
                                                {profile.role === 'admin' ? <Shield size={12} /> : <UserCog size={12} />}
                                                {profile.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => toggleRole(profile.id, profile.role)}
                                                    disabled={profile.id === currentUser?.id}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${profile.id === currentUser?.id
                                                        ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                                                        : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                                                        }`}
                                                >
                                                    {profile.role === 'admin' ? 'Set User' : 'Set Admin'}
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(profile.id, profile.email)}
                                                    disabled={profile.id === currentUser?.id || deleting === profile.id}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${profile.id === currentUser?.id
                                                        ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                                                        : 'bg-red-50 border border-red-200 hover:bg-red-100 text-red-600'
                                                        }`}
                                                >
                                                    {deleting === profile.id ? (
                                                        <Loader2 size={12} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={12} />
                                                    )}
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsersPage;
