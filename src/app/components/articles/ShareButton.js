'use client';
import { useEffect } from 'react';
import CustomButton from '../ui/CustomButton';

export default function ShareButton({ title, articleId }) {
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
        }).catch(console.error);
      } else {
        navigator.clipboard.writeText(`${shareText} - ${shareUrl}`)
          .then(() => {
            alert('Link berhasil disalin ke clipboard!');
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
    <CustomButton 
      id="share-btn" 
      title="Bagikan" 
      className="text-sm px-5 py-3" 
      role="button"
    />
  );
}