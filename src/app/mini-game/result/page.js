'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap'; 
import html2canvas from 'html2canvas'; 
import Confetti from 'react-confetti'; 
import { 
    ChevronLeft, 
    Target, 
    Repeat, 
    Clock, 
    CheckCircle, 
    XCircle, 
    Download, 
    Gift 
} from 'lucide-react';

// Konstanta
const DURATION_TO_REDIRECT = 10000; // 10 detik

// --- Komponen Detail Card (Disesuaikan untuk Memory & Quiz) ---

// Card untuk detail jawaban Memory Game (Pasangan)
const MemoryDetailCard = ({ pair, index }) => (
    <div 
        className="p-4 md:p-6 rounded-xl shadow-lg transition-all transform hover:shadow-xl hover:-translate-y-0.5 bg-pink-50 border border-pink-200"
    >
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-800">
                Pasangan Tepat #{index + 1}
            </h3>
            <span className="flex items-center gap-1 font-semibold text-sm px-3 py-1 rounded-full bg-pink-500 text-white">
                <CheckCircle className="w-4 h-4" /> Matched
            </span>
        </div>
        <p className="text-gray-700 font-medium mb-1">
            <span className="font-bold">Istilah:</span> {pair.term}
        </p>
        <p className="text-sm text-gray-500">
            <span className="font-bold">Definisi:</span> {pair.definition}
        </p>
    </div>
);

// Card untuk detail jawaban Quiz/mitosfakta (Pertanyaan)
const QuizDetailCard = ({ answer, index }) => (
    <div 
        className={`p-4 md:p-6 rounded-xl shadow-lg transition-all transform hover:shadow-xl hover:-translate-y-0.5
            ${answer.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
    >
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-800">
                Pertanyaan #{index + 1}
            </h3>
            <span className={`flex items-center gap-1 font-semibold text-sm px-3 py-1 rounded-full
                ${answer.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
            >
                {answer.isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {answer.isCorrect ? 'Benar' : 'Salah'}
            </span>
        </div>
        <p className="text-gray-700 font-medium mb-3">
            {answer.statement || "Teks Pertanyaan Tidak Ditemukan"}
        </p>
        <p className={`text-sm ${answer.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            Jawabanmu: <span className="font-semibold capitalize">{answer.userAnswer}</span>
        </p>
        {/* Opsional: Tampilkan Correct Answer jika salah */}
        {(!answer.isCorrect && answer.correctAnswer) && (
            <p className="text-sm text-gray-500 mt-1">
                Jawaban Benar: <span className="font-semibold capitalize">{answer.correctAnswer}</span>
            </p>
        )}
    </div>
);


export default function ResultPage() {
    const [resultData, setResultData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);
    const router = useRouter();
    const resultRef = useRef(null); 
    const completeAudioRef = useRef(null);

    // 1. Ambil data dari localStorage saat komponen mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            completeAudioRef.current = new Audio('/audio/complete.mp3');
        }

        // Coba ambil data dari beberapa kunci: 'gameResult' (memory) atau 'quizResult' (drag-drop)
        const rawGame = typeof window !== 'undefined' ? localStorage.getItem('gameResult') : null;
        const rawQuiz = typeof window !== 'undefined' ? localStorage.getItem('quizResult') : null;
        console.log(rawQuiz);

        let parsed = null;
        let source = null; // 'game' atau 'quiz'

        if (rawGame) {
            try {
                parsed = JSON.parse(rawGame);
                source = 'game';
            } catch (err) {
                console.warn('Gagal parse gameResult:', err);
            }
        } else if (rawQuiz) {
            try {
                parsed = JSON.parse(rawQuiz);
                source = 'quiz';
            } catch (err) {
                console.warn('Gagal parse quizResult:', err);
            }
        }

        if (parsed) {
            // Jika data berasal dari drag-drop (quiz), normalisasi struktur ke format yang sama
            let data = parsed;
            if (source === 'quiz') {
                data = {
                    gameType: 'quiz',
                    // skor/points: beberapa game menggunakan 'score' atau 'points'
                    score: parsed.score ?? parsed.points ?? 0,
                    correct: parsed.correct ?? (Array.isArray(parsed.answers) ? parsed.answers.filter(a => a.isCorrect).length : 0),
                    wrong: parsed.wrong ?? (Array.isArray(parsed.answers) ? parsed.answers.filter(a => !a.isCorrect).length : 0),
                    // durasi mungkin disimpan sebagai string 'mm:ss' di quiz
                    time: parsed.duration ?? parsed.time ?? parsed.timePlayed ?? parsed.timeLeft ?? '',
                    // Pastikan answers tersedia dan memiliki shape yang diharapkan oleh tampilan
                    answers: Array.isArray(parsed.answers) ? parsed.answers.map(a => ({
                        statement: a.statement ?? a.term ?? '',
                        userAnswer: a.userAnswer ?? a.choice ?? '',
                        isCorrect: !!a.isCorrect,
                        correctAnswer: a.correctAnswer ?? a.correct ?? null
                    })) : [],
                    // fallback fields untuk kompatibilitas
                    points: parsed.points ?? parsed.score ?? 0,
                    moves: parsed.moves ?? null,
                    matchedCount: parsed.matchedCount ?? null
                };
            }

            setResultData(data);
            setLoading(false);

            completeAudioRef.current?.play().catch(err => console.warn('Autoplay diblokir:', err));

            // Animasi GSAP
            setTimeout(() => {
                gsap.to('#score-circle', {
                    scale: 1,
                    opacity: 1,
                    duration: 1,
                    ease: 'back.out(1.7)'
                });
                gsap.fromTo('#stats > div', {
                    y: 20,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.2,
                    delay: 0.5
                });
                gsap.to('#back-btn', { opacity: 1, duration: 0.5, delay: 0.2 });
                gsap.to('#result-list', { opacity: 1, duration: 0.8, delay: 1 });

                // Tampilkan confetti
                setShowConfetti(true);
            }, 100);

            const timeoutId = setTimeout(() => {
                // Opsional: router.push('/');
            }, DURATION_TO_REDIRECT);

            return () => {
                clearTimeout(timeoutId);
                completeAudioRef.current?.pause();
                completeAudioRef.current = null;
            };
        } else {
            setLoading(false);
            // Redirect jika tidak ada data
            setTimeout(() => router.push('/mini-game'), 500);
        }
    }, [router]);


    // Fungsi Download Result 
    const handleDownloadResult = useCallback(() => {
        if (!resultRef.current) return;

        gsap.to("#download-btn", { opacity: 0.5, pointerEvents: "none", duration: 0.3 });

        html2canvas(resultRef.current, {
            useCORS: true,
            allowTaint: true,
            scrollY: -window.scrollY, 
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.offsetHeight
        }).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `Result_Game_${new Date().toISOString()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            gsap.to("#download-btn", { opacity: 1, pointerEvents: "auto", duration: 0.3 });
        }).catch(error => {
            console.error('Gagal membuat screenshot:', error);
             gsap.to("#download-btn", { opacity: 1, pointerEvents: "auto", duration: 0.3 });
        });
    }, []);

    // Tampilan Loading & No Data
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-xl font-semibold text-pink-500">Memuat Hasil Game...</p>
            </div>
        );
    }
    
    if (!resultData) {
        return (
             <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
                <p className="text-xl font-semibold text-red-500 mb-4">Data Hasil Tidak Ditemukan 😔</p>
                <button
                    onClick={() => router.push('/mini-game')}
                    className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" /> Kembali ke Daftar Game
                </button>
            </div>
        );
    }
    
    // PERBAIKAN BUG: LOGIC MULTI-GAME
    const isMemoryGame = resultData.gameType === 'memory';
    const correctLabel = isMemoryGame ? 'Pasangan Tepat' : 'Jawaban Benar';
    const wrongLabel = isMemoryGame ? 'Total Gerakan' : 'Jawaban Salah';
    const correctValue = isMemoryGame ? resultData.matchedCount : resultData.correct;
    // Perhatikan: resultData.moves hanya ada di Memory Game
    const wrongValue = isMemoryGame ? resultData.moves : resultData.wrong; 
    const scoreValue = isMemoryGame
        ? (Number(resultData.points ?? 0))
        : (Number(resultData.score ?? resultData.points ?? 0) * 20); 
    const correctIcon = isMemoryGame ? Target : CheckCircle;
    const wrongIcon = isMemoryGame ? Repeat : XCircle;
    console.log('Result Data:', scoreValue, correctValue, wrongValue);

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-pink-100 via-white to-gray-50">
            
            {showConfetti && <Confetti recycle={false} numberOfPieces={200} gravity={0.3} />}

            <section className="container mx-auto px-4 pt-6">
                <button 
                    id="back-btn" 
                    onClick={() => router.push('/mini-game/')} 
                    className="flex items-center text-gray-600 hover:text-pink-500 transition-colors duration-200 opacity-0" 
                    aria-label="Kembali"
                >
                    <ChevronLeft className="w-6 h-6 mr-2" />
                    Kembali
                </button>
            </section>

            <section className="container mx-auto px-4 py-8" ref={resultRef}>
                <div className="max-w-4xl mx-auto text-center">
                    
                    {/* Header Score */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-2">Hasil Akhir Game</h1>
                        <p className="text-gray-500 mb-8">{isMemoryGame ? 'Memory Game' : 'Mitos/Fakta'}</p>
                        
                        <div id="score-circle" className="w-64 h-64 mx-auto bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex flex-col items-center justify-center text-white shadow-2xl opacity-0 transform scale-0">
                            <span className="text-lg font-medium opacity-80">{isMemoryGame ? 'Poin' : 'Score'}</span>
                            <span id="score-number" className="text-6xl font-bold">{scoreValue}</span>
                        </div>
                    </div>
                    
                    {/* Statistik Ringkas (Disesuaikan) */}
                    <div className="flex justify-center gap-8 mb-12 opacity-0" id="stats">
                        {/* Benar/Matched */}
                        <div className="text-center">
                            <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center 
                                ${isMemoryGame ? 'bg-pink-100' : 'bg-green-100'}`}>
                                <svg as={correctIcon} className={`w-6 h-6 ${isMemoryGame ? 'text-pink-600' : 'text-green-600'}`} />
                            </div>
                            <p className="text-2xl font-bold text-gray-800" id="correct-count">{correctValue}</p>
                            <p className="text-sm text-gray-500">{correctLabel}</p>
                        </div>
                        {/* Salah/Moves */}
                        <div className="text-center">
                            <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center 
                                ${isMemoryGame ? 'bg-purple-100' : 'bg-red-100'}`}>
                                <svg as={wrongIcon} className={`w-6 h-6 ${isMemoryGame ? 'text-purple-600' : 'text-red-600'}`} />
                            </div>
                            <p className="text-2xl font-bold text-gray-800" id="wrong-count">{wrongValue}</p>
                            <p className="text-sm text-gray-500">{wrongLabel}</p>
                        </div>
                        {/* Durasi */}
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-800" id="duration-time">{resultData.time}</p>
                            <p className="text-sm text-gray-500">Durasi</p>
                        </div>
                    </div>

                    {/* Detail Jawaban (Disesuaikan) */}
                    <div className="text-left mt-12 opacity-0" id="result-list">
                        <h2 className="text-2xl font-bold text-pink-500 mb-6 border-b pb-2">Detail Jawaban</h2>
                        <div className="grid grid-cols-1 gap-6">
                            {resultData.answers.map((answer, index) => (
                                isMemoryGame ? (
                                    <MemoryDetailCard key={index} pair={answer} index={index} />
                                ) : (
                                    <QuizDetailCard key={index} answer={answer} index={index} />
                                )
                            ))}
                        </div>
                    </div>
                    
                    {/* Aksi */}
                    <div className="mt-12 flex justify-center gap-4">
                        <button 
                            onClick={handleDownloadResult} 
                            id="download-btn"
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-pink-500 text-white font-semibold shadow-lg hover:bg-pink-600 transition transform hover:scale-[1.02]"
                        >
                            <Download className="w-5 h-5" /> Download Hasil (PNG)
                        </button>
                        {/* <button 
                            onClick={() => router.push('/mini-game/')} 
                            className="flex items-center gap-2 px-6 py-3 rounded-full border border-pink-500 text-pink-500 bg-white font-semibold shadow-lg hover:bg-pink-50 transition transform hover:scale-[1.02]"
                        >
                            <Repeat className="w-5 h-5" /> Main Lagi
                        </button> */}
                    </div>

                </div>
            </section>
        </div>
    );
}