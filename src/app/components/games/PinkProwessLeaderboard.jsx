// components/PinkProwessLeaderboard.jsx
"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { Zap, XCircle, Loader2 } from 'lucide-react'; 
import LeaderboardRow from './LeaderboardRow'; // Import komponen baris

// --- KONSTANTA & TYPINGS ---

const API_ENDPOINT = 'https://server-risa.vercel.app/api/scores/leaderboard';
const PLACEHOLDER_COUNT = 10;
const REFRESH_INTERVAL_MS = 15000; // 15 detik untuk simulasi real-time polling

// Tidak perlu mendefinisikan LeaderboardEntry di sini jika LeaderboardRow.jsx sudah mendefinisikannya


export default function PinkProwessLeaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    const containerRef = useRef(null);
    const headerRef = useRef(null); 

    // 1. Fetch Data Leaderboard 
    const fetchLeaderboard = useCallback(async () => {
        setIsRefreshing(true);
        
        try {
            const response = await fetch(API_ENDPOINT);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            const newData = result.data || []; 

            const updatedLeaderboard = newData.slice(0, PLACEHOLDER_COUNT).map(player => {
                const existingPlayer = leaderboard.find(p => p.userId === player.userId);
                return {
                    ...player,
                    // Menyimpan skor lama untuk animasi
                    prevPoints: existingPlayer ? existingPlayer.totalPoints : player.totalPoints, 
                };
            });
            
            // Tambahkan placeholder
            while (updatedLeaderboard.length < PLACEHOLDER_COUNT) {
                const rank = updatedLeaderboard.length + 1;
                // Ambil skor valid terakhir sebagai basis untuk skor placeholder
                const lastValidScore = updatedLeaderboard.slice(0, rank - 1).filter(p => !p.isPlaceholder).pop()?.totalPoints || 100;
                
                updatedLeaderboard.push({
                    userId: `PH-${rank}`,
                    userName: `Spot Kosong ${rank}`,
                    totalPoints: Math.max(0, lastValidScore - 10),
                    isPlaceholder: true,
                    prevPoints: undefined,
                });
            }
            
            setLeaderboard(updatedLeaderboard);
            setError(null);
        } catch (e) {
            console.error("Gagal mengambil leaderboard:", e);
            setError("Gagal memuat leaderboard. Coba muat ulang.");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [leaderboard]);

    useEffect(() => {
        fetchLeaderboard();

        // Interval Polling (Simulasi Real-Time)
        const intervalId = setInterval(() => {
            fetchLeaderboard();
        }, REFRESH_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [fetchLeaderboard]); 

    // Animasi Global 
    useEffect(() => {
        if (!loading && containerRef.current) {
             // Animasi Fade In Container Utama
             gsap.fromTo(containerRef.current, 
                { opacity: 0, scale: 0.98 }, 
                { opacity: 1, scale: 1, duration: 1.5, ease: "power4.out" }
            );

            // Animasi Pulse/Glow Header
            gsap.to(headerRef.current, {
                boxShadow: "0 0 15px rgba(236, 72, 153, 0.7)",
                border: "2px solid #EC4899",
                duration: 1,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    }, [loading]);


    if (loading) {
        return (
            <div className="min-h-[500px] flex items-center justify-center bg-white rounded-2xl shadow-xl p-8 border-4 border-pink-300">
                <p className="text-xl font-semibold text-pink-500 flex items-center gap-2 animate-pulse">
                    <Loader2 className="w-6 h-6 animate-spin"/> Memuat Papan Skor...
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
            
            {/* Overlay indikator refresh (tidak mencolok) */}
            {isRefreshing && (
                <div className='absolute inset-0 bg-pink-100/10 z-10 flex items-center justify-center transition-opacity duration-300 pointer-events-none'>
                    <Loader2 className='w-12 h-12 text-pink-500 animate-spin opacity-50'/>
                </div>
            )}
            
            {/* Header Real-Time */}
            <div ref={headerRef} className="text-center mb-8 p-4 rounded-xl bg-white/70 border border-pink-200 shadow-xl relative z-20">
                <h2 className="text-4xl md:text-6xl font-black text-pink-700 drop-shadow-lg tracking-tighter mb-2">
                    THE PINK PROWESS
                </h2>
                <p className="text-2xl text-amber-500 font-extrabold flex items-center justify-center gap-2 animate-pulse-slow">
                    <Zap className="w-5 h-5 fill-amber-400"/>
                    PERINGKAT AKTUAL! JANGAN BERKEDIP!
                </p>
                <p className="text-base text-gray-500 font-medium mt-1">
                    Skor Pahlawan Kesehatan diperbarui secara real-time. Kejar Puncak Sekarang!
                </p>
            </div>

           
            <div className="space-y-3 md:space-y-4 p-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-pink-50/50 relative z-20">
                {leaderboard.map((player, index) => (
                    <LeaderboardRow 
                        key={player.userId}
                        player={player}
                        rank={index + 1}
                        isTop3={index < 3}
                        isPlaceholder={!!player.isPlaceholder}
                    />
                ))}
            </div>

            {/* FOOTER MOTIVATION */}
            <div className='text-center mt-10 pt-6 border-t border-pink-200 relative z-20'>
                 <p className='text-2xl md:text-3xl font-black text-pink-700 tracking-wide'>
                     LEVEL UP! 🚀 Ambil Slot Kosong Sekarang!
                 </p>
            </div>
        </div>
    );
}