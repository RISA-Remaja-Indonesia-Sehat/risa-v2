'use client';

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import Particles from "../../../components/Particles";
import { useGameStore } from "../../store/useGameStore";
import RotateDevicePrompt from "../../components/games/RotateDevicePrompt"; // NEW: Import komponen
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
    const matchAudioRef = useRef(null); // NEW: Audio Match
    const flipAudioRef = useRef(null); // NEW: Audio Flip

    // Init Audio & Effects
    useEffect(() => {
        if (typeof window === 'undefined') return;

        audioRef.current = new Audio("/audio/memo-backsound.mp3");
        matchAudioRef.current = new Audio("/audio/match.mp3"); // NEW
        flipAudioRef.current = new Audio("/audio/flip.mp3"); // NEW

        // Atur volume
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
        resetGame();
    }, [resetGame]);

    // FUNGSI UTAMA: HANDLE GAME OVER
    const handleGameOver = useCallback((finalTime) => {
        if (timerRef.current) clearInterval(timerRef.current);
        setRunning(false);

        const durationPlayed = 30 - finalTime;

        // Kumpulkan Data Hasil
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

        // Simpan ke Local Storage (sesuai ResultPage FIX)
        localStorage.setItem('gameResult', JSON.stringify(finalResult));

        // Update Global Store & Redirect
        setResults(finalResult);

        // Tambahkan GSAP fade out agar transisi lebih mulus
        gsap.to("main > div", { opacity: 0, duration: 0.8 });

        setTimeout(() => {
            router.push("/mini-game/result"); // Redirect ke Result Page
        }, 900);

    }, [matched, moves, points, totalPairs, router, setResults]);

    // Timer jalan
    useEffect(() => {
        if (running) {
            timerRef.current = setInterval(() => {
                localSetTime((t) => {
                    if (t <= 1) {
                        clearInterval(timerRef.current);
                        setRunning(false);
                        handleGameOver(0);
                        return 0;
                    }
                    setTime(t - 1);
                    return t - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [running, setTime, handleGameOver]);

    // check game end (Semua match)
    useEffect(() => {
        if (matched.length === totalPairs && totalPairs > 0) {
            handleGameOver(time);
        }
    }, [matched, time, totalPairs, handleGameOver]);

    // flip card
    const flipCard = (card) => {
        if (
            !running ||
            flipped.find((c) => c.id === card.id) ||
            matched.includes(card.pair) ||
            flipped.length === 2
        )
            return;

        flipAudioRef.current?.play().catch(e => console.log(e)); // NEW: Play flip sound

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
                // MATCH
                matchAudioRef.current?.play().catch(e => console.log(e)); // NEW: Play match sound
                localSetPoints((p) => p + 20);
                setMatched((m) => {
                    addMatched(a.pair);
                    return [...m, a.pair];
                });
                // Animasi kartu match menjadi transparan/hilang
                [a, b].forEach(card => {
                    const el = cardRefs.current[card.id];
                    if (el) {
                        gsap.to(el.parentNode, {
                            opacity: 0,
                            scale: 0.8,
                            duration: 0.5,
                            delay: 0.5
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
    }, [flipped, addMatched]);


    return (
        <main>
            {/* NEW: Component Rotate Device Prompt */}
            <RotateDevicePrompt />

            <div className="relative min-h-screen" >

                {/* Background & Particles */}
                <div className="absolute inset-0 -z-10" style={{
                    backgroundImage: "url('/image/bg-memogame.jpeg')", // Ganti dengan URL gambar latar belakang kamu
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }} >
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
                <ClickSpark
                    sparkColor='#fff'
                    sparkSize={60}
                    sparkRadius={95}
                    sparkCount={8}
                    duration={600}
                >

                    {/* Content */}
                    <div className="p-6 max-w-6xl mx-auto relative z-10">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <BackButton />
                            <button onClick={toggleAudio} aria-label={isPlaying ? "Mute" : "Unmute"}>
                                <div
                                    className="p-2 rounded-full bg-white/60 hover:bg-white shadow-md transition" // NEW: shadow-md
                                >
                                    {isPlaying ? (
                                        <Volume2 className="h-5 w-5 text-pink-600" />
                                    ) : (
                                        <VolumeX className="h-5 w-5 text-pink-600" />
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
                            <div className="flex items-center gap-2 bg-pink-50/80 backdrop-blur px-4 py-2 rounded-full text-base font-bold text-pink-700 shadow-xl border border-pink-100 animate-pulse-slow"> {/* UX BOOST */}
                                <Timer className="w-5 h-5 text-pink-500" />
                                <span className="tabular-nums">{time}s</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-base font-bold text-gray-700 shadow-md border border-gray-100">
                                <Target className="w-5 h-5 text-purple-500" />
                                <span className="tabular-nums">{points} poin</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-base font-bold text-gray-700 shadow-md border border-gray-100">
                                <Repeat className="w-5 h-5 text-blue-500" />
                                <span className="tabular-nums">{moves} gerakan</span>
                            </div>
                        </div>

                        {/* Cards */}
                        <div
                            className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 gap-4 md:gap-6 p-2" // UX BOOST: Grid 5 kolom lebih ideal untuk 10 kartu di landscape
                            style={{ perspective: 1200 }}
                        >
                            {cards.map((card) => {
                                const isFlipped = flipped.find(c => c.id === card.id);
                                const isMatched = matched.includes(card.pair);
                                return (
                                    <div
                                        key={card.id}
                                        className={`w-full aspect-square md:aspect-auto md:w-36 md:h-44 cursor-pointer transition-opacity ${isMatched ? 'pointer-events-none' : 'hover:scale-105'}`} // Animasi match di-handle GSAP
                                        onClick={() => flipCard(card)}
                                    >
                                        <div
                                            ref={(el) => (cardRefs.current[card.id] = el)}
                                            className="relative w-full h-full rounded-2xl shadow-xl transition-all" // NEW: shadow-xl
                                            style={{
                                                transformStyle: "preserve-3d",
                                                transform: (isFlipped || isMatched) ? "rotateY(180deg)" : "rotateY(0deg)",
                                            }}
                                        >
                                            {/* Back */}
                                            <div
                                                className="absolute inset-0 flex items-center justify-center rounded-2xl backface-hidden border-4 border-pink-200/50 shadow-inner" // NEW: border tebal
                                                style={{
                                                    background: "linear-gradient(135deg,#ff7aa6,#ff5680 60%)",
                                                }}
                                            >
                                                <Gift className="w-10 h-10 text-white drop-shadow-lg animate-pulse-slow-reverse" /> {/* UX BOOST: Animasi di cover */}
                                                <span className="absolute bottom-2 right-2 text-xs font-bold text-white/70">{card.type === 'term' ? 'Istilah' : 'Definisi'}</span>
                                            </div>
                                            {/* Front */}
                                            <div
                                                className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/95 border-4 border-pink-400 text-pink-800 font-extrabold text-sm md:text-base p-2 text-center backface-hidden shadow-2xl" // NEW: Font & Shadow
                                                style={{ transform: "rotateY(180deg)" }}
                                            >
                                                <div className="leading-snug">{card.value}</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Footer */}
                        <div className="text-center my-8 flex flex-col md:flex-row justify-center items-center gap-4">
                            <button
                                onClick={() => {
                                    Object.values(cardRefs.current).forEach((c) =>
                                        gsap.to(c, { rotateY: 0, duration: 0.35 })
                                    );
                                    // Reset opacity untuk semua parent card (sebelumnya dianimasikan hilang)
                                    Object.values(cardRefs.current).forEach((c) =>
                                        gsap.to(c.parentNode, { opacity: 1, scale: 1, duration: 0.1 })
                                    );

                                    setCards(shuffleArray(cards));
                                    setMatched([]);
                                    setFlipped([]);
                                    localSetMoves(0);
                                    localSetPoints(0);
                                    localSetTime(30);
                                    resetGame();
                                    setRunning(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-500 text-white shadow-xl hover:bg-pink-600 transition font-bold" // UX BOOST: Tombol Reset lebih menonjol
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