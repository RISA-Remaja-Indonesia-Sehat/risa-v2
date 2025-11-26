import { notFound } from 'next/navigation';

async function getArticle(id) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/article/${id}`,
      { cache: 'no-store' }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return Array.isArray(data) ? data[0] : data.data || data;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan | RISA',
      description: 'Artikel yang Anda cari tidak ditemukan.',
    };
  }

  const { title, imageUrl, content } = article;
  const description = content
    ? content.replace(/<[^>]*>/g, '').substring(0, 160)
    : 'Baca artikel edukatif tentang kesehatan reproduksi remaja perempuan di RISA.';

  return {
    title: `${title} | RISA - Edukasi Kesehatan Reproduksi`,
    description,
    keywords: ['artikel', 'kesehatan reproduksi', 'edukasi', 'remaja perempuan'],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://risa.app/article/${id}`,
      siteName: 'RISA',
      locale: 'id_ID',
      images: [
        {
          url: imageUrl || 'https://risa.app/image/og-article.png',
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl || 'https://risa.app/image/og-article.png'],
      creator: '@risaofficial',
    },
  };
}

export default function ArticleIdLayout({ children }) {
  return children;
}
