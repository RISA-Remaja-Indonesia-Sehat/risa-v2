"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import Particles from "../../../components/Particles";
import { useGameStore } from "../../store/useGameStore";
import {
  Gift,
  Sparkles,
  Timer,
  Target,
  Repeat,
  RotateCcw,
} from "lucide-react";
import BackButton from "../../components/games/BackButton";

// Data terms
const termsAndDefs = [
  { id: 1, term: "Ovulasi", definition: "Pelepasan sel telur dari ovarium" },
  { id: 2, term: "Menstruasi", definition: "Perdarahan bulanan dari rahim" },
  {
    id: 3,
    term: "Fertilitas",
    definition: "Kemampuan untuk menghasilkan keturunan",
  },
  { id: 4, term: "Kontrasepsi", definition: "Metode untuk mencegah kehamilan" },
  {
    id: 5,
    term: "Spermatogenesis",
    definition: "Proses pembentukan sperma",
  },
];

function shuffleArray(arr) {
  return arr
    .map((v) => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map((x) => x.v);
}

// Function untuk format waktu
function formatDuration(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export default function MemoryGamePage() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();

  // Ambil actions dari store
  const { setResults, setPoints, setMoves, setTime, addMatched, resetGame } =
    useGameStore();
  const totalPairs = termsAndDefs.length;

  // State Lokal
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // Array kartu yang sedang terbuka
  const [matched, setMatched] = useState([]); // Array ID pasangan yang sudah match
  const [moves, localSetMoves] = useState(0);
  const [points, localSetPoints] = useState(0);
  const [time, localSetTime] = useState(30);
  const [running, setRunning] = useState(true);

  const timerRef = useRef(null);
  const cardRefs = useRef({}); // Ref untuk elemen DOM kartu

  // Init Audio
  useEffect(() => {
    audioRef.current = new Audio("/audio/memo-backsound.mp3");
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
      audioRef.current.loop = true;
      audioRef.current.play().catch((e) => {
        // console.log("Autoplay failed:", e);
      });
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // init cards
  useEffect(() => {
    const generated = [];
    termsAndDefs.forEach((item) => {
      generated.push({
        id: `${item.id}-term`,
        value: item.term,
        pair: item.id,
        type: "term",
      });
      generated.push({
        id: `${item.id}-def`,
        value: item.definition,
        pair: item.id,
        type: "definition",
      });
    });
    setCards(shuffleArray(generated));
    // Pastikan resetGame dari store dipanggil
    resetGame();
  }, [resetGame]);

  // FUNGSI UTAMA: HANDLE GAME OVER (Diperbaiki dependensi useCallback)
  const handleGameOver = useCallback((finalTime) => {
    // 1. Stop timer & game
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false);

    // Hitung durasi main (finalTime di-pass dari state 'time' saat game end)
    const durationPlayed = 30 - finalTime;

    // 2. Kumpulkan Data Hasil
    const finalResult = {
      gameType: "memory",
      points: points,
      moves: moves,
      time: formatDuration(durationPlayed > 0 ? durationPlayed : 0),
      matchedCount: matched.length,
      totalPairs: totalPairs,
      answers: matched.map(pairId => {
        const pair = termsAndDefs.find(item => item.id === pairId);
        return {
          id: pairId,
          term: pair.term,
          definition: pair.definition,
          isCorrect: true
        }
      }),
    };

    // 3. Simpan ke Local Storage
    localStorage.setItem('gameResult', JSON.stringify(finalResult));

    // 4. Update Global Store & Redirect
    setResults(finalResult);

    setTimeout(() => {
      router.push("/mini-game/result"); // Redirect ke Result Page
    }, 900);

    // Perhatian: Tambahkan 'moves', 'points', dan 'matched' sebagai dependensi di useCallback
  }, [matched, moves, points, totalPairs, router, setResults]);

  // Timer jalan
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        localSetTime((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setRunning(false);
            handleGameOver(0); // Panggil fungsi saat waktu habis (finalTime 0)
            return 0;
          }
          setTime(t - 1); // Update global state
          return t - 1; // Update local state
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [running, setTime, handleGameOver]); // handleGameOver adalah dependensi

  // sync ke store
  useEffect(() => {
    setMoves(moves);
    setPoints(points);
    // time sudah di-sync di useEffect timer
  }, [moves, points, setMoves, setPoints]);

  // check game end (Semua match)
  useEffect(() => {
    if (matched.length === totalPairs && totalPairs > 0) {
      handleGameOver(time); // Panggil fungsi saat semua match (gunakan 'time' saat ini)
    }
  }, [matched, time, totalPairs, handleGameOver]);

  // flip
  const flipCard = (card) => {
    // Cek: sedang running, kartu belum terbuka, belum match, dan kurang dari 2 kartu terbuka
    if (
      !running || // BUG FIX: Tambahkan cek running
      flipped.find((c) => c.id === card.id) ||
      matched.includes(card.pair) ||
      flipped.length === 2
    )
      return;

    const el = cardRefs.current[card.id];
    if (el) {
      gsap.to(el, {
        rotateY: 180,
        duration: 0.45,
        ease: "power2.out",
        onComplete: () => {
          setFlipped((f) => [...f, card]);
        },
      });
    }
  };

  // check pair
  useEffect(() => {
    if (flipped.length === 2) {
      localSetMoves((m) => m + 1);
      const [a, b] = flipped;
      if (a.pair === b.pair && a.type !== b.type) {
        // match
        localSetPoints((p) => p + 20);
        setMatched((m) => {
          addMatched(a.pair);
          return [...m, a.pair];
        });
        setTimeout(() => setFlipped([]), 300);
      } else {
        // not match
        setTimeout(() => {
          flipped.forEach((c) => {
            const el = cardRefs.current[c.id];
            if (el) {
              gsap.to(el, {
                rotateY: 0,
                duration: 0.45,
                ease: "power2.out",
              });
            }
          });
          setFlipped([]);
        }, 900);
      }
    }
  }, [flipped, addMatched]);


  return (

    <div className="relative min-h-screen">

      <div className="absolute inset-0 -z-10" >
        <Particles
          particleColors={['#C9A9A6', '#AA336A', '#FF6F91', '#FF9671']}
          particleCount={300}
          particleSpread={10}
          speed={0.2}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,182,193,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,182,193,0.2) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <BackButton />
          <button onClick={toggleAudio}>
            <div
              className="p-2 rounded-full bg-white/60 hover:bg-white shadow-sm"
            >
              {isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-pink-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 9v6m4-6v6m5 5h2a2 2 0 002-2v-3a7 7 0 00-7-7h-1.5M14 7V5a3 3 0 00-3-3l-1.35.27a48.4 48.4 0 00-7.6 3.18A3 3 0 002 8v3m19 9l-4-4m0 0l-4-4m4 4H9"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-pink-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 8a3 3 0 013 3v1m4 0a7 7 0 01-7 7h-1.5M14 7V5a3 3 0 00-3-3l-1.35.27a48.4 48.4 0 00-7.6 3.18A3 3 0 002 8v3m19 9l-4-4m0 0l-4-4m4 4H9"
                  />
                </svg>
              )}
            </div>
          </button>
          <h1 className="text-2xl font-extrabold text-pink-600 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-pink-500" />
            Memory Game Kesehatan
          </h1>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between gap-3 mb-8 flex-wrap">
          <div className="flex items-center gap-2 bg-pink-50/80 backdrop-blur px-3 py-2 rounded-full text-sm font-medium shadow">
            <Timer className="w-4 h-4 text-pink-500" />
            {time}s
          </div>
          <div className="flex items-center gap-2 bg-pink-50/80 backdrop-blur px-3 py-2 rounded-full text-sm font-medium shadow">
            <Target className="w-4 h-4 text-pink-500" />
            {points} poin
          </div>
          <div className="flex items-center gap-2 bg-pink-50/80 backdrop-blur px-3 py-2 rounded-full text-sm font-medium shadow">
            <Repeat className="w-4 h-4 text-pink-500" />
            {moves} gerakan
          </div>
        </div>

        {/* Cards */}
        <div
          className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-2"
          style={{ perspective: 1200 }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className="w-28 h-36 sm:w-32 sm:h-40 md:w-36 md:h-44 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => flipCard(card)}
            >
              <div
                ref={(el) => (cardRefs.current[card.id] = el)}
                className="relative w-full h-full rounded-2xl shadow-lg"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateY(0deg)",
                }}
              >
                {/* Back */}
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-2xl backface-hidden border border-pink-200 shadow-inner"
                  style={{
                    background: "linear-gradient(135deg,#ff7aa6,#ff5680 60%)",
                  }}
                >
                  <Gift className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                {/* Front */}
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/95 border-2 border-pink-300 text-pink-700 font-semibold text-sm px-3 text-center backface-hidden"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <div className="leading-snug">{card.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center my-8 flex justify-center items-center gap-4">
          <button
            onClick={() => {
              // Animasi reset
              Object.values(cardRefs.current).forEach((c) =>
                gsap.to(c, { rotateY: 0, duration: 0.35 })
              );

              // Reset state lokal
              setCards(shuffleArray(cards)); // Shuffle ulang kartu yang sama
              setMatched([]);
              setFlipped([]);
              localSetMoves(0);
              localSetPoints(0);
              localSetTime(30);
              // Reset state global
              resetGame();
              setRunning(true);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 backdrop-blur hover:shadow-lg transition font-medium text-gray-700"
          >
            <RotateCcw className="w-4 h-4 text-pink-600" />
            Reset
          </button>
          <p className="text-sm text-pink-400 flex items-center gap-2 justify-center">
            <Sparkles className="w-4 h-4 text-pink-400" />
            Match semua pasangan atau habiskan waktu untuk melihat hasilmu.
          </p>
        </div>
      </div>
    </div>
  );
}