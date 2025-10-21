'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import CustomButton from '../components/ui/CustomButton';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

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

  const handleChange = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const nextErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    const name = formValues.name.trim();
    const email = formValues.email.trim();
    const password = formValues.password.trim();
    const confirmPassword = formValues.confirmPassword.trim();

    if (!name) {
      nextErrors.name = 'Nama wajib diisi';
    }

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

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (confirmPassword.length < 8) {
      nextErrors.confirmPassword = 'Konfirmasi password minimal 8 karakter';
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Konfirmasi password harus sama';
    }

    setErrors(nextErrors);
    return Object.values(nextErrors).every((message) => !message);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { name, email, password } = formValues;
      const response = await fetch('https://server-risa.vercel.app/api/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();

      if (response.ok) {
        alert('Registrasi berhasil! Silakan login.');
        router.push('/login');
      } else {
        setErrors({ 
          name: '', 
          email: data.message || 'Email sudah terdaftar', 
          password: '', 
          confirmPassword: '' 
        });
      }
    } catch (error) {
      setErrors({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: 'Terjadi kesalahan, coba lagi' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const response = await fetch('https://server-risa.vercel.app/api/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: decoded.name, 
          email: decoded.email, 
          password: 'google-oauth-' + decoded.sub 
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user || { name: decoded.name, email: decoded.email }));
        router.push('/');
      } else {
        alert(data.message || 'Email sudah terdaftar');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat mendaftar dengan Google');
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
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Mari bergabung dengan RISA</h1>
            <p className="text-sm text-pink-500 sm:text-base">Daftar akunmu dengan mengisi data di bawah ini</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <label className="block">
              <span className="sr-only">Name</span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition focus-within:border-pink-300 focus-within:ring-2 focus-within:ring-pink-100">
                <User className="h-5 w-5 text-slate-400" aria-hidden="true" />
                <input type="text" placeholder="Name" className="w-full border-0 bg-transparent text-slate-700 placeholder:text-slate-400 focus:outline-none" name='name' autoComplete="on" value={formValues.name} onChange={handleChange('name')} />
              </div>
              {errors.name ? <p className="mt-2 text-xs text-rose-500">{errors.name}</p> : null}
            </label>

            <label className="block">
              <span className="sr-only">Email</span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition focus-within:border-pink-300 focus-within:ring-2 focus-within:ring-pink-100">
                <Mail className="h-5 w-5 text-slate-400" aria-hidden="true" />
                <input type="email" placeholder="Email" className="w-full border-0 bg-transparent text-slate-700 placeholder:text-slate-400 focus:outline-none" name='email' autoComplete="on" value={formValues.email} onChange={handleChange('email')} />
              </div>
              {errors.email ? <p className="mt-2 text-xs text-rose-500">{errors.email}</p> : null}
            </label>

            <label className="block">
              <span className="sr-only">Password</span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition focus-within:border-pink-300 focus-within:ring-2 focus-within:ring-pink-100">
                <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
                <input
                  type={showPassword ? 'text' : 'password'}
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

            <label className="block">
              <span className="sr-only">Konfirmasi password</span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition focus-within:border-pink-300 focus-within:ring-2 focus-within:ring-pink-100">
                <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Konfirmasi password"
                  className="w-full border-0 bg-transparent text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  value={formValues.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="text-slate-400 transition hover:text-pink-500 focus:outline-none"
                  aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}
                >
                  {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword ? <p className="mt-2 text-xs text-rose-500">{errors.confirmPassword}</p> : null}
            </label>

            <p className="text-xs text-slate-400">Dengan melanjutkan Anda menyetujui ketentuan penggunaan & kebijakan privasi RISA</p>

            <CustomButton type="submit" title={loading ? "Memproses..." : "Daftar"}  className="w-full py-3 text-base text-[#382b22] flex items-center justify-center" disabled={loading} />
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">atau</span>
            </div>
          </div>

          <div className="w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert('Gagal mendaftar dengan Google')}
              theme="outline"
              size="large"
              text="signup_with"
              shape="rectangular"
              width="100%"
              locale="id"
              use_fedcm_for_prompt
            />
          </div>

          <p className="text-center text-sm text-slate-500">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-semibold text-pink-500 hover:text-pink-600">
              Masuk sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
