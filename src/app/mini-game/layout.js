export const metadata = {
  title: 'Mini Games | RISA - Edukasi Kesehatan Reproduksi Remaja',
  description: 'Mainkan mini-games edukatif tentang kesehatan reproduksi, pubertas, dan edukasi seks. Kumpulkan poin dan naik di leaderboard!',
  keywords: ['mini-game', 'game edukatif', 'kesehatan reproduksi', 'edukasi seks', 'remaja perempuan', 'leaderboard'],
  openGraph: {
    title: 'Mini Games | RISA',
    description: 'Mainkan mini-games edukatif dan kumpulkan poin!',
    type: 'website',
    url: 'https://risa.app/mini-game',
    siteName: 'RISA',
    locale: 'id_ID',
    images: [
      {
        url: 'https://risa.app/image/og-minigame.png',
        width: 1200,
        height: 630,
        alt: 'RISA Mini Games - Edukasi Kesehatan Reproduksi',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mini Games | RISA',
    description: 'Mainkan mini-games edukatif dan kumpulkan poin!',
    images: ['https://risa.app/image/og-minigame.png'],
    creator: '@risaofficial',
  },
};

export default function MiniGameLayout({ children }) {
  return children;
}
