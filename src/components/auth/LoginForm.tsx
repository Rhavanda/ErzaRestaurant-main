import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setLoading(false);
            navigate('/');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[500px] px-4">
            <div className="bg-white p-8 rounded-[30px] shadow-xl border border-gray-100 max-w-md w-full">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-brand-dark mb-2">Selamat Datang</h2>
                    <p className="text-gray-500">Masuk untuk melanjutkan pesanan Anda</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 flex items-start gap-3 text-sm">
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@contoh.com"
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:outline-none transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:outline-none transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-green text-white font-bold py-4 rounded-xl hover:bg-[#4a8522] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Masuk Sekarang'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Belum punya akun?{' '}
                    <Link to="/register" className="text-brand-green font-bold hover:underline">
                        Daftar disini
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
