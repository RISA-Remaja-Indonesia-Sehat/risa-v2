"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import Particles from "../../components/ui/Particles";
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
import ClickSpark from "../../components/ui/ClickSpark";
import useFullscreenStore from "../../store/useFullscreenStore";

const API_ENDPOINT = "https://server-risa.vercel.app/api/memo-cards";
const MAX_PAIRS_TO_FETCH = 4;

function shuffleArray(arr) {
  return arr
    .map((v) => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map((x) => x.v);
}

function formatDuration(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function MemoryGamePage() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();

  const { setResults, resetGame } = useGameStore();
  const { enterFullscreen, exitFullscreen } = useFullscreenStore();

  const [initialTerms, setInitialTerms] = useState([]);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, localSetMoves] = useState(0);
  const [points, localSetPoints] = useState(0);
  const [time, localSetTime] = useState(60);
  const [maxTime, setMaxTime] = useState(60);
  const [running, setRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  const timerRef = useRef(null);
  const cardRefs = useRef({});
  const matchAudioRef = useRef(null);
  const flipAudioRef = useRef(null);

  const totalPairs = initialTerms.length;

  useEffect(() => {
    enterFullscreen();
    return () => useFullscreenStore.getState().reset();
  }, [enterFullscreen]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    audioRef.current = new Audio("/audio/memo-backsound.mp3");
    matchAudioRef.current = new Audio("/audio/match.mp3");
    flipAudioRef.current = new Audio("/audio/flip.mp3");

    audioRef.current.volume = 0.1;
    matchAudioRef.current.volume = 0.5;
    flipAudioRef.current.volume = 0.3;

    audioRef.current.loop = true;
    audioRef.current.play().catch((e) => {});
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

  const handleGameOver = useCallback(() => {
    if (isGameOver) return;
    setIsGameOver(true);

    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false);

    const durationPlayedSeconds = maxTime - time;
    const correctPairs = matched.length;
    const wrongMoves = moves - correctPairs;

    const finalResult = {
      gameType: "MEMO_CARD",
      points: points,
      time: formatDuration(durationPlayedSeconds > 0 ? durationPlayedSeconds : 0),
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
      score: points,
      duration_seconds: durationPlayedSeconds > 0 ? durationPlayedSeconds : 0,
      total_moves: moves,
      correct_answer: correctPairs,
      wrong_answer: wrongMoves > 0 ? wrongMoves : 0,
    };

    localStorage.setItem("gameResult", JSON.stringify(finalResult));
    setResults(finalResult);

    gsap.to("main > div", { opacity: 0, duration: 0.8 });

    setTimeout(async () => {
      await exitFullscreen();
      router.push("/mini-game/result");
    }, 900);
  }, [
    matched,
    moves,
    points,
    router,
    setResults,
    maxTime,
    time,
    totalPairs,
    initialTerms,
    isGameOver,
    exitFullscreen,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setRunning(false);
      resetGame();

      try {
        const response = await fetch(API_ENDPOINT);
        const result = await response.json();

        if (result.success && result.data.length > 0) {
          const shuffledData = shuffleArray(result.data);
          const selectedTerms = shuffledData.slice(0, MAX_PAIRS_TO_FETCH);

          setInitialTerms(selectedTerms);

          const durationFromApi = selectedTerms[0]?.duration || 30;
          setMaxTime(durationFromApi);
          localSetTime(durationFromApi);

          const generatedCards = [];
          selectedTerms.forEach((item) => {
            const pairId = item.id;
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

          setCards(shuffleArray(generatedCards));
          setRunning(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [resetGame]);

  useEffect(() => {
    if (running && maxTime > 0) {
      timerRef.current = setInterval(() => {
        localSetTime((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setRunning(false);
            handleGameOver();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [running, maxTime, handleGameOver]);

  useEffect(() => {
    if (!isLoading && totalPairs > 0 && matched.length === totalPairs) {
      handleGameOver();
    }
  }, [matched, totalPairs, handleGameOver, isLoading, isGameOver]);

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

  useEffect(() => {
    if (flipped.length === 2) {
      localSetMoves((m) => m + 1);
      const [a, b] = flipped;

      if (a.pair === b.pair && a.type !== b.type) {
        matchAudioRef.current?.play().catch((e) => console.log(e));
        localSetPoints((p) => p + 25);
        setMatched((m) => [...m, a.pair]);
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

  const resetLocalGame = () => {
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

    setCards(shuffleArray(cards));
    setMatched([]);
    setFlipped([]);
    localSetMoves(0);
    localSetPoints(0);
    localSetTime(maxTime);
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

  return (
    <main>
      <RotateDevicePrompt />

      <div className="relative min-h-screen">
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
          <div className="p-6 max-w-6xl mx-auto relative z-10">
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

            <div className="flex flex-col items-center gap-4 mb-8">
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
                <div className="w-full bg-pink-200 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(time / maxTime) * 100}%` }}
                  ></div>
                </div>
                {time <= 10 && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                    Waktu hampir habis! 🚨
                  </div>
                )}
              </div>

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

            <div
              className={`grid gap-4 md:gap-6 p-2 ${
                totalPairs === 4
                  ? "grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4"
                  : "grid-cols-4"
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

            <div className="text-center my-8 flex flex-col md:flex-row justify-center items-center gap-4">
              <button
                onClick={resetLocalGame}
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
