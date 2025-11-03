// components/PinkProwessLeaderboard.jsx
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { Zap, XCircle, Loader2 } from "lucide-react";
import LeaderboardRow from "./LeaderboardRow"; // Import komponen baris

// --- KONSTANTA & TYPINGS ---

const API_ENDPOINT = "https://server-risa.vercel.app/api/scores/leaderboard";
const PLACEHOLDER_COUNT = 10;
const REFRESH_INTERVAL_MS = 15000; // 15 detik untuk simulasi real-time polling

// Tidak perlu mendefinisikan LeaderboardEntry di sini jika LeaderboardRow.jsx sudah mendefinisikannya

export default function PinkProwessLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const containerRef = useRef(null);
  const rowsRef = useRef([]);

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

      const updatedLeaderboard = newData
        .slice(0, PLACEHOLDER_COUNT)
        .map((player) => {
          const existingPlayer = leaderboard.find(
            (p) => p.userId === player.userId
          );
          return {
            ...player,
            // Menyimpan skor lama untuk animasi
            prevPoints: existingPlayer
              ? existingPlayer.totalPoints
              : player.totalPoints,
          };
        });

      // Tambahkan placeholder
      while (updatedLeaderboard.length < PLACEHOLDER_COUNT) {
        const rank = updatedLeaderboard.length + 1;
        // Ambil skor valid terakhir sebagai basis untuk skor placeholder
        const lastValidScore =
          updatedLeaderboard
            .slice(0, rank - 1)
            .filter((p) => !p.isPlaceholder)
            .pop()?.totalPoints || 100;

        updatedLeaderboard.push({
          userId: `PH-${rank}`,
          userName: `Pemain ${rank}`,
          totalPoints: 0,
          isPlaceholder: true,
          prevPoints: 0,
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
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );

      gsap.fromTo(
        rowsRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-8 border-4 border-pink-300">
        <p className="text-xl font-semibold text-pink-500 flex items-center gap-2 animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin" /> Memuat Papan Skor...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-red-50 rounded-2xl shadow-xl p-8 border-4 border-red-300">
        <p className="text-xl font-semibold text-red-500 flex items-center gap-2">
          <XCircle className="w-6 h-6" /> {error}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative p-4 md:p-8 bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl shadow-2xl shadow-pink-300/50 max-w-4xl mx-auto opacity-0 min-h-[500px] overflow-hidden"
    >

      <div className="space-y-3 p-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-pink-50 relative">
        {leaderboard.map((player, index) => (
          <div key={player.userId} ref={(el) => (rowsRef.current[index] = el)}>
            <LeaderboardRow
              player={player}
              rank={index + 1}
              isTop3={index < 3}
              isPlaceholder={!!player.isPlaceholder}
            />
          </div>
        ))}
      </div>

      {/* FOOTER MOTIVATION */}
      <div className="text-center mt-6 pt-4 border-t border-pink-200">
        <p className="text-lg font-bold text-pink-700">
          Ambil posisi kosong sekarang!
        </p>
      </div>
    </div>
  );
}
