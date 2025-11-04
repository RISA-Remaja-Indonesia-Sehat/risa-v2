"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import Particles from "../../../components/Particles";
import { useGameStore } from "../../store/useGameStore";
import RotateDevicePrompt from "../../components/games/RotateDevicePrompt";
import {
  Gift,
  Sparkles,
  Timer,
  Target,
  Repeat,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import BackButton from "../../components/games/BackButton";
import ClickSpark from "../../../components/ClickSpark";

// Hapus hardcoded termsAndDefs. Data akan diambil dari API.

const API_ENDPOINT = "https://server-risa.vercel.app/api/memo-cards";
const MAX_PAIRS_TO_FETCH = 4; // Kebutuhan: Ambil 4 soal

// Function untuk mengacak array
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
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function MemoryGamePage() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();

  // Ambil actions dari store
  const { setResults, resetGame } = useGameStore();

  // State Data & Game
  const [initialTerms, setInitialTerms] = useState([]); // 4 Pasangan soal yang terpilih dari API
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, localSetMoves] = useState(0); // total_moves
  const [points, localSetPoints] = useState(0);
  const [time, localSetTime] = useState(60); // waktu yang tersisa
  const [maxTime, setMaxTime] = useState(60); // Durasi maksimal game (dari API)
  const [running, setRunning] = useState(false); // Default: false, akan diset true setelah data dimuat
  const [isLoading, setIsLoading] = useState(true); // State loading
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  const timerRef = useRef(null);
  const cardRefs = useRef({});
  const matchAudioRef = useRef(null);
  const flipAudioRef = useRef(null);

  // Jumlah pasangan di game, dihitung dari data yang telah diambil.
  const totalPairs = initialTerms.length;

  // --- AUDIO SETUP ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    // ... (Init Audio logic remains the same)
    audioRef.current = new Audio("/audio/memo-backsound.mp3");
    matchAudioRef.current = new Audio("/audio/match.mp3");
    flipAudioRef.current = new Audio("/audio/flip.mp3");

    audioRef.current.volume = 0.1;
    matchAudioRef.current.volume = 0.5;
    flipAudioRef.current.volume = 0.3;

    audioRef.current.loop = true;
    audioRef.current.play().catch((e) => {
      // Autoplay diblokir
    });
    setIsPlaying(true);

    return () => {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = null;
      matchAudioRef.current = null;
      flipAudioRef.current = null;
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
  // --- END AUDIO SETUP ---

  // Fungsi exit fullscreen (tetap sama)
  const exitFullscreen = useCallback(() => {
    // ... (exitFullscreen logic remains the same)
    if (document.exitFullscreen) {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false);
        })
        .catch((err) => {
          console.warn("Exit fullscreen gagal:", err);
        });
    }
  }, []);

  // --- FUNGSI UTAMA: HANDLE GAME OVER (Untuk Score Endpoint) ---
  const handleGameOver = useCallback(() => {
    if (isGameOver) return; // Cegah multiple calls
    setIsGameOver(true);

    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false);

    if (isFullscreen) {
      exitFullscreen();
    }

    const durationPlayedSeconds = maxTime - time; // Durasi dimainkan (total - sisa)
    const correctPairs = matched.length; // Jumlah jawaban benar (pasangan match)
    const wrongMoves = moves - correctPairs; // Jumlah gerakan yang tidak match

    // Kumpulkan Data Hasil (Final Data Structure for localStorage)
    const finalResult = {
      // Data untuk Result Page
      gameType: "memory",
      points: points,
      time: formatDuration(
        durationPlayedSeconds > 0 ? durationPlayedSeconds : 0
      ),
      matchedCount: correctPairs,
      totalPairs: totalPairs,
      answers: matched.map((pairId) => {
        const pair = initialTerms.find((item) => item.id === pairId);
        return {
          id: pairId,
          term: pair.term,
          definition: pair.definition,
          isCorrect: true,
        };
      }),

      gameType: "MEMO_CARD", // Untuk konsistensi penamaan di backend
      score: points, // Mapped to score
      duration_seconds: durationPlayedSeconds > 0 ? durationPlayedSeconds : 0,
      total_moves: moves,
      correct_answer: correctPairs, // Mapped to correct_answer
      wrong_answer: wrongMoves > 0 ? wrongMoves : 0, // Mapped to wrong_answer
    };

    localStorage.setItem("gameResult", JSON.stringify(finalResult));
    setResults(finalResult);

    gsap.to("main > div", { opacity: 0, duration: 0.8 });

    setTimeout(() => {
      router.push("/mini-game/result");
    }, 900);
  }, [
    matched,
    moves,
    points,
    router,
    setResults,
    isFullscreen,
    exitFullscreen,
    maxTime,
    time,
    totalPairs, // Ditambahkan sebagai dependency
    initialTerms,
    isGameOver, // Ditambahkan sebagai dependency untuk mendapatkan term/definition
  ]);

  // --- DATA FETCHING & GAME INITIALIZATION ---
  useEffect(() => {
    const nav = document.querySelector("nav");
    const footer = document.querySelector("footer");

    const previousNavDisplay = nav?.style.display;
    const previousFooterDisplay = footer?.style.display;

    if (nav) nav.style.display = "none";
    if (footer) footer.style.display = "none";

    const fetchData = async () => {
      setIsLoading(true);
      setRunning(false);
      resetGame();

      try {
        const response = await fetch(API_ENDPOINT);
        const result = await response.json();

        if (result.success && result.data.length > 0) {
          // 1. Ambil 4 soal secara acak (Randomization dari sisi client, sesuai kebutuhan)
          const shuffledData = shuffleArray(result.data);
          const selectedTerms = shuffledData.slice(0, MAX_PAIRS_TO_FETCH); // Ambil 4 item pertama setelah diacak

          setInitialTerms(selectedTerms);

          // 2. Tentukan Durasi Game
          // Asumsi: Durasi diambil dari data pertama atau default 30
          const durationFromApi = selectedTerms[0]?.duration || 30;
          setMaxTime(durationFromApi);
          localSetTime(durationFromApi);

          // 3. Generate Kartu (8 kartu)
          const generatedCards = [];
          selectedTerms.forEach((item) => {
            const pairId = item.id; // ID unik dari API
            generatedCards.push({
              id: `${pairId}-term`,
              value: item.term,
              pair: pairId,
              type: "term",
            });
            generatedCards.push({
              id: `${pairId}-def`,
              value: item.definition,
              pair: pairId,
              type: "definition",
            });
          });

          // Acak kartu
          setCards(shuffleArray(generatedCards));
          setRunning(true); // Mulai game/timer
        } else {
          console.error("Gagal memuat data atau data kosong:", result);
          // TODO: Tampilkan pesan error ke user
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // TODO: Tampilkan pesan error koneksi
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      if (nav) nav.style.display = previousNavDisplay ?? "";
      if (footer) footer.style.display = previousFooterDisplay ?? "";
      // Cleanup timer juga ada di useEffect lain
    };
  }, [resetGame]); // [] agar hanya dijalankan sekali saat mount

  // --- TIMER JALAN ---
  useEffect(() => {
    if (running && maxTime > 0) {
      timerRef.current = setInterval(() => {
        localSetTime((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setRunning(false);
            handleGameOver(); // Waktu habis, game over
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [running, maxTime, handleGameOver]);

  // --- CHECK GAME END (Semua match) ---
  useEffect(() => {
    // totalPairs akan > 0 jika initialTerms sudah terisi
    if (!isLoading && totalPairs > 0 && matched.length === totalPairs) {
      handleGameOver();
    }
  }, [matched, totalPairs, handleGameOver, isLoading, isGameOver]);

  // --- CARD FLIP & CHECK LOGIC (Tidak ada perubahan signifikan selain penggunaan state baru) ---
  const flipCard = (card) => {
    if (
      !running ||
      flipped.find((c) => c.id === card.id) ||
      matched.includes(card.pair) ||
      flipped.length === 2
    )
      return;

    flipAudioRef.current?.play().catch((e) => console.log(e));

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
      localSetMoves((m) => m + 1); // Tambah total_moves
      const [a, b] = flipped;

      if (a.pair === b.pair && a.type !== b.type) {
        // MATCH
        matchAudioRef.current?.play().catch((e) => console.log(e));
        localSetPoints((p) => p + 25); // Poin bertambah per match
        setMatched((m) => {
          return [...m, a.pair];
        });
        // Animasi match (tetap sama)
        [a, b].forEach((card) => {
          const el = cardRefs.current[card.id];
          if (el) {
            gsap.to(el.parentNode, {
              opacity: 0,
              scale: 0.8,
              duration: 0.5,
              delay: 0.5,
            });
          }
        });
        setTimeout(() => setFlipped([]), 800);
      } else {
        // NOT MATCH
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
  }, [flipped]);

  // FUNGSI RESET GAME
  const resetLocalGame = () => {
    // Hapus animasi GSAP yang mungkin tertinggal
    Object.values(cardRefs.current).forEach((c) => {
      if (c) {
        gsap.to(c, { rotateY: 0, duration: 0.35 });
        gsap.to(c.parentNode, {
          opacity: 1,
          scale: 1,
          duration: 0.1,
        });
      }
    });

    // Reset state lokal
    setCards(shuffleArray(cards)); // Cukup acak ulang kartu yang sudah ada
    setMatched([]);
    setFlipped([]);
    localSetMoves(0);
    localSetPoints(0);
    localSetTime(maxTime); // Set waktu kembali ke maxTime
    resetGame();
    setRunning(true);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-xl flex flex-col items-center gap-4">
          <RotateCcw className="w-8 h-8 animate-spin text-pink-500" />
          Memuat kartu dan istilah kesehatan...
        </div>
      </main>
    );
  }

  // --- RETURN JSX (Perubahan minor di tombol reset dan stat timer) ---
  return (
    <main>
      <RotateDevicePrompt />

      <div className="relative min-h-screen">
        {/* Background & Particles */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: "url('/image/bg-memogame.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Particles
            particleColors={["#C9A9A6", "#AA336A", "#FF6F91", "#FF9671"]}
            particleCount={300}
            particleSpread={10}
            speed={0.2}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>
        <ClickSpark
          sparkColor="#fff"
          sparkSize={60}
          sparkRadius={95}
          sparkCount={8}
          duration={600}
        >
          {/* Content */}
          <div className="p-6 max-w-6xl mx-auto relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BackButton />
                <h1 className="text-2xl font-extrabold text-pink-600 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-pink-500" />
                  Memory Game
                </h1>
              </div>
              <button
                onClick={toggleAudio}
                aria-label={isPlaying ? "Mute" : "Unmute"}
              >
                <div className="p-2 rounded-full bg-white/60 hover:bg-white shadow-md transition">
                  {isPlaying ? (
                    <Volume2 className="h-5 w-5 text-pink-600" />
                  ) : (
                    <VolumeX className="h-5 w-5 text-pink-600" />
                  )}
                </div>
              </button>
            </div>

            {/* Stats - DIPERBAIKI: Timer dipindah ke top-center, diperbesar, dan ditambah progress bar */}
            <div className="flex flex-col items-center gap-4 mb-8">
              {/* Timer di top-center, lebih besar dan menonjol */}
              <div className="relative w-full bg-pink-100/90 backdrop-blur px-6 py-3 rounded-full shadow-xl border-2 border-pink-300 animate-pulse-slow">
                <div className="flex justify-center items-center gap-2 text-lg font-bold text-pink-700">
                  <Timer
                    className={`w-6 h-6 ${
                      time <= 10
                        ? "text-red-500 animate-bounce"
                        : "text-pink-500"
                    }`}
                  />
                  <span className="tabular-nums text-xl">{time}s</span>
                </div>
                {/* Progress Bar untuk Timer - Visual cue waktu tersisa */}
                <div className="w-full bg-pink-200 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(time / maxTime) * 100}%` }}
                  ></div>
                </div>
                {/* Notifikasi jika waktu hampir habis */}
                {time <= 10 && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                    Waktu hampir habis! 🚨
                  </div>
                )}
              </div>

              {/* Poin dan Gerakan tetap di bawah, lebih kecil untuk balance */}
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-base font-bold text-gray-700 shadow-md border border-gray-100">
                  <Target className="w-5 h-5 text-purple-500" />
                  <span className="tabular-nums">{points} poin</span>
                </div>
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-base font-bold text-gray-700 shadow-md border border-gray-100">
                  <Repeat className="w-5 h-5 text-blue-500" />
                  <span className="tabular-nums">{moves} gerakan</span>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div
              className={`grid gap-4 md:gap-6 p-2 ${
                totalPairs === 4
                  ? "grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4"
                  : "grid-cols-4" // Sesuaikan grid jika jumlah kartu berubah
              }`}
              style={{ perspective: 1200 }}
            >
              {cards.map((card) => {
                const isFlipped = flipped.find((c) => c.id === card.id);
                const isMatched = matched.includes(card.pair);
                return (
                  <div
                    key={card.id}
                    className={`w-full aspect-square md:aspect-auto md:w-36 md:h-44 cursor-pointer transition-opacity ${
                      isMatched ? "pointer-events-none" : "hover:scale-105"
                    }`}
                    onClick={() => flipCard(card)}
                  >
                    <div
                      ref={(el) => (cardRefs.current[card.id] = el)}
                      className="relative w-full h-full rounded-2xl shadow-xl transition-all"
                      style={{
                        transformStyle: "preserve-3d",
                        transform:
                          isFlipped || isMatched
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                      }}
                    >
                      {/* Back */}
                      <div
                        className="absolute inset-0 flex items-center justify-center rounded-2xl backface-hidden border-4 border-pink-200/50 shadow-inner"
                        style={{
                          background:
                            "linear-gradient(135deg,#ff7aa6,#ff5680 60%)",
                        }}
                      >
                        <Gift className="w-10 h-10 text-white drop-shadow-lg animate-pulse-slow-reverse" />
                        <span className="absolute bottom-2 right-2 text-xs font-bold text-white/70">
                          {card.type === "term" ? "Istilah" : "Definisi"}
                        </span>
                      </div>
                      {/* Front */}
                      <div
                        className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/95 border-4 border-pink-400 text-pink-800 font-extrabold text-xs md:text-xs p-2 text-center backface-hidden shadow-2xl"
                        style={{ transform: "rotateY(180deg)" }}
                      >
                        <div className="leading-snug">{card.value}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="text-center my-8 flex flex-col md:flex-row justify-center items-center gap-4">
              <button
                onClick={resetLocalGame} // Menggunakan fungsi reset yang diperbarui
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-500 text-white shadow-xl hover:bg-pink-600 transition font-bold"
              >
                <RotateCcw className="w-5 h-5" />
                Mulai Ulang Game
              </button>
              <p className="text-sm bg-white rounded-md p-2 text-pink-600/80 flex items-center gap-2 justify-center mt-2 md:mt-0">
                <Sparkles className="w-4 h-4 bg-orange-200 rounded-md text-pink-600/80" />
                Ayo, ingat dan pasangkan istilah-istilah penting ini!
              </p>
            </div>
          </div>
        </ClickSpark>
      </div>
    </main>
  );
}
