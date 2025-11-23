'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const BANNERS = [
  {
    id: 1,
    title: '🎮 Puberty Quest',
    subtitle: 'Game Edukatif Seru',
    description: 'Jelajahi 5 chapter menarik tentang pubertas dengan cara yang fun dan interaktif. Mainkan secara gratis sekarang!',
    gradient: 'from-pink-400 to-yellow-300',
    link: '/mini-game/puberty-quest',
    emoji: '🌸'
  },
  {
    id: 2,
    title: '✨ AI Insight Siklusku',
    subtitle: 'Fitur AI Terbaru',
    description: 'Dapatkan insight personal, rekomendasi makanan sehat, dan tips harian sesuai fase siklus dan mood kamu. Semua dipersonalisasi khusus untuk kamu!',
    gradient: 'from-purple-400 to-pink-300',
    link: '/siklusku',
    emoji: '🤖'
  }
];

export default function FeatureBannerCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const autoPlayRef = useRef(null);

  useEffect(() => {
    if (!isAutoPlay) return;
    
    autoPlayRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 5000);

    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlay]);

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrent((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrent((prev) => (prev + 1) % BANNERS.length);
  };

  const handleDotClick = (index) => {
    setIsAutoPlay(false);
    setCurrent(index);
  };

  return (
    <section className="container mx-auto my-16 px-4">
      <div className="relative">
        {/* Banner Container */}
        <div className="relative h-80 md:h-96 overflow-hidden rounded-3xl shadow-2xl">
          {BANNERS.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === current ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className={`bg-gradient-to-br ${banner.gradient} h-full flex items-center justify-between px-12 md:px-20`}>
                {/* Left Content */}
                <div className="flex-1 text-white z-10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">{banner.title}</h2>
                  <p className="text-lg md:text-xl font-semibold mb-4 text-white/90">{banner.subtitle}</p>
                  <p className="text-base md:text-lg mb-6 text-white/80 max-w-md leading-relaxed">
                    {banner.description}
                  </p>
                  <Link href={banner.link}>
                    <button className="bg-white text-pink-600 font-bold py-3 px-8 rounded-full hover:shadow-lg transition-all hover:scale-105">
                      Coba Sekarang →
                    </button>
                  </Link>
                </div>

                {/* Right Decoration */}
                <div className="hidden md:block flex-1 text-right">
                  <div className="text-8xl opacity-20">{banner.emoji}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6 text-pink-600" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
        >
          <ChevronRight className="w-6 h-6 text-pink-600" />
        </button>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-3 mt-6">
          {BANNERS.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`transition-all ${
                index === current
                  ? 'bg-pink-500 w-8 h-3 rounded-full'
                  : 'bg-gray-300 w-3 h-3 rounded-full hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
