import Image from 'next/image';
import HIVQuiz from '@/app/components/articles/HIV-Quiz';
import CustomButton from '@/app/components/ui/CustomButton';
import ShareButton from '@/app/components/articles/ShareButton';
import CommentSection from '@/app/components/articles/CommentSection';
import CommentForm from '@/app/components/articles/CommentForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getArticle(id) {
  try {
    const response = await fetch(`https://server-risa.vercel.app/api/article/${id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data[0] : (data.data || data);
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export default async function ArticlePage({ params }) {
  const { id } = await params;
  const article = await getArticle(id);
  
  if (!article) {
    notFound();
  }

  const { title, imageUrl, imageAlt, content, opinion } = article;
  return (
    <>
      <section className="container my-12 mx-auto lg:flex items-center gap-6 overflow-hidden" id="article">
          <div className="p-6">
            <Image src={imageUrl} width={500} height={500} priority={true} className="w-full lg:w-4xl mb-4" alt={imageAlt} />

            <h1 className="mt-12 font-bold text-2xl md:text-3xl">{title}</h1>

            <div className="prose max-w-none mt-4">
              {/* Opinion Section */}
              {opinion && (
                <div className="mb-8" dangerouslySetInnerHTML={{ __html: opinion }} />
              )}
            </div>

            <div className="mt-12">
              {/* Main Content */}
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>

            <div className="p-6">
                <ShareButton title={title} articleId={id} />            
            </div>
          </div>

          {/*  Game */}
          <aside className="bg-white rounded-sm shadow-lg h-fit max-w-72 lg:w-1/2 p-6 ml-4">
              <div>
                  <h4 className="mb-2 font-medium">Drag & Drop Challenge</h4>
                  <Image src="/image/game-item.png" width={300} height={300} alt="Game Item" className="mb-4" />

                  <Link href="/drag-drop-game" target="_blank" rel="noopener noreferrer">
                      <CustomButton title='Coba Sekarang' className="text-xs px-4 py-2" role="button" />
                  </Link>
              </div>
          </aside>

          {/* Initialize quiz for HIV article */}
          {(id === '1' || id === '4') && <HIVQuiz articleId={id} />}
      </section>

      <section className="container my-12 pt-12 border-1 border-transparent border-t-gray-200 mx-auto px-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">💬 Bagikan Pengalamanmu</h3>
        <p className="text-gray-600 mb-6">Ceritakan apa yang sudah kamu pelajari atau hal yang masih ingin kamu tahu</p>
        
        <CommentForm />
        <CommentSection />
      </section>
    </>
  );
}
