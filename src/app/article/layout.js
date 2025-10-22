import TooltipHandler from '@/app/components/articles/TooltipHandler';

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

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  
  if (!resolvedParams?.id) {
    return {
      title: 'Artikel - RISA'
    };
  }

  const article = await getArticle(resolvedParams.id);
  
  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan - RISA'
    };
  }

  return {
    title: `${article.title} - RISA`,
    description: article.description || article.title,
    openGraph: {
      title: article.title,
      description: article.description || article.title,
      images: [article.imageUrl]
    }
  };
}

export default function ArticleLayout({ children }) {
  return (
    <>
      <TooltipHandler />
      {children}
    </>
  );
}