import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Lock, Mail, AlertCircle, Loader2, User } from 'lucide-react';

const RegisterForm: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Password tidak cocok!");
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    avatar_url: '', // Optional default
                }
            }
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setLoading(false);
            // Supabase default: auto sign in after sign up if email confirmation is disabled,
            // or requires email confirmation.
            alert("Registrasi berhasil! Silakan cek email Anda untuk verifikasi atau login.");
            navigate('/login');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[500px] px-4">
            <div className="bg-white p-8 rounded-[30px] shadow-xl border border-gray-100 max-w-md w-full">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-brand-dark mb-2">Buat Akun Baru</h2>
                    <p className="text-gray-500">Bergabunglah dan nikmati hidangan lezat</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 flex items-start gap-3 text-sm">
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Nama Anda"
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:outline-none transition-colors"
                                required
                            />
                        </div>
                    </div>

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

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Konfirmasi Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Daftar Sekarang'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="text-brand-green font-bold hover:underline">
                        Masuk disini
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
