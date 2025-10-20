'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react';

import CustomButton from '../components/ui/CustomButton';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const nav = document.querySelector('nav');
    const footer = document.querySelector('footer');

    const previousNavDisplay = nav?.style.display;
    const previousFooterDisplay = footer?.style.display;

    if (nav) nav.style.display = 'none';
    if (footer) footer.style.display = 'none';

    return () => {
      if (nav) nav.style.display = previousNavDisplay ?? '';
      if (footer) footer.style.display = previousFooterDisplay ?? '';
    };
  }, []);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const nextErrors = { email: '', password: '' };
    const email = formValues.email.trim();
    const password = formValues.password.trim();

    if (!email) {
      nextErrors.email = 'Email wajib diisi';
    } else if (!emailPattern.test(email)) {
      nextErrors.email = 'Alamat email tidak valid';
    }

    if (!password) {
      nextErrors.password = 'Password wajib diisi';
    } else if (password.length < 8) {
      nextErrors.password = 'Password minimal 8 karakter';
    }

    setErrors(nextErrors);
    return !nextErrors.email && !nextErrors.password;
  };

  const handleChange = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const { email, password } = formValues;
      const response = await fetch('https://server-risa.vercel.app/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        router.push('/');
      } else {
        setErrors({ email: '', password: 'Email atau password salah' });
      }
    } catch (error) {
      setErrors({ email: '', password: 'Terjadi kesalahan, coba lagi' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-white px-4 pt-6 pb-12 sm:items-center sm:bg-[#ffe6f1]">
      <div className="w-full max-w-lg rounded-none bg-white px-6 py-10 shadow-none sm:rounded-3xl sm:shadow-xl sm:px-10">
        <div className="mx-auto w-full space-y-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-pink-500 transition hover:text-pink-600">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Kembali
            </Link>
            <div />
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Selamat datang!</h1>
            <p className="text-sm text-pink-500 sm:text-base">Masuk ke akunmu untuk mengakses semua fitur RISA</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <label className="block">
              <span className="sr-only">Email</span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition focus-within:border-pink-300 focus-within:ring-2 focus-within:ring-pink-100">
                <Mail className="h-5 w-5 text-slate-400" aria-hidden="true" />
                <input type="email" required placeholder="Email" className="w-full border-0 bg-transparent text-slate-700 placeholder:text-slate-400 focus:outline-none" value={formValues.email} onChange={handleChange('email')} />
              </div>
              {errors.email ? <p className="mt-2 text-xs text-rose-500">{errors.email}</p> : null}
            </label>

            <label className="block">
              <span className="sr-only">Password</span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition focus-within:border-pink-300 focus-within:ring-2 focus-within:ring-pink-100">
                <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  className="w-full border-0 bg-transparent text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  value={formValues.password}
                  onChange={handleChange('password')}
                />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="text-slate-400 transition hover:text-pink-500 focus:outline-none" aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              {errors.password ? <p className="mt-2 text-xs text-rose-500">{errors.password}</p> : null}
            </label>

            <div className="flex justify-end">
              <Link href="#" className="text-sm font-medium text-slate-400 transition hover:text-pink-500">
                Lupa Password?
              </Link>
            </div>

            <CustomButton 
              type="submit" 
              title={loading ? "Memproses..." : "Masuk"} 
              className="w-full py-3 text-base text-[#382b22] flex items-center justify-center" 
              disabled={loading}
            />
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">atau</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => console.log('Google login')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 border-2 border-gray-300 rounded-2xl shadow-lg transform transition-all duration-150 hover:bg-gray-50 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            style={{
              boxShadow: '0 4px 0 #d1d5db, 0 6px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Masuk dengan Google
          </button>

          <p className="text-center text-sm text-slate-500">
            Belum memiliki akun?{' '}
            <Link href="/register" className="font-semibold text-pink-500 hover:text-pink-600">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
