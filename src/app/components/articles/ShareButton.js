'use client';
import { useEffect, useState } from 'react';
import CustomButton from '../ui/CustomButton';
import useMissions from '../../store/useMissions';
import useStickers from '../../store/useStickers';
import StickerRewardAnimation from '../ui/StickerRewardAnimation';

export default function ShareButton({ title, articleId }) {
  const { trackShare } = useMissions();
  const { addStickers } = useStickers();
  const [showAnimation, setShowAnimation] = useState(false);
  
  useEffect(() => {
    const shareBtn = document.getElementById('share-btn');
    if (!shareBtn) return;

    const shareArticle = () => {
      const shareText = `${title} - RISA`;
      const shareUrl = `${window.location.origin}/article/${articleId}`;
      
      if (navigator.share) {
        navigator.share({
          title: title,
          text: shareText,
          url: shareUrl
        }).then(() => {
          trackShare(addStickers, () => setShowAnimation(true));
        }).catch(console.error);
      } else {
        navigator.clipboard.writeText(`${shareText} - ${shareUrl}`)
          .then(() => {
            trackShare(addStickers, () => setShowAnimation(true));
          })
          .catch(() => {
            alert('Gagal menyalin link');
          });
      }
    };

    shareBtn.addEventListener('click', shareArticle);

    return () => {
      shareBtn.removeEventListener('click', shareArticle);
    };
  }, [title, articleId]);

  return (
    <>
      <CustomButton 
        id="share-btn" 
        title="Bagikan" 
        className="text-sm px-5 py-3" 
        role="button"
      />
      <StickerRewardAnimation 
        show={showAnimation} 
        onComplete={() => setShowAnimation(false)} 
      />
    </>
  );
}