'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
    DndContext, 
    useSensor, 
    useSensors, 
    MouseSensor, 
    TouchSensor, 
} from '@dnd-kit/core';
import axios from 'axios'; 
import { Zap, ArrowBigLeft } from 'lucide-react';
import DraggableStatement from '../../components/games/DraggableStatement'; 
import DroppableZone from '../../components/games/DroppableZone'; 
import { gsap } from 'gsap';
import BackButton from '../../components/games/BackButton';
import Link from 'next/link';

// --- KONSTANTA ENDPOINT ---
const DRAG_DROP_ENDPOINT = "https://server-risa.vercel.app/api/drag-n-drop";
const QUESTION_LIMIT = 5; // Batasan soal yang diambil: 5

// Nilai konstanta
const PRIMARY_COLOR = '#F89BB1';

if (typeof window !== 'undefined') {
    // Pastikan gameResult dibersihkan saat memulai game baru
    localStorage.removeItem('gameResult');
}

// Fungsi Utility: Mengacak Array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export default function MitosFaktaGame() {
    // Ganti mock data statements dengan state kosong
    const [statements, setStatements] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Total pertanyaan didapat dari statements.length
    const TOTAL_QUESTIONS = statements.length;

    // 1. STATE UNTUK GAME LOGIC
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isGameActive, setIsGameActive] = useState(false); // Mulai dalam keadaan false (menunggu data)
    const answersLog = useRef([]);
    const startTime = useRef(Date.now());
    
    // 2. STATE UNTUK DND-KIT VISUAL FEEDBACK
    const [activeDragId, setActiveDragId] = useState(null); 
    const [isOverDropzoneId, setIsOverDropzoneId] = useState(null); 
    const [isFullscreen, setIsFullscreen] = useState(true);
    
    // Ref Audio (untuk implementasi audio nyata)
    const bgMusicRef = useRef(null);
    const correctSoundRef = useRef(null);
    const wrongSoundRef = useRef(null);

    // Pastikan tidak error saat statements masih kosong
    const currentStatement = statements[currentIndex]; 
    const progressWidth = TOTAL_QUESTIONS > 0 ? ((currentIndex + 1) / TOTAL_QUESTIONS) * 100 : 0;


    // --- LOGIC: FETCHING DATA, SHUFFLE, dan SET STATE ---
    useEffect(() => {
        const fetchAndPrepareQuestions = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(DRAG_DROP_ENDPOINT);
                
                if (response.data.success && Array.isArray(response.data.data)) {
                    let allQuestions = response.data.data;
                    
                    // 1. Acak Semua Soal
                    const shuffledQuestions = shuffleArray(allQuestions);
                    
                    // 2. Ambil hanya 5 Soal (atau kurang jika total soal < 5)
                    const finalQuestions = shuffledQuestions.slice(0, QUESTION_LIMIT);
                    
                    // 3. Transform data agar 'correct' sesuai format game ('MYTH' -> 'mitos', 'FACT' -> 'fakta')
                    const formattedQuestions = finalQuestions.map(q => ({
                        ...q,
                        correct: q.correct.toLowerCase(), // Transform: MYTH/FACT menjadi mitos/fakta
                        id: q.id // Pertahankan ID asli jika diperlukan
                    }));

                    setStatements(formattedQuestions);
                    setIsGameActive(true); // Aktifkan game setelah data siap
                    startTime.current = Date.now(); // Mulai timer game
                } else {
                    throw new Error("Format data tidak valid dari server.");
                }
            } catch (err) {
                console.error("Fetch Questions Error:", err);
                const errorMessage = err.response 
                                     ? `Gagal memuat soal: Status ${err.response.status}` 
                                     : "Terjadi kesalahan koneksi jaringan.";
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAndPrepareQuestions();
    }, []); 

    // --- LOGIC: AUDIO, FULLSCREEN (TIDAK ADA PERUBAHAN) ---
    useEffect(() => {
        const nav = document.querySelector("nav");
        const footer = document.querySelector("footer");
    
        const previousNavDisplay = nav?.style.display;
        const previousFooterDisplay = footer?.style.display;
    
        if (nav) nav.style.display = "none";
        if (footer) footer.style.display = "none";
    
        return () => {
            if (nav) nav.style.display = previousNavDisplay ?? "";
            if (footer) footer.style.display = previousFooterDisplay ?? "";
        };
    }, []);
    
    const exitFullscreen = useCallback(() => {
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

    // 💡 KONFIGURASI SENSOR (TIDAK ADA PERUBAHAN)
    const sensors = useSensors(
        useSensor(TouchSensor, {
            activationConstraint: { delay: 250, tolerance: 5 }, 
        }),
        useSensor(MouseSensor, {
            activationConstraint: { distance: 10 },
        })
    );

    // 💡 FUNGSI END GAME (TIDAK ADA PERUBAHAN LOGIC DASAR)
    const endGame = useCallback(() => {
        setIsGameActive(false);
        
        const endTime = Date.now();
        let duration = Math.floor((endTime - startTime.current) / 1000);

        const formatDuration = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        };

        // Score dihitung per correct answer * 20
        const correctCount = answersLog.current.filter(a => a.isCorrect).length;
        const finalData = {
            score: correctCount * 20, 
            correct: correctCount,
            wrong: answersLog.current.filter(a => !a.isCorrect).length,
            duration: formatDuration(duration),
            gameType: 'DRAG_DROP',
            answers: answersLog.current.map(ans => ({
                statement: statements.find(s => s.id === ans.questionId)?.text || ans.question,
                userAnswer: ans.userAnswer,
                isCorrect: ans.isCorrect
            }))
        };

        localStorage.setItem('gameResult', JSON.stringify(finalData));

        if (isFullscreen) {
            exitFullscreen();
        }
        
        // Redirect ke result page
        if (typeof window !== 'undefined') window.location.href = '/mini-game/result'; 

    }, [isFullscreen, exitFullscreen, statements]); 

    // 💡 FUNGSI HANDLE ANSWER (SEDANG DISESUAIKAN)
    const handleAnswer = useCallback((choice) => {
        if (!isGameActive || !currentStatement) return;

        const currentQ = currentStatement;
        const correct = currentQ.correct;
        const isCorrect = choice === correct;

        // 1. Log Jawaban (Update log dengan Question ID)
        answersLog.current.push({
            number: currentIndex + 1,
            questionId: currentQ.id, // Gunakan ID dari data API
            question: currentQ.text,
            userAnswer: choice,
            correctAnswer: correct,
            isCorrect
        });

        // 2. Update Score
        if (isCorrect) {
            setScore(prev => prev + 1);
            correctSoundRef.current?.play(); 
        } else {
            wrongSoundRef.current?.play(); 
        }

        // 3. Feedback Visual (GSAP) - Target Card
        const cardEl = document.querySelector('[data-handler-id="statement-card"]'); 
        
        if (cardEl) {
            gsap.to(cardEl, {
                backgroundColor: isCorrect ? "#ecfdf5" : "#fff1f2",
                duration: 0.35,
                repeat: 1,
                yoyo: true,
                onComplete: () => gsap.set(cardEl, { backgroundColor: "#ffffff" })
            });

            // Small Badge Pop
            const badge = document.createElement('div');
            badge.textContent = isCorrect ? '✓ Benar' : '✗ Salah';
            badge.className = `absolute px-4 py-2 rounded-full text-sm select-none
                                 ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
                                 font-bold transform -translate-x-1/2 -translate-y-full whitespace-nowrap`;
            badge.style.left = '50%';
            badge.style.top = '8px';
            cardEl.appendChild(badge);
            
            // Animasi Badge
            gsap.fromTo(badge, { y: -10, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.4)" });
            setTimeout(() => { 
                gsap.to(badge, { opacity: 0, duration: 0.25, onComplete: () => badge.remove() }); 
            }, 900);
        }
        
        // 5. Next or End
        setTimeout(() => {
            if (currentIndex + 1 >= TOTAL_QUESTIONS) {
                endGame(); 
            } else {
                if (cardEl) {
                    gsap.to(cardEl, {
                        y: -15,
                        opacity: 0,
                        scale: 0.98,
                        duration: 0.35,
                        ease: "power2.in",
                        onComplete: () => {
                            setCurrentIndex(prev => prev + 1); 
                        }
                    });
                } else {
                    setCurrentIndex(prev => prev + 1);
                }
            }
        }, 900);
    }, [currentIndex, isGameActive, endGame, currentStatement, TOTAL_QUESTIONS]);


    // DND-KIT HANDLERS (TIDAK ADA PERUBAHAN)
    const handleDragStart = useCallback(({ active }) => {
        setActiveDragId(active.id); 
    }, []);
    
    const handleDragOver = useCallback(({ over }) => {
        setIsOverDropzoneId(over ? over.id : null); 
    }, []);

    const handleDragEnd = useCallback(({ over }) => {
        setActiveDragId(null); 
        setIsOverDropzoneId(null); 

        if (over && (over.id === 'myth' || over.id === 'fact')) {
            const dropType = over.id; 
            handleAnswer(dropType); 
        }
    }, [handleAnswer]);


    // --- LOGIC: AUDIO STARTUP (TIDAK ADA PERUBAHAN) ---
    useEffect(() => {
        bgMusicRef.current = new Audio('/audio/backsoundGame.mp3'); 
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = 0.5;

        correctSoundRef.current = new Audio('/audio/correctAnswer.mp3');
        wrongSoundRef.current = new Audio('/audio/wrongAnswer.mp3');

        const playMusic = () => {
            if (bgMusicRef.current) {
                bgMusicRef.current.play().catch(() => {
                    const unlockAudio = () => {
                        bgMusicRef.current.play().catch(() => {});
                        document.body.removeEventListener('click', unlockAudio);
                        document.body.removeEventListener('touchend', unlockAudio);
                    };
                    document.body.addEventListener('click', unlockAudio, { once: true });
                    document.body.addEventListener('touchend', unlockAudio, { once: true });
                });
            }
        };
        
        playMusic();
        return () => {
            if (bgMusicRef.current) {
                bgMusicRef.current.pause();
                bgMusicRef.current.currentTime = 0;
            }
        };
    }, []); 

    // --- RENDER DENGAN HANDLING LOADING/ERROR ---
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pink-50">
                <p className="text-xl font-semibold text-pink-600 flex items-center">
                    <Zap size={24} className="animate-spin mr-3"/> Memuat Misi Mitos vs Fakta...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pink-50 p-6">
                <div className="text-center bg-red-100 p-8 rounded-xl border-4 border-red-400 shadow-lg">
                    <p className="text-2xl font-bold text-red-700 mb-4">❌ Gagal Memuat Pertanyaan</p>
                    <p className="text-red-600 mb-6">{error}</p>
                    <Link href="/">
                        <button className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors">
                            Kembali ke Home
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    if (TOTAL_QUESTIONS === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pink-50 p-6">
                <div className="text-center bg-yellow-100 p-8 rounded-xl border-4 border-yellow-400 shadow-lg">
                    <p className="text-2xl font-bold text-yellow-700 mb-4">⚠️ Soal Belum Tersedia</p>
                    <p className="text-yellow-600 mb-6">Database soal Mitos vs Fakta kosong. Mohon hubungi administrator.</p>
                    <Link href="/">
                        <button className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors">
                            Kembali ke Home
                        </button>
                    </Link>
                </div>
            </div>
        );
    }
    
    return (
        <DndContext 
            sensors={sensors} 
            onDragStart={handleDragStart} 
            onDragOver={handleDragOver} 
            onDragEnd={handleDragEnd} 
        > 
            <div className="min-h-screen flex items-start justify-center py-12 relative overflow-visible">
                {/* Full background gradient dan dekorasi */}
                <div className="absolute inset-0 bg-pink-50 -z-20 min-h-screen" style={{
                    backgroundImage: "url('/image/bg-dragdrop.jpeg')", 
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}></div>
                <div
                    className="absolute top-10 left-10 w-40 h-40 bg-pink-200 rounded-full opacity-40 blur-3xl -z-10 shadow-[0_20px_60px_rgba(248,155,177,0.4)] animate-pulse">
                </div>
                

                <main className="w-full max-w-4xl px-4 relative z-10 
                    bg-white/40 backdrop-blur-md 
                    p-8 rounded-3xl shadow-xl border border-white/50">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        
                       <BackButton />

                        <div>
                            <h1 className="text-xl lg:text-3xl font-extrabold text-pink-500 drop-shadow-md">
                                Mitos atau Fakta? Yuk, Buktikan!
                            </h1>
                            <p className="text-xs lg:text-sm text-gray-600">
                                Banyak remaja percaya mitos tentang kesehatan reproduksi. Coba main game ini, apakah kamu bisa bedakan mana yang fakta dan mana yang cuma mitos?
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between mb-2 text-sm">
                            <div id="progressText">Pertanyaan {currentIndex + 1} dari {TOTAL_QUESTIONS}</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div 
                                id="progressBar" 
                                className="h-3 progress-inner rounded-full" 
                                style={{ width: `${progressWidth}%`, backgroundColor: PRIMARY_COLOR }} 
                            ></div>
                        </div>
                    </div>

                    {/* Card Container */}
                    <div className="mb-8 perspective min-h-[150px]"> 
                        {isGameActive && currentStatement && ( // Pastikan game aktif dan statement ada
                            <DraggableStatement
                                key={currentIndex} 
                                id="statement-card" 
                                statement={currentStatement.text}
                            />
                        )}
                        
                    </div>
                    {/* Render message jika data sudah habis/game belum mulai */}
                    {!isGameActive && !isLoading && TOTAL_QUESTIONS > 0 && (
                        <div className="text-center py-12 text-gray-500 font-medium">Memuat UI Pertanyaan...</div>
                    )}


                    {/* Dropzones Container */}
                    <div className="grid grid-cols-2 gap-1 sm:gap-3 md:gap-6 lg:gap-8">
                        <DroppableZone 
                            id="myth" 
                            type="myth" 
                            isOverId={isOverDropzoneId} 
                            handleAnswer={handleAnswer} 
                        />
                        <DroppableZone 
                            id="fact" 
                            type="fact" 
                            isOverId={isOverDropzoneId} 
                            handleAnswer={handleAnswer} 
                        />
                    </div>

                </main>
            </div>
        </DndContext>
    );
}