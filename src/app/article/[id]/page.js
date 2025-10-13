'use client';

import Image from 'next/image';
import HIVQuiz from '@/app/components/articles/HIV-Quiz';
import CustomButton from '@/app/components/ui/CustomButton';
import useArticleStore from '@/app/store/useArticleStore';
import { useParams } from 'next/navigation';
import CommentSection from '@/app/components/articles/CommentSection';
import CommentForm from '@/app/components/articles/CommentForm';

export default function ArticlePage() {
  const params = useParams();
  const { getArticleById } = useArticleStore();
  const article = getArticleById(params.id);

  if (!article) {
    return <div className="container mx-auto px-4 py-8">Artikel tidak ditemukan</div>;
  }

  return (
    <>
      <section className="container my-12 mx-auto lg:flex items-center gap-6 overflow-hidden" id="article">
          <div className="p-6">
            <Image src={article.img} width={500} height={500} className="w-full lg:w-4xl mb-4" alt={article.imgAlt} />

            <h1 className="mt-12 font-bold text-2xl md:text-3xl">{article.title}</h1>

            <div className="prose max-w-none mt-4">
              {/* Opinion Section */}
              {article.opinion && (
                <div className="mb-8" dangerouslySetInnerHTML={{ __html: article.opinion }} />
              )}
            </div>

            <div className="mt-12">
              {/* Main Content */}
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>

            <div className="p-6">
                <CustomButton id="share-btn" title="Bagikan" className="text-sm px-5 py-3" role="button"/>            
            </div>
          </div>

          {/*  Game */}
          <aside className="bg-white rounded-sm shadow-lg h-fit max-w-72 lg:max-w-1/5 p-6 ml-4">
              <div>
                  <h4 className="mb-2 font-medium">Drag & Drop Challenge</h4>
                  <Image src="/image/game-item.png" width={100} height={100} alt="Game Item" className="mb-4" />

                  <a href="dragNdrop.html">
                      <CustomButton title='Coba Sekarang' className="text-xs px-4 py-2" role="button" />
                  </a>
              </div>
          </aside>

          {/* Initialize quiz for HIV article */}
          {article.id === 1 && <HIVQuiz />}
      </section>

      <section className="container my-12 pt-12 border-1 border-transparent border-t-gray-200 mx-auto px-4">
        <CommentForm />
        <CommentSection />
      </section>
    </>
  );
}
