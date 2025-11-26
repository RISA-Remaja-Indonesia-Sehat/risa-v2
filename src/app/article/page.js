import { Suspense } from 'react';
import ArticleCard from "../components/articles/ArticleCard";
import ArticleCardSkeleton from "../components/articles/ArticleCardSkeleton";
import ArticleFTUE from "../components/first-time/ArticleFTUE";

export default function ArticlePage() {
  return (
    <>
      <ArticleFTUE />
      <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-16">
          <div className="container mx-auto px-6 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  Artikel & Topik 📚
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Temukan berbagai artikel menarik tentang kesehatan reproduksi yang ditulis khusus untuk remaja seperti kamu!
              </p>
          </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                <span className="text-3xl mr-3">✨</span>
                Yang Baru-Baru Ini Ada di Halaman Utama
            </h2>
            <div className="w-20 h-1 bg-pink-500 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Suspense fallback={<ArticleCardSkeleton />}>
              <ArticleCard />
            </Suspense>
        </div>
      </section>
    </>
  )
}
