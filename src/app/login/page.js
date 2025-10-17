'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react';

import CustomButton from '../components/ui/CustomButton';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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

  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      <div className="relative hidden flex-1 items-center justify-center bg-[#ffe6f1] lg:flex">
        <div className="relative mx-auto w-full max-w-2xl px-12 py-16">
          <Image src="/image/signin.png" alt="Ilustrasi remaja tersenyum memegang perangkat" width={720} height={720} priority className="h-auto w-full object-contain" />
        </div>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:max-w-xl lg:px-16">
        <div className="mx-auto w-full max-w-md space-y-8">
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

          <form className="space-y-5">
            <label className="block">
              <span className="sr-only">Email</span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition focus-within:border-pink-300 focus-within:ring-2 focus-within:ring-pink-100">
                <Mail className="h-5 w-5 text-slate-400" aria-hidden="true" />
                <input type="email" required placeholder="Email" className="w-full border-0 bg-transparent text-slate-700 placeholder:text-slate-400 focus:outline-none" />
              </div>
            </label>

            <label className="block">
              <span className="sr-only">Password</span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition focus-within:border-pink-300 focus-within:ring-2 focus-within:ring-pink-100">
                <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
                <input type={showPassword ? 'text' : 'password'} required placeholder="Password" className="w-full border-0 bg-transparent text-slate-700 placeholder:text-slate-400 focus:outline-none" />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="text-slate-400 transition hover:text-pink-500 focus:outline-none" aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </label>

            <div className="flex justify-end">
              <Link href="#" className="text-sm font-medium text-slate-400 transition hover:text-pink-500">
                Lupa Password?
              </Link>
            </div>

            <CustomButton type="button" title="Masuk" className="w-full py-3 text-base text-[#382b22]" onClick={() => router.push('/')} />

            <div className="flex items-center gap-4 text-xs uppercase tracking-wide text-slate-300">
              <span className="flex-1 border-t border-slate-200" />
              <span className="text-slate-400">Atau masuk dengan</span>
              <span className="flex-1 border-t border-slate-200" />
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-full border border-[#747775] bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4285f4]"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center">
                <svg viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
              </span>
              <span className="text-center">Masuk dengan Google</span>
              <span className="sr-only">Masuk dengan Google</span>
            </button>
          </form>

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
