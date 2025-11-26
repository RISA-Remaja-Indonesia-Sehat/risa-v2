export const metadata = {
  title: 'Artikel & Topik | RISA - Edukasi Kesehatan Reproduksi Remaja',
  description: 'Temukan berbagai artikel menarik tentang kesehatan reproduksi, pubertas, menstruasi, dan edukasi seks yang ditulis khusus untuk remaja perempuan Indonesia.',
  keywords: ['artikel', 'kesehatan reproduksi', 'pubertas', 'menstruasi', 'edukasi seks', 'remaja perempuan'],
  openGraph: {
    title: 'Artikel & Topik | RISA',
    description: 'Baca artikel edukatif tentang kesehatan reproduksi remaja perempuan',
    type: 'website',
    url: 'https://risa.app/article',
    siteName: 'RISA',
    locale: 'id_ID',
    images: [
      {
        url: 'https://risa.app/image/og-article.png',
        width: 1200,
        height: 630,
        alt: 'RISA - Artikel Kesehatan Reproduksi',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artikel & Topik | RISA',
    description: 'Baca artikel edukatif tentang kesehatan reproduksi remaja perempuan',
    images: ['https://risa.app/image/og-article.png'],
    creator: '@risaofficial',
  },
};

export default function ArticleLayout({ children }) {
  return children;
}
