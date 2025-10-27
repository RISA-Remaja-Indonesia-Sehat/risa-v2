'use client';

import { useEffect, useState } from 'react';
import useMissions from '../../store/useMissions';
import useStickers from '../../store/useStickers';
import StickerRewardAnimation from '../ui/StickerRewardAnimation';

export default function ArticleTracker() {
  const { trackArticleRead } = useMissions();
  const { addStickers, updateStickersToServer } = useStickers();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;

      // When user reaches 90% of article, count as read
      if (scrollPercentage >= 90) {
        trackArticleRead(addStickers, () => setShowAnimation(true), updateStickersToServer);
        console.log("Di bawah track article read");
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackArticleRead, addStickers]);

  return (
    <StickerRewardAnimation 
      show={showAnimation} 
      onComplete={() => setShowAnimation(false)} 
    />
  );
}