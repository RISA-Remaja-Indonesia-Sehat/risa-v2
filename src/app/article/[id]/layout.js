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
    description: article.description || `Pelajari tentang ${article.title} - artikel kesehatan reproduksi untuk remaja Indonesia`,
    keywords: ['kesehatan reproduksi', 'remaja', 'HIV', 'HPV', 'edukasi kesehatan', 'RISA'],
    authors: [{ name: 'Tim Sulianti Saroso' }],
    openGraph: {
      title: article.title,
      description: article.description || `Pelajari tentang ${article.title} - artikel kesehatan reproduksi untuk remaja perempuan Indonesia`,
      images: [{
        url: article.imageUrl,
        width: 1200,
        height: 630,
        alt: article.imageAlt || article.title
      }],
      type: 'article',
      siteName: 'RISA - Remaja Indonesia Sehat'
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description || `Pelajari tentang ${article.title}`,
      images: [article.imageUrl]
    },
    robots: {
      index: true,
      follow: true
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