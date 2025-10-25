import Image from "next/image";
import Link from "next/link";

async function getArticles() {
  try {
    const response = await fetch('https://server-risa.vercel.app/api/article');
    const data = await response.json();
    return Array.isArray(data) ? data : Object.values(data.data || {});
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export default async function ArticleCard() {
    const articles = await getArticles();
  
    if (!articles || articles.length === 0) {
        return <div className="text-center py-10">Tidak ada artikel tersedia.</div>;
    }
    
    return (
        <>
            {articles.map((article) => 
                <div key={article.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-pink-200 transition-all duration-300 group">
                    <Link href={`/article/${article.id}`} className="block">
                        <div className="aspect-video overflow-hidden">
                            {article.imageUrl && (
                                <Image 
                                    src={article.imageUrl} 
                                    alt={article.imageAlt || article.title || 'Article image'} 
                                    width={400} 
                                    height={225} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                />
                            )}
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold text-lg text-gray-800 mb-3 group-hover:text-pink-600 transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {article.description}
                            </p>
                            <div className="mt-4 flex items-center text-pink-500 text-sm font-medium">
                                Baca Selengkapnya
                                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </div>
                    </Link>
                </div>
            )}
        </>
    )
};