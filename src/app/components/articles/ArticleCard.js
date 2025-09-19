import Image from "next/image";

//Perlu database untuk di looping
export default function ArticleCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-pink-200 transition-all duration-300 group">
        <a href="article-hiv.html" className="block">
            <div className="aspect-video overflow-hidden">
                <Image src="/image/article-image-1.png" alt="HIV Article" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-3 group-hover:text-pink-600 transition-colors">
                    HIV? Gak Usah Panik, Yuk Kenalan Dulu!
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                    Penasaran kenapa HIV sering dibilang serem? Yuk baca dulu biar gak salah paham dan tahu cara jaga diri dengan benar.
                </p>
                <div className="mt-4 flex items-center text-pink-500 text-sm font-medium">
                    Baca Selengkapnya
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
            </div>
        </a>
    </div>
  )
}
