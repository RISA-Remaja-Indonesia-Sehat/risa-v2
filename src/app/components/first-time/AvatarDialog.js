'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AvatarDialog({ 
  message, 
  onClose, 
  show = true,
  button = null,
  highlightElement = null 
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (show && currentIndex < message.length) {
      if (currentIndex === 0) {
        audioRef.current = new Audio('/audio/keyboard-typing.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 1;
        audioRef.current.play().catch(() => {});
      }
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + message[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [currentIndex, message, show]);

  useEffect(() => {
    if (show) {
      setDisplayedText('');
      setCurrentIndex(0);
    }
  }, [show, message]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (!show) return null;

  const handleLinkClick = (e) => {
    e.preventDefault();
    if (button.onBeforeNavigate) {
      button.onBeforeNavigate();
    }
    setTimeout(() => {
      window.location.href = button.href;
    }, 100);
  };

  return (
    <>
      {/* Highlight Overlay */}
      {highlightElement && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div className="absolute inset-0 bg-slate-900/80"></div>
          <div 
            className="absolute border-4 border-yellow-400 rounded-lg shadow-2xl"
            style={{
              top: `${highlightElement.top}px`,
              left: `${highlightElement.left}px`,
              width: `${highlightElement.width}px`,
              height: `${highlightElement.height}px`,
              boxShadow: '0 0 30px rgba(250, 204, 21, 0.8)'
            }}
          ></div>
        </div>
      )}

      <div 
        className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4 cursor-pointer"
        onClick={onClose}
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 max-w-3xl w-full animate-fade-in">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Image
              src="/image/avatar.png"
              alt="Risa"
              width={100}
              height={100}
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-pink-300 shadow-2xl"
            />
          </div>

          {/* Dialog Bubble */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl flex-1 border-4 border-pink-200 relative w-full">
            <p className="text-xs sm:text-sm font-bold text-pink-600 mb-2 sm:mb-3">Risa</p>
            <p className="text-base sm:text-lg text-gray-800 leading-relaxed min-h-[80px] sm:min-h-[100px]">
              {displayedText}
              {currentIndex < message.length && (
                <span className="inline-block w-0.5 sm:w-1 h-4 sm:h-5 bg-pink-500 ml-1 animate-blink"></span>
              )}
            </p>

            {/* Button if provided */}
            {button && currentIndex >= message.length && (
              <div className="mt-4 flex gap-2">
                {button.type === 'link' ? (
                  <a
                    href={button.href}
                    onClick={handleLinkClick}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-semibold rounded-lg hover:from-pink-500 hover:to-rose-500 transition-all text-center cursor-pointer"
                  >
                    {button.label}
                  </a>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      button.onClick?.();
                    }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-semibold rounded-lg hover:from-pink-500 hover:to-rose-500 transition-all"
                  >
                    {button.label}
                  </button>
                )}
              </div>
            )}

            {/* Bubble Tail */}
            <div className="hidden sm:block absolute left-0 top-1/2 transform -translate-x-3 -translate-y-1/2 w-6 h-6 bg-white border-l-4 border-b-4 border-pink-200 rotate-45"></div>
          </div>
        </div>
        
        {/* Tap Hint */}
        {currentIndex >= message.length && !button && (
          <p className="absolute bottom-4 sm:bottom-8 text-white text-xs sm:text-sm animate-pulse">
            Tap di mana saja untuk melanjutkan
          </p>
        )}
      </div>
    </>
  );
}
