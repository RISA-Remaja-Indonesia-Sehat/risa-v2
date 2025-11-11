"use client";
import { useEffect, useState } from "react";
import { ExternalLink, Sparkles } from "lucide-react";
import useSiklusStore from "../../store/useSiklusStore";
import Image from "next/image";
import { Spinner } from "../ui/spinner";

const ArticleRecommendations = () => {
  const { recommendedArticles, currentPhase } = useSiklusStore();
  const [articles, setArticles] = useState([]);

  // Data artikel statis
  const ARTICLES_DATA = {
    3: {
      id: 3,
      title: "Menstruasi Pertama: Kenapa Bisa Terjadi dan Gak Usah Takut!",
      imageUrl: "/image/article-image-3.png",
      imageAlt: "Ilustrasi menstruasi pertama",
      description: "Panduan lengkap tentang menstruasi pertama untuk remaja",
    },
    5: {
      id: 5,
      title: "Pubertas Perempuan: Kenali Tubuhmu dan Jaga Nilai Dirimu!",
      imageUrl: "/image/article-image-5.jpg",
      imageAlt: "Ilustrasi pubertas perempuan",
      description: "Memahami perubahan tubuh saat pubertas",
    },
    7: {
      id: 7,
      title:
        'Mengenal Fase Menstruasi: Waktunya Tubuhmu "Reset" dan Bersih-Bersih',
      imageUrl: "/image/article-image-7.png",
      imageAlt: "Ilustrasi fase menstruasi",
      description: "Panduan lengkap tentang fase menstruasi",
    },
    8: {
      id: 8,
      title:
        'Mengenal Fase Luteal: Waktunya Tubuhmu "Istirahat" Sebelum Bulan Merah',
      imageUrl: "/image/article-image-8.png",
      imageAlt: "Ilustrasi fase luteal",
      description: "Memahami fase luteal dalam siklus menstruasi",
    },
    9: {
      id: 9,
      title: 'Mengenal Fase Ovulasi: Waktunya Tubuhmu Siap "Beraksi"!',
      imageUrl: "/image/article-image-9.png",
      imageAlt: "Ilustrasi fase ovulasi",
      description: "Panduan tentang fase ovulasi dan kesuburan",
    },
    10: {
      id: 10,
      title: "Mengenal Fase Folikular: Waktunya Tubuhmu Bersinar!",
      imageUrl: "/image/article-image-10.png",
      imageAlt: "Ilustrasi fase folikular",
      description: "Memahami fase folikular dan energi tubuh",
    },
  };

  useEffect(() => {
    if (recommendedArticles.length > 0) {
      const articleList = recommendedArticles
        .map((id) => ARTICLES_DATA[id])
        .filter((article) => article);
      setArticles(articleList);
    }
  }, [recommendedArticles]);



  if (!currentPhase && articles.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-200 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-pink-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Rekomendasi Artikel
          </h3>
          <p className="text-gray-600">
            Mulai catat siklus menstruasimu untuk mendapatkan rekomendasi
            artikel yang sesuai dengan fase yang kamu alami!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-pink-500" />
        Kamu bisa baca artikel ini juga
      </h3>

      {articles.length > 0 ? (
        <div className="grid gap-4">
          {articles.slice(0, 3).map((article, index) => (
            <div
              key={article.id || `article-${index}`}
              className={`rounded-xl p-4 group hover:shadow-pink-200/50 transition-all duration-300 transform hover:scale-105 border hover:border-pink-500 cursor-pointer`}
              onClick={() => {
                if (article.id) {
                  window.open(`/article/${article.id}`, "_blank");
                }
              }}
            >
              <div className="flex gap-4">
                <Image
                  src={article.imageUrl}
                  alt={article.imageAlt}
                  width={200}
                  height={200}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-pink-500">
                    {article.title}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                    {article.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ExternalLink className="w-4 h-4" />
                    <span>Baca selengkapnya</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : recommendedArticles.length > 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-gray-500 mb-2">
            Artikel tidak ditemukan untuk ID: {recommendedArticles.join(", ")}
          </p>
          <p className="text-sm text-gray-400">
            Periksa console untuk detail error
          </p>
        </div>
      ) : (
        <Spinner className="size-6 text-pink-500 mx-auto my-3" />
      )}
    </div>
  );
};

export default ArticleRecommendations;
