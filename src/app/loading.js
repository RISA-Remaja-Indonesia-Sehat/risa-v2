import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo */}
        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <Image src="/image/icon-risa.png" alt="Logo" width={40} height={40} />
        </div>
        
        {/* Brand */}
        <h1 className="text-2xl font-bold text-pink-600 mb-2">RISA</h1>
        <p className="text-gray-600 text-sm mb-8">Sahabat Kesehatan Reproduksimu</p>
        
        {/* Loading Dots */}
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-rose-400 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
}