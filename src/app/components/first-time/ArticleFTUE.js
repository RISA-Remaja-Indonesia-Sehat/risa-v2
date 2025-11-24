'use client';
import { useState, useEffect } from 'react';
import AvatarDialog from './AvatarDialog';
import GUIDE_DATA from './guideData';

export default function ArticleFTUE() {
  const [showDialog, setShowDialog] = useState(false);
  const [highlightElement, setHighlightElement] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const ftueStep = localStorage.getItem('ftue-step');
    
    if (token && ftueStep === '3') {
      const handleScroll = () => {
        const article = document.querySelector('#article');
        if (!article) return;
        
        const rect = article.getBoundingClientRect();
        const isAtBottom = rect.bottom <= window.innerHeight + 100;
        
        if (isAtBottom && !showDialog) {
          setShowDialog(true);
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
