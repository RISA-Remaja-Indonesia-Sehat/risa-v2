import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Artikel Tidak Ditemukan</h2>
      <p className="text-gray-600 mb-8">Artikel yang Anda cari tidak tersedia atau telah dihapus.</p>
      <Link 
        href="/article" 
        className="inline-flex items-center px-6 py-3 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-colors"
      >
        Kembali ke Artikel
      </Link>
    </div>
  );
}