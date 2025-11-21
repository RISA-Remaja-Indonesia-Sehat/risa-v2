import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Trophy, Medal, Award, User } from 'lucide-react';

const LeaderboardRow = ({ player, rank, isTop3, isPlaceholder }) => {
  const rowRef = useRef(null);
  const scoreRef = useRef(null);

  // Animasi skor naik
  useEffect(() => {
    if (scoreRef.current && player.prevPoints !== undefined && player.prevPoints < player.totalPoints) {
      gsap.fromTo(scoreRef.current, 
        { scale: 1.1 }, 
        { scale: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [player.totalPoints, player.prevPoints]);

  // Animasi fade-in
  useEffect(() => {
    if (rowRef.current) {
      gsap.fromTo(rowRef.current, 
        { opacity: 0, y: 10 }, 
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", delay: rank * 0.05 }
      );
    }
  }, [rank]);

  // Ikon peringkat
  const getRankIcon = () => {
    if (rank === 1 && !isPlaceholder) return <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />;
    if (rank === 2 && !isPlaceholder) return <Medal className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />;
    if (rank === 3 && !isPlaceholder) return <Award className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />;
    return <span className="text-sm md:text-base font-bold text-pink-600">#{rank}</span>;
  };

  return (
    <div 
      ref={rowRef}
      className={`flex items-center justify-between p-3 md:p-4 rounded-lg bg-gradient-to-r from-pink-50 to-yellow-50 border border-pink-200 hover:bg-pink-100 hover:shadow-md transition-all duration-200 hover:scale-[1.02] ${
        isTop3 && !isPlaceholder ? 'ring-2 ring-yellow-300' : ''
      } ${isPlaceholder ? 'opacity-70 bg-pink-50' : ''}`}
    >
      {/* Badge Peringkat */}
      <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-pink-200 mr-2 md:mr-3 flex-shrink-0">
        {getRankIcon()}
      </div>

      {/* Avatar */}
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-pink-300 flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
        <User className="w-4 h-4 md:w-5 md:h-5 text-pink-700" />
      </div>

      {/* Nama dan Subteks Singkat */}
      <div className="flex-1 min-w-0 mr-2 md:mr-4">
        <p className={`font-bold truncate text-sm md:text-base ${rank === 1 ? 'text-yellow-700' : 'text-pink-700'} ${isPlaceholder ? 'text-pink-500' : ''}`}>
          {player.userName || 'Kosong'}
        </p>
        {rank === 1 && !isPlaceholder && (
          <span className="text-xs md:text-sm text-yellow-600 font-medium flex items-center gap-1">👑 Top Player!</span>
        )}
        {isPlaceholder && (
          <span className="text-xs md:text-sm text-pink-400 font-medium">Ambil sekarang! ✨</span>
        )}
      </div>

      {/* Skor */}
      <div className="text-right flex-shrink-0">
        <span ref={scoreRef} className={`text-lg md:text-xl font-extrabold ${rank === 1 ? 'text-yellow-600' : 'text-pink-700'} ${isPlaceholder ? 'text-gray-400' : ''}`}>
          {player.totalPoints}
        </span>
        <span className="text-xs md:text-sm text-gray-500 font-medium block">pts</span>
      </div>
    </div>
  );
};

export default LeaderboardRow;