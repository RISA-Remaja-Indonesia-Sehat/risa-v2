'use client';

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useArticleStore from "@/app/store/useArticleStore";

export default function ArticleCard() {
   const { articles, fetchArticles, loading, error } = useArticleStore();

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    if (loading) return <p className="p-6 text-gray-600">Loading articles...</p>;
    if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  
    if (!articles || articles.length === 0) {
        return <div className="text-center py-10">Tidak ada artikel tersedia.</div>;
    }
    
    return (
        <>
            {articles.map((article) => (
                <div key={article.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-pink-200 transition-all duration-300 group">
                    <Link href={`/article/${article.id}`} className="block">
                        <div className="aspect-video overflow-hidden">
                            <Image src={article.imageUrl} alt={article.imageAlt} width={400} height={225} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
            ))}
        </>
    );
}
