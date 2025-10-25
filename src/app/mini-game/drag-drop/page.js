'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
    DndContext, 
    useDraggable, 
    useDroppable,
    useSensor, // Import hook useSensor
    useSensors, // Import hook useSensors
    MouseSensor, // Sensor untuk Mouse
    TouchSensor, // Sensor untuk Touch (Mobile)
} from '@dnd-kit/core';
import { ArrowBigLeft } from 'lucide-react';
// Asumsi path komponen ini sudah benar
import DraggableStatement from '../../components/games/DraggableStatement';
import DroppableZone from '../../components/games/DroppableZone'; 
import { gsap } from 'gsap';

// Data Pertanyaan (DIPERTAHANKAN)
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

const PRIMARY_COLOR = '#F89BB1';
const TOTAL_QUESTIONS = statements.length;

if (typeof window !== 'undefined') {
    localStorage.removeItem('quizResult');
}

export default function MythFactGame() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isGameActive, setIsGameActive] = useState(true);
    const answersLog = useRef([]);
    const startTime = useRef(Date.now());

    const sensors = useSensors(
        // 1. TouchSensor: Wajib untuk mobile. Memungkinkan drag dengan sentuhan.
        useSensor(TouchSensor, {
            // Konfigurasi untuk menunda aktivasi drag agar tidak langsung konflik dengan scrolling
            activationConstraint: {
                delay: 250, // Tahan selama 250ms sebelum drag dimulai
                tolerance: 5,  // Jarak 5px (mengurangi false positive saat tapping/scrolling)
            },
        }),
        // 2. MouseSensor: Untuk desktop
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10, // Jarak 10px sebelum drag mouse dimulai
            },
        }),
    );
    
    // 2. STATE UNTUK DND-KIT VISUAL FEEDBACK
    const [activeDragId, setActiveDragId] = useState(null); // ID Draggable yang aktif
    const [isOverDropzoneId, setIsOverDropzoneId] = useState(null); // ID Droppable yang di-highlight

    // Ref untuk Audio (DIPERTAHANKAN)
    const bgMusicRef = useRef(null);
    const correctSoundRef = useRef(null);
    const wrongSoundRef = useRef(null);

    const currentStatement = statements[currentIndex];
    const progressWidth = ((currentIndex + 1) / TOTAL_QUESTIONS) * 100;

    const confettiBurst = useCallback(() => {
        confetti({
            particleCount: 200,
            spread: 80,
            origin: { y: 0.6 },
            colors: [PRIMARY_COLOR, '#FFFFFF', '#FFD700']
        });
    }, []);

    const endGame = useCallback(() => {
        setIsGameActive(false);
        const endTime = Date.now();
        let duration = Math.floor((endTime - startTime.current) / 1000);

        // ... (Logic format duration dan finalData tetap sama)
        const formatDuration = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        };

        const formattedAnswers = answersLog.current.map((ans) => {
            const statement = statements[ans.number - 1];
            return {
                statement: {
                    text: statement.text,
                    correct: statement.correct,
                    explanation: statement.explanation
                },
                userAnswer: ans.userAnswer,
                isCorrect: ans.isCorrect
            };
        });

        const finalData = {
            score: answersLog.current.filter(a => a.isCorrect).length,
            correct: answersLog.current.filter(a => a.isCorrect).length,
            wrong: answersLog.current.filter(a => !a.isCorrect).length,
            duration: formatDuration(duration),
            answers: formattedAnswers
        };

        localStorage.setItem('quizResult', JSON.stringify(finalData));
        console.log("Game Ended. Final Data:", finalData);

    }, []);

    // 3. FUNGSI UTAMA JAWAB (MODIFIKASI RINGAN)
    const handleAnswer = useCallback((choice) => {
        if (!isGameActive) return;

        const currentQ = statements[currentIndex];
        const correct = currentQ.correct;
        const isCorrect = choice === correct;

        // Log Jawaban
        answersLog.current.push({
            number: currentIndex + 1,
            question: currentQ.text,
            userAnswer: choice,
            correctAnswer: correct,
            isCorrect
        });

        // Update Score & Confetti
        if (isCorrect) {
            setScore(prev => prev + 1);
            confettiBurst();
            // correctSoundRef.current?.play(); // Asumsi audio diaktifkan
        } else {
             // wrongSoundRef.current?.play(); // Asumsi audio diaktifkan
        }

        // --- FEEDBACK VISUAL (GSAP pada elemen DOM yang sedang aktif) ---
        // Karena statementCardRef dihapus, kita target elemen via DOM query atau key prop
        const cardEl = document.querySelector('[data-handler-id="statement-card"]'); 
        
        if (cardEl) {
             // 3. Feedback Warna Kartu
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
                                ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`;
            badge.style.left = '50%';
            badge.style.transform = 'translateX(-50%)';
            badge.style.top = '8px';
            cardEl.appendChild(badge);
            gsap.fromTo(badge, { y: -10, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.4)" });
            setTimeout(() => { gsap.to(badge, { opacity: 0, duration: 0.25, onComplete: () => badge.remove() }); }, 900);
        }
       
        // 5. Next or End
        setTimeout(() => {
            if (currentIndex + 1 >= TOTAL_QUESTIONS) {
                endGame();
            } else {
                // Gunakan GSAP untuk animasi out, lalu ganti state
                if (cardEl) {
                    gsap.to(cardEl, {
                        y: -15,
                        opacity: 0,
                        scale: 0.98,
                        duration: 0.35,
                        ease: "power2.in",
                        onComplete: () => {
                             setCurrentIndex(prev => prev + 1); // Ini memicu card baru muncul
                            // Animasi in di handleAnswer akan memicu GSAP.fromTo pada card baru
                        }
                    });
                } else {
                    // Fallback jika tidak ada animasi out
                    setCurrentIndex(prev => prev + 1);
                }
            }
        }, 900);
    }, [currentIndex, isGameActive, confettiBurst, endGame]);

    // 4. DND-KIT HANDLERS
    const handleDragStart = useCallback(({ active }) => {
        setActiveDragId(active.id); 
    }, []);
    
    // Memberikan highlight real-time
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


    // Lifecycle Hook (tetap sama)
    useEffect(() => {
        // ... (logika audio tetap sama)
        const playMusic = () => { /* ... */ };
        playMusic();
        return () => { /* ... */ };
    }, []);

    const handleBack = () => {
         alert("Kembali ke Halaman Game (Simulasi navigasi)");
    };

    return (
        // DndContext harus menjadi wrapper untuk semua elemen yang berinteraksi
        <DndContext 
            sensors={sensors}
            onDragStart={handleDragStart} 
            onDragOver={handleDragOver} 
            onDragEnd={handleDragEnd} 
        > 
            <div className="min-h-screen flex items-start justify-center py-12 relative overflow-visible">
                {/* Background & Decorations tetap sama... */}

                <main className="w-full max-w-4xl px-4 relative z-10">
                    {/* Header & Progress tetap sama... */}

                    {/* Card Container */}
                    <div className="mb-8 perspective">
                        <DraggableStatement
                            // KEY wajib untuk me-reset DND-kit state saat pertanyaan berganti
                            key={currentIndex} 
                            id="statement-card" 
                            statement={currentStatement?.text || 'Memuat pertanyaan...'}
                        />
                    </div>

                    {/* Dropzones Container */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <DroppableZone 
                            id="myth" 
                            type="myth" 
                            isOverId={isOverDropzoneId} // Props untuk visual highlight
                            handleAnswer={handleAnswer} 
                        />
                        <DroppableZone 
                            id="fact" 
                            type="fact" 
                            isOverId={isOverDropzoneId} 
                            handleAnswer={handleAnswer} 
                        />
                    </div>

                    {/* Action (Button Fallback) */}
                    <div className="flex gap-4 justify-center mt-8">
                        <button className="button-11 px-5 py-2 border rounded hover:bg-red-50" onClick={() => handleAnswer('myth')}>Ini MITOS</button>
                        <button className="button-10 px-6 py-2 border rounded hover:bg-green-50" onClick={() => handleAnswer('fact')}>Ini FAKTA</button>
                    </div>

                </main>
            </div>
        </DndContext>
    );
}