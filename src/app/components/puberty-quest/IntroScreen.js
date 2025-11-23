"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function IntroScreen({ message, onClose }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < message.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + message[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, message]);

  return (
    <div
      className="fixed inset-0 bg-zinc-500/80 z-50 flex items-center justify-center p-4 cursor-pointer"
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

          {/* Bubble Tail */}
          <div className="absolute left-0 top-1/2 transform -translate-x-3 -translate-y-1/2 w-6 h-6 bg-white border-l-4 border-b-4 border-pink-200 rotate-45"></div>
        </div>
      </div>

      {/* Tap Hint */}
      {currentIndex >= message.length && (
        <p className="absolute bottom-4 sm:bottom-8 text-white text-xs sm:text-sm animate-pulse">
          Tap di mana saja untuk melanjutkan
        </p>
      )}
    </div>
  );
}
