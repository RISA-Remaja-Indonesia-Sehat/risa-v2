'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
    DndContext, 
    useSensor, 
    useSensors, 
    MouseSensor, 
    TouchSensor, 
} from '@dnd-kit/core';
import confetti from 'canvas-confetti';
import { ArrowBigLeft } from 'lucide-react';
// Asumsi path komponen sudah benar
import DraggableStatement from '../../components/games/DraggableStatement'; 
import DroppableZone from '../../components/games/DroppableZone'; 
import { gsap } from 'gsap';

// Data Pertanyaan 
const statements = [
    {
        text: "Menstruasi adalah proses normal dan sehat pada wanita",
        correct: "fact",
        explanation: "Menstruasi adalah proses alami sebagai bagian dari siklus reproduksi. Tidak berbahaya dan tanda tubuh sehat."
    },
    {
        text: "Wanita yang sedang menstruasi tidak boleh berenang",
        correct: "myth",
        explanation: "Wanita tetap boleh berenang saat menstruasi, asal menggunakan perlindungan yang tepat seperti tampon atau menstrual cup."
    },
    {
        text: "Vaksin HPV dapat mencegah kanker serviks",
        correct: "fact",
        explanation: "Vaksin HPV terbukti efektif mencegah infeksi virus HPV penyebab utama kanker serviks."
    },
    {
        text: "PMS hanya ada di 'pikiran' saja",
        correct: "myth",
        explanation: "PMS nyata, disebabkan oleh perubahan hormon yang bisa memengaruhi fisik dan emosi."
    },
    {
        text: "Olahraga dapat membantu mengurangi nyeri menstruasi",
        correct: "fact",
        explanation: "Aktivitas fisik membantu melancarkan peredaran darah dan merangsang endorfin yang mengurangi rasa sakit."
    }
];

// Nilai konstanta
const PRIMARY_COLOR = '#F89BB1';
const TOTAL_QUESTIONS = statements.length;

if (typeof window !== 'undefined') {
    localStorage.removeItem('quizResult');
}

export default function MythFactGame() {
    // 1. STATE UNTUK GAME LOGIC
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isGameActive, setIsGameActive] = useState(true);
    const answersLog = useRef([]);
    const startTime = useRef(Date.now());
    
    // 2. STATE UNTUK DND-KIT VISUAL FEEDBACK
    const [activeDragId, setActiveDragId] = useState(null); 
    const [isOverDropzoneId, setIsOverDropzoneId] = useState(null); 
    
    // Ref Audio (untuk implementasi audio nyata)
    const bgMusicRef = useRef(null);
    const correctSoundRef = useRef(null);
    const wrongSoundRef = useRef(null);

    const currentStatement = statements[currentIndex];
    const progressWidth = ((currentIndex + 1) / TOTAL_QUESTIONS) * 100;

    // 💡 KONFIGURASI SENSOR (PENTING UNTUK SMOOTHNESS MOBILE/TOUCH)
    const sensors = useSensors(
        useSensor(TouchSensor, {
            activationConstraint: { delay: 250, tolerance: 5 }, // Penundaan 250ms agar tidak konflik dengan scrolling
        }),
        useSensor(MouseSensor, {
            activationConstraint: { distance: 10 },
        })
    );

    const confettiBurst = useCallback(() => {
        confetti({
            particleCount: 200,
            spread: 80,
            origin: { y: 0.6 },
            colors: [PRIMARY_COLOR, '#FFFFFF', '#FFD700']
        });
    }, []);

    // 💡 FUNGSI END GAME (LOGIC SIMPAN DATA DAN REDIRECT)
    const endGame = useCallback(() => {
        setIsGameActive(false);
        const endTime = Date.now();
        let duration = Math.floor((endTime - startTime.current) / 1000);

        const formatDuration = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        };

        const finalData = {
            score: answersLog.current.filter(a => a.isCorrect).length,
            correct: answersLog.current.filter(a => a.isCorrect).length,
            wrong: answersLog.current.filter(a => !a.isCorrect).length,
            duration: formatDuration(duration),
            answers: answersLog.current.map(ans => ({
                statement: statements[ans.number - 1].text,
                userAnswer: ans.userAnswer,
                isCorrect: ans.isCorrect
            }))
        };

        localStorage.setItem('quizResult', JSON.stringify(finalData));
        
     
        console.log("Game Ended. Redirecting to result page...");
         if (typeof window !== 'undefined') window.location.href = '/mini-game/result'; 

    }, []);

    // 💡 FUNGSI HANDLE ANSWER (LOGIC & FEEDBACK)
    const handleAnswer = useCallback((choice) => {
        if (!isGameActive) return;

        const currentQ = statements[currentIndex];
        const correct = currentQ.correct;
        const isCorrect = choice === correct;

        // 1. Log Jawaban
        answersLog.current.push({
            number: currentIndex + 1,
            question: currentQ.text,
            userAnswer: choice,
            correctAnswer: correct,
            isCorrect
        });

        // 2. Update Score & Confetti
        if (isCorrect) {
            setScore(prev => prev + 1);
            confettiBurst();
            correctSoundRef.current?.play(); 
        } else {
             wrongSoundRef.current?.play(); 
        }

        // 3. Feedback Visual (GSAP) - Target Card
        const cardEl = document.querySelector('[data-handler-id="statement-card"]'); 
        
        if (cardEl) {
             // Feedback Warna Kartu
             gsap.to(cardEl, {
                backgroundColor: isCorrect ? "#ecfdf5" : "#fff1f2",
                duration: 0.35,
                repeat: 1,
                yoyo: true,
                onComplete: () => gsap.set(cardEl, { backgroundColor: "#ffffff" })
            });

            // 4. Small Badge Pop
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
                // Animasi Out Card
                if (cardEl) {
                    gsap.to(cardEl, {
                        y: -15,
                        opacity: 0,
                        scale: 0.98,
                        duration: 0.35,
                        ease: "power2.in",
                        onComplete: () => {
                             setCurrentIndex(prev => prev + 1); // Memicu re-render Card baru
                        }
                    });
                } else {
                    setCurrentIndex(prev => prev + 1);
                }
            }
        }, 900);
    }, [currentIndex, isGameActive, confettiBurst, endGame]);

    // DND-KIT HANDLERS
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


  
   useEffect(() => {
        // 1. Setup Audio Objects
        // Asumsi file audio ditaruh di folder /public
        bgMusicRef.current = new Audio('/audio/backsoundGame.mp3'); 
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = 0.5;

        // Audio Effects Setup
        correctSoundRef.current = new Audio('/audio/correctAnswer.mp3');
        wrongSoundRef.current = new Audio('/audio/wrongAnswer.mp3');

        // 2. Autoplay Music Function
        const playMusic = () => {
            if (bgMusicRef.current) {
                // Mencoba play. Jika diblok (umum di browser modern), tambahkan event listener
                bgMusicRef.current.play().catch(() => {
                    // Autoplay blocked, coba lagi saat user berinteraksi
                    const unlockAudio = () => {
                         bgMusicRef.current.play().catch(() => console.error("Could not play music after interaction."));
                         document.body.removeEventListener('click', unlockAudio);
                         document.body.removeEventListener('touchend', unlockAudio);
                    };
                    // Tambahkan listener untuk click atau touchend pertama
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

    const handleBack = () => {
         alert("Kembali ke Halaman Game (Simulasi navigasi)");
    };

    return (
        <DndContext 
            sensors={sensors} // KONFIGURASI PENTING
            onDragStart={handleDragStart} 
            onDragOver={handleDragOver} 
            onDragEnd={handleDragEnd} 
        > 
            <div className="min-h-screen flex items-start justify-center py-12 relative overflow-visible">
                {/* Full background gradient dan dekorasi */}
                <div className="absolute inset-0 bg-gradient-to-b from-pink-300/70 via-pink-100 to-pink-50 -z-20 min-h-screen"></div>
                <div
                    className="absolute top-10 left-10 w-40 h-40 bg-pink-200 rounded-full opacity-40 blur-3xl -z-10 shadow-[0_20px_60px_rgba(248,155,177,0.4)] animate-pulse">
                </div>
                {/* ... (dekorasi lainnya) ... */}

                <main className="w-full max-w-4xl px-4 relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            id="backBtn"
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-400 text-white shadow-md hover:shadow-lg hover:bg-pink-500 transition-all duration-300 transform hover:-translate-x-1"
                            onClick={handleBack} 
                        >
                           <ArrowBigLeft size={24} />
                        </button>

                        <div>
                            <h1 className="text-3xl font-extrabold text-pink-500 drop-shadow-md">
                                Mitos atau Fakta? Yuk, Buktikan!
                            </h1>
                            <p className="text-sm text-gray-600">
                                Banyak remaja percaya mitos tentang kesehatan reproduksi. Coba main game ini, apakah kamu bisa bedakan mana yang fakta dan mana yang cuma mitos?
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar (PROGRESS BAR) */}
                    <div className="mb-6">
                        <div className="flex justify-between mb-2 text-sm">
                            <div id="progressText">Pertanyaan {currentIndex + 1} dari {TOTAL_QUESTIONS}</div>
                            <div id="scoreText">Skor: {score}/{TOTAL_QUESTIONS}</div>
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
                        {isGameActive && ( 
                            <DraggableStatement
                                key={currentIndex} // Kunci untuk reset Dnd-kit state
                                id="statement-card" 
                                statement={currentStatement?.text || 'Memuat pertanyaan...'}
                            />
                        )}
                        
                    </div>

                    {/* Dropzones Container */}
                    <div className="grid md:grid-cols-2 gap-6">
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

                    <div className="flex gap-4 justify-center mt-8">
                        <button className="button-11 px-5 py-2 border rounded hover:bg-red-50" onClick={() => handleAnswer('myth')}>Ini MITOS</button>
                        <button className="button-10 px-6 py-2 border rounded hover:bg-green-50" onClick={() => handleAnswer('fact')}>Ini FAKTA</button>
                    </div>

                </main>
            </div>
        </DndContext>
    );
}