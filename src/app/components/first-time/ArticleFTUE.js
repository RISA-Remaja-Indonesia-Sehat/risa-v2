'use client';
import { useState, useEffect } from 'react';
import AvatarDialog from './AvatarDialog';
import GUIDE_DATA from './guideData';

export default function ArticleFTUE() {
  const [showDialog, setShowDialog] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const ftueStep = localStorage.getItem('ftue-step');
    
    if (token && ftueStep === '3') {
      setShowScrollHint(true);
      
      const handleScroll = () => {
        const article = document.querySelector('#article');
        if (!article) return;
        
        const rect = article.getBoundingClientRect();
        const isAtBottom = rect.bottom <= window.innerHeight + 100;
        
        if (isAtBottom && !showDialog) {
          setShowDialog(true);
          setShowScrollHint(false);
          window.removeEventListener('scroll', handleScroll);
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [showDialog]);

  const handleDialogClose = () => {
    setShowDialog(false);
    localStorage.setItem('ftue-step', '4');
  };

  const button = {
    type: 'link',
    label: 'Ke Siklusku',
    href: '/siklusku',
    onBeforeNavigate: () => {
      localStorage.setItem('ftue-step', '4');
    }
  };

  return (
    <>
      {showScrollHint && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 animate-bounce">
          <div className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
            <span>👇</span> Scroll ke bawah untuk lanjut
          </div>
        </div>
      )}
      
      {showDialog && (
        <AvatarDialog
          message={GUIDE_DATA.dialog6}
          onClose={handleDialogClose}
          show={showDialog}
          button={button}
        />
      )}
    </>
  );
}
