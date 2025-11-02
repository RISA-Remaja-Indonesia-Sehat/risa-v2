// src/components/PinkProwessLeaderboard.jsx
"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import Confetti from 'react-confetti';
import { Trophy, Crown, TrendingUp, Zap, XCircle } from 'lucide-react';

// Import Zustand Store
import useUserScoreStore from '../../store/useUserScoreStore'; 

// --- KONSTANTA & TYPINGS (untuk kejelasan) ---

const API_ENDPOINT = 'https://server-risa.vercel.app/api/scores/leaderboard';
const PLACEHOLDER_COUNT = 10;

/**
 * @typedef {Object} LeaderboardEntry
 * @property {number} userId
 * @property {string} userName
 * @property {number} totalPoints
 */


// --- KOMPONEN BANTUAN ---

/**
 * Komponen untuk men-render satu baris di Leaderboard
 * @param {object} props
 * @param {LeaderboardEntry} props.player
 * @param {number} props.rank
 * @param {boolean} props.isTop3
 * @param {boolean} props.isCurrentUser
 */
const LeaderboardRow = ({ player, rank, isTop3, isCurrentUser }) => {
    const rowRef = useRef(null);

    // Animasi GSAP saat komponen dimuat atau di-highlight
    useEffect(() => {
        if (rowRef.current) {
            // Animasi Fade-in pada saat load
            gsap.fromTo(rowRef.current, 
                { opacity: 0, y: 30, scaleX: 0.95 },
                { opacity: 1, y: 0, scaleX: 1, duration: 0.8, ease: "power3.out", delay: rank * 0.1 }
            );
            
            // Animasi untuk Top 3 (glowing/bouncing)
            if (isTop3) {
                gsap.to(rowRef.current, {
                    scale: 1.03,
                    duration: 0.5,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: rank * 0.1 + 0.5
                });
            }

            // Animasi highlight untuk Current User
            if (isCurrentUser) {
                 gsap.to(rowRef.current, { 
                    boxShadow: "0 0 20px rgba(255, 100, 150, 0.8)", 
                    duration: 1, 
                    repeat: -1, 
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: rank * 0.1 + 1.2
                });
            }
        }
    }, [isTop3, rank, isCurrentUser]);

    const baseStyle = "flex items-center p-3 md:p-4 rounded-xl transition-all duration-300 shadow-md transform hover:shadow-xl hover:scale-[1.01]";
    
    // Styling Rank Badge
    let rankBadge = (
        <span className="text-xl font-black text-gray-700 w-8 md:w-10 flex-shrink-0">
            {rank}
        </span>
    );

    // Styling Top 3
    if (isTop3) {
        let badgeStyle = "text-white w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center font-extrabold text-lg flex-shrink-0 shadow-lg";
        if (rank === 1) {
            rankBadge = <div className={`bg-gradient-to-r from-yellow-400 to-amber-500 ${badgeStyle}`}>
                <Crown className='w-5 h-5 fill-white' />
            </div>;
        } else if (rank === 2) {
            rankBadge = <div className={`bg-gradient-to-r from-gray-400 to-gray-500 ${badgeStyle}`}>2</div>;
        } else if (rank === 3) {
            rankBadge = <div className={`bg-gradient-to-r from-yellow-700 to-amber-700 ${badgeStyle}`}>3</div>;
        }
    }

    // Styling Baris
    let rowClasses = "bg-white border border-gray-100";
    if (isTop3) {
        rowClasses = `bg-pink-50/80 border-2 ${rank === 1 ? 'border-amber-400' : 'border-pink-300'} ring-4 ring-pink-100/50`;
    } else if (isCurrentUser) {
        rowClasses = "bg-pink-200/90 border-2 border-pink-400 font-bold";
    }

    return (
        <div ref={rowRef} className={`${baseStyle} ${rowClasses} ${isCurrentUser ? 'z-10' : ''}`}>
            {rankBadge}
            
            {/* Avatar */}
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden mx-3 flex-shrink-0 relative">
              
                {isTop3 && (
                     // Badge Trophy untuk Top 3
                    <Trophy className="absolute -top-1 -right-1 w-5 h-5 text-yellow-500 fill-yellow-500 transform rotate-12 drop-shadow-md"/>
                )}
            </div>

            <div className="flex-1 min-w-0 mr-4">
                <p className={`font-bold truncate ${isTop3 ? 'text-pink-800 text-lg' : 'text-gray-800 text-base'}`}>
                    {player.userName} {isCurrentUser && ' (Anda)'}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                    {rank === 1 && <span className="text-xs text-amber-600 font-extrabold flex items-center gap-1"><Crown className='w-3 h-3'/> LEVEL MASTER!</span>}
                    {rank === 2 && <span className="text-xs text-pink-600 font-medium">Fantastis! Terus Kejar!</span>}
                    {rank === 3 && <span className="text-xs text-pink-500 font-medium">Ayo Level Up!</span>}
                    {isCurrentUser && !isTop3 && <span className="text-xs text-blue-500 font-semibold flex items-center gap-1"><TrendingUp className='w-3 h-3'/> Keep going!</span>}
                </div>
            </div>

            {/* Skor */}
            <div className="text-right flex flex-col items-end flex-shrink-0">
                <span className={`text-2xl md:text-3xl font-extrabold ${isTop3 ? 'text-pink-700' : 'text-pink-600'}`}>
                    {player.totalPoints}
                </span>
                <span className="text-xs text-gray-500 font-medium">POINTS</span>
            </div>
        </div>
    );
};


// --- KOMPONEN UTAMA LEADERBOARD ---
export default function PinkProwessLeaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    
    // Zustand State
    const currentScore = useUserScoreStore(state => state.currentScore);
    const currentUserId = useUserScoreStore(state => state.currentUserId);
    
    const containerRef = useRef(null);

    // 1. Fetch Data Leaderboard
    const fetchLeaderboard = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINT);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Menggabungkan data asli dengan placeholder jika kurang dari 10
            let topTen = data.data.slice(0, PLACEHOLDER_COUNT);
            
            // Tambahkan placeholder
            while (topTen.length < PLACEHOLDER_COUNT) {
                const rank = topTen.length + 1;
                topTen.push({
                    userId: 999 + rank,
                    userName: `Spot Kosong ${rank}`,
                    totalPoints: Math.max(0, topTen[topTen.length - 1]?.totalPoints - 10 || 0), // Skor turun 10 dari sebelumnya
                    isPlaceholder: true
                });
            }
            
            setLeaderboard(topTen);
            setError(null);
        } catch (e) {
            console.error("Gagal mengambil leaderboard:", e);
            setError("Gagal memuat leaderboard. Coba muat ulang.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    // 2. Animasi Global pada Load
    useEffect(() => {
        if (!loading && containerRef.current) {
            gsap.fromTo(containerRef.current, 
                { opacity: 0, scale: 0.98 }, 
                { opacity: 1, scale: 1, duration: 1.5, ease: "power4.out" }
            );
        }
    }, [loading]);

    // 3. Konfeti untuk Top Player (Simulasi jika user masuk top 3)
    useEffect(() => {
        const top3Players = leaderboard.slice(0, 3);
        const isUserInTop3 = top3Players.some(p => p.userId === currentUserId);

        if (isUserInTop3) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [leaderboard, currentUserId]);


    // 4. LOGIKA MOTIVASI & PERBANDINGAN SKOR
    
    // Cari skor pemain terakhir di Leaderboard (Peringkat 10)
    const minScoreToEnter = leaderboard.length > 0 ? leaderboard[PLACEHOLDER_COUNT - 1].totalPoints : 0;
    
    // Cek apakah skor user saat ini cukup
    const isUserAboveMinScore = currentScore > minScoreToEnter;
    
    // Tentukan skor target (1 poin lebih tinggi dari peringkat 10)
    const targetScore = minScoreToEnter + 1; 


    if (loading) {
        return (
            <div className="min-h-[500px] flex items-center justify-center bg-white rounded-2xl shadow-xl p-8 border-4 border-pink-300">
                <p className="text-xl font-semibold text-pink-500 flex items-center gap-2">
                    <Zap className="w-6 h-6 animate-pulse"/> Memuat Papan Skor...
                </p>
            </div>
        );
    }
    
    if (error) {
         return (
            <div className="min-h-[500px] flex items-center justify-center bg-red-50 rounded-2xl shadow-xl p-8 border-4 border-red-300">
                <p className="text-xl font-semibold text-red-500 flex items-center gap-2">
                    <XCircle className="w-6 h-6"/> {error}
                </p>
            </div>
        );
    }


    return (
        <div ref={containerRef} className="relative p-4 md:p-8 bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl shadow-2xl shadow-pink-300/50 max-w-4xl mx-auto opacity-0 min-h-[500px] overflow-hidden">
            
            {showConfetti && (
                <Confetti 
                    recycle={false} 
                    numberOfPieces={200} 
                    gravity={0.4} 
                    wind={0.02}
                    colors={['#EC4899', '#F472B6', '#FBBF24', '#F87171']}
                />
            )}

            {/* HEADER */}
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-5xl font-black text-pink-600 drop-shadow-md tracking-tight mb-2">
                    THE PINK PROWESS 🏆
                </h2>
                <p className="text-xl text-gray-600 font-medium">
                    Papan Skor Pahlawan Kesehatan!
                </p>
            </div>

            {/* MOTIVATIONAL BOX (Always Visible) */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border-b-4 border-pink-400 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className='flex items-center gap-3'>
                    <Zap className="w-8 h-8 text-pink-500 fill-pink-100" />
                    <span className="text-lg md:text-xl font-extrabold text-gray-800">
                         Skor Anda Saat Ini: <span className='text-pink-600'>{currentScore}</span> POINTS
                    </span>
                </div>
                
                {isUserAboveMinScore ? (
                    <span className="text-sm font-bold px-3 py-1 rounded-full bg-green-100 text-green-700 whitespace-nowrap flex items-center gap-1">
                        <Trophy className='w-4 h-4'/> SELAMAT! Anda Masuk Leaderboard!
                    </span>
                ) : (
                    <span className="text-sm font-bold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 whitespace-nowrap">
                        <span className='font-extrabold'>Tinggal {targetScore - currentScore} Poin Lagi</span> untuk Masuk Top 10!
                    </span>
                )}
            </div>

            {/* LEADERBOARD LIST */}
            <div className="space-y-3 md:space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-pink-50/50">
                {leaderboard.map((player, index) => (
                    <LeaderboardRow 
                        key={player.userId}
                        player={player}
                        rank={index + 1}
                        isTop3={index < 3}
                        isCurrentUser={player.userId === currentUserId && !player.isPlaceholder} // Hindari highlight placeholder
                    />
                ))}
            </div>

            {/* FOOTER MOTIVATION */}
            <div className='text-center mt-10 pt-6 border-t border-pink-200'>
                 <p className='text-2xl md:text-3xl font-black text-pink-700 tracking-wide'>
                    Level up! 🚀 Anda bisa menjadi Juara Bulan Ini!
                 </p>
            </div>
        </div>
    );
}

// Untuk menampilkan komponen ini, Anda bisa menggunakannya di halaman Next.js Anda:
// import PinkProwessLeaderboard from '../components/PinkProwessLeaderboard';
// <PinkProwessLeaderboard />