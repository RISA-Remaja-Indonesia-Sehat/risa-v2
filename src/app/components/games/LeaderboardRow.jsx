// components/LeaderboardRow.jsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Trophy, Crown, Zap, User, Target } from 'lucide-react'; 

/**
 * @typedef {Object} LeaderboardEntry
 * @property {number | string} userId 
 * @property {string} userName 
 * @property {number} totalPoints 
 * @property {boolean} [isPlaceholder]
 * @property {number} [prevPoints] // Untuk animasi perubahan skor
 */

/**
 * Komponen untuk men-render satu baris di Leaderboard
 * @param {object} props
 * @param {LeaderboardEntry} props.player
 * @param {number} props.rank
 * @param {boolean} props.isTop3
 * @param {boolean} props.isPlaceholder
 */
const LeaderboardRow = ({ player, rank, isTop3, isPlaceholder }) => {
    const rowRef = useRef(null);
    const scoreRef = useRef(null);

    // Animasi Bounce ketika skor berubah (Simulasi Real-Time)
    useEffect(() => {
        if (scoreRef.current) {
            if (player.prevPoints !== undefined && player.prevPoints < player.totalPoints) {
                gsap.fromTo(scoreRef.current, 
                    { scale: 1.2, color: '#f97316' }, // Skala besar, warna oranye (naik)
                    { scale: 1, color: '#DB2777', duration: 1, ease: "elastic.out(1, 0.5)" } // Kembali normal, warna pink
                );
            }
        }
    }, [player.totalPoints, player.prevPoints]);

    // Animasi Fade-in dan Top 3 
    useEffect(() => {
        if (rowRef.current) {
            gsap.fromTo(rowRef.current, 
                { opacity: 0, y: 30, scaleX: 0.95 },
                { opacity: 1, y: 0, scaleX: 1, duration: 0.8, ease: "power3.out", delay: rank * 0.1 }
            );
            
            // Animasi untuk Top 3 NYATA (Diperkuat)
            if (isTop3 && !isPlaceholder) { 
                gsap.to(rowRef.current, {
                    scale: 1.02,
                    duration: 0.4,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: rank * 0.1 + 0.5
                });
            }
        }
    }, [isTop3, rank, isPlaceholder]);

    // --- LOGIC STYLING ---
    const baseStyle = "flex items-center p-3 md:p-4 rounded-xl transition-all duration-300 shadow-lg transform hover:shadow-xl hover:scale-[1.01]";
    
    let rankBadge;
    let badgeStyle = "text-white w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center font-extrabold text-lg flex-shrink-0 shadow-xl";
    
    if (rank === 1 && !isPlaceholder) {
        rankBadge = <div className={`bg-gradient-to-r from-yellow-300 to-yellow-600 ${badgeStyle} ring-4 ring-amber-200/50`}>
            <Crown className='w-5 h-5 fill-white animate-pulse' />
        </div>;
    } else if (rank === 2 && !isPlaceholder) {
        rankBadge = <div className={`bg-gradient-to-r from-gray-300 to-gray-500 ${badgeStyle}`}>2</div>;
    } else if (rank === 3 && !isPlaceholder) {
        rankBadge = <div className={`bg-gradient-to-r from-orange-400 to-pink-500 ${badgeStyle}`}>3</div>;
    } else {
        rankBadge = (
            <span className={`text-xl font-black ${isPlaceholder ? 'text-gray-400' : 'text-gray-700'} w-8 md:w-10 flex-shrink-0`}>
                {rank}
            </span>
        );
    }

    let rowClasses = "bg-white border border-gray-100";
    if (rank === 1 && !isPlaceholder) {
        rowClasses = `bg-yellow-50 border-4 border-amber-400 ring-8 ring-amber-100/50 shadow-2xl`;
    } else if (isTop3 && !isPlaceholder) {
        rowClasses = `bg-pink-50 border-2 border-pink-300 ring-2 ring-pink-100/50`;
    } else if (isPlaceholder) {
        rowClasses = "bg-pink-50 border border-dashed border-pink-300 text-gray-500 italic shadow-inner hover:shadow-lg hover:bg-pink-100/50 cursor-pointer";
    }

    return (
        <div ref={rowRef} className={`${baseStyle} ${rowClasses}`}>
            {rankBadge}
            
            {/* Avatar */}
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden mx-3 flex-shrink-0 relative 
                ${isPlaceholder ? 'bg-pink-100/80' : (rank === 1 ? 'bg-amber-300 border-2 border-amber-600' : 'bg-pink-400') }
                flex items-center justify-center
            `}>
                
                {isPlaceholder ? (
                    <Target className='w-6 h-6 text-pink-400 opacity-60' /> 
                ) : rank === 1 ? (
                    <Trophy className='w-7 h-7 text-white fill-yellow-600' /> 
                ) : (
                    <User className='w-6 h-6 text-white' />
                )}
                
                {rank === 1 && !isPlaceholder && (
                    <Zap className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 fill-yellow-500 transform rotate-12 drop-shadow-md animate-ping-slow opacity-70"/>
                )}
            </div>

            <div className="flex-1 min-w-0 mr-4">
                <p className={`font-bold truncate ${rank === 1 ? 'text-amber-700 text-xl' : (isTop3 ? 'text-pink-800 text-lg' : 'text-gray-800 text-base')} ${isPlaceholder ? 'text-pink-500 font-semibold' : ''}`}>
                    {player.userName || 'Slot Kosong'} 
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                    {rank === 1 && !isPlaceholder && <span className="text-sm text-amber-600 font-extrabold flex items-center gap-1"><Crown className='w-4 h-4 fill-amber-500'/> RATU PANGGUNG!</span>}
                    {rank === 2 && !isPlaceholder && <span className="text-xs text-pink-600 font-medium">Hampir Puncak! Terus Melesat!</span>}
                    {rank === 3 && !isPlaceholder && <span className="text-xs text-pink-500 font-medium">Bidikan Top 2 Sudah Dekat!</span>}
                    {isPlaceholder && <span className="text-xs text-pink-400 font-medium">Sengit! Peringkat Ini Menantimu!</span>}
                </div>
            </div>

            {/* Skor */}
            <div className="text-right flex flex-col items-end flex-shrink-0">
                <span ref={scoreRef} className={`text-3xl md:text-4xl font-extrabold ${rank === 1 ? 'text-amber-600' : 'text-pink-700'} ${isPlaceholder ? 'text-gray-400' : ''}`}>
                    {player.totalPoints.toLocaleString()} 
                </span>
                <span className="text-xs text-gray-500 font-medium">POINTS</span>
            </div>
        </div>
    );
};

export default LeaderboardRow;