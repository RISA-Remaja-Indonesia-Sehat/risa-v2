'use client';

import { useState, useEffect } from 'react';

export default function StickerRewardAnimation({ show, onComplete }) {
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('hidden'); // hidden, rising, visible, falling

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setAnimationPhase('rising');
      
      // Phase 1: Rise up (0.5s)
      const riseTimer = setTimeout(() => {
        setAnimationPhase('visible');
      }, 500);
      
      // Phase 2: Stay visible (3s)
      const stayTimer = setTimeout(() => {
        setAnimationPhase('falling');
      }, 3500);
      
      // Phase 3: Fall down and hide (0.5s)
      const fallTimer = setTimeout(() => {
        setAnimationPhase('hidden');
        setIsVisible(false);
        onComplete?.();
      }, 4000);
      
      return () => {
        clearTimeout(riseTimer);
        clearTimeout(stayTimer);
        clearTimeout(fallTimer);
      };
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  const getAnimationClass = () => {
    switch (animationPhase) {
      case 'rising':
        return 'animate-bounce-up opacity-50';
      case 'visible':
        return 'translate-y-[-20vh] opacity-100';
      case 'falling':
        return 'translate-y-[100vh] opacity-0';
      default:
        return 'translate-y-[100vh] opacity-0';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-end justify-center">
      <div className={`
        bg-transparent 
        text-pink-500 px-6 py-3 text-shadow-2xs
        font-bold text-lg flex items-center gap-2
        transition-all duration-500 ease-out
        ${getAnimationClass()}
      `}>
        <p>+1 Stiker</p>
      </div>
      
      <style jsx>{`
        @keyframes bounce-up {
          0% { transform: translateY(100vh); opacity: 0; }
          50% { transform: translateY(-25vh); opacity: 1; }
          100% { transform: translateY(-20vh); opacity: 1; }
        }
        
        .animate-bounce-up {
          animation: bounce-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}