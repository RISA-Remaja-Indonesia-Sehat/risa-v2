import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image 
            src="/image/LogoRisa.png" 
            alt="RISA Logo" 
            width={120} 
            height={120} 
            className="mx-auto"
          />
        </div>

        {/* 404 Text */}
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-pink-500 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Ups! Halaman yang kamu cari tidak ada. 
            Mungkin linknya salah atau halaman sudah dipindah.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            href="/" 
            className="block w-full bg-pink-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-pink-600 transition-colors"
          >
            Kembali ke Beranda
          </Link>
          
          <Link 
            href="/siklusku" 
            className="block w-full border-2 border-pink-500 text-pink-500 py-3 px-6 rounded-full font-semibold hover:bg-pink-50 transition-colors"
          >
            Ke Siklusku
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Butuh bantuan? Hubungi tim RISA</p>
        </div>
      </div>
    </div>
  );
}