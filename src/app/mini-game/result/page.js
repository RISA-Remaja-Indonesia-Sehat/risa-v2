'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import html2canvas from 'html2canvas';
import Confetti from 'react-confetti';
import Image from 'next/image';
import {
  ChevronLeft,
  Target,
  Repeat,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Trophy,
  ChevronRight,
  Zap,
} from 'lucide-react';

// Konstanta
const DURATION_TO_REDIRECT = 10000;
const API_SCORE_ENDPOINT = '/api/game/post-score'; // Ganti dengan endpoint API Anda yang sebenarnya!

// --- Komponen Detail Card (Di-upgrade visualnya) ---

// Card untuk detail jawaban Memory Game (Pasangan)
const MemoryDetailCard = ({ pair, index }) => (
  <div
    className="p-4 md:p-5 rounded-xl shadow-inner border border-pink-200 bg-pink-50/80 transition-all hover:bg-pink-100"
  >
    <div className="flex items-start justify-between mb-2">
      <h3 className="text-base font-bold text-pink-700">
        Pasangan Tepat {index + 1}
      </h3>
      <span className="flex-shrink-0 flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded-full bg-pink-500 text-white shadow-sm">
        <CheckCircle className="w-3 h-3" /> Matched
      </span>
    </div>
    <p className="text-gray-700 font-medium mb-1 text-sm">
      <span className="font-extrabold">Istilah:</span> {pair.term}
    </p>
    <p className="text-xs text-gray-500">
      <span className="font-extrabold">Definisi:</span> {pair.definition}
    </p>
  </div>
);

// Card untuk detail jawaban Quiz/mitosfakta (Pertanyaan)
const QuizDetailCard = ({ answer, index }) => (
  <div
    className={`p-4 md:p-5 rounded-xl shadow-inner transition-all 
            ${answer.isCorrect
        ? 'bg-green-50/80 border border-green-200 hover:bg-green-100'
        : 'bg-red-50/80 border border-red-200 hover:bg-red-100'
      }`}
  >
    <div className="flex items-start justify-between mb-2">
      <h3 className="text-base font-bold text-gray-800">
        Pertanyaan {index + 1}
      </h3>
      <span className={`flex-shrink-0 flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded-full shadow-sm
                ${answer.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
      >
        {answer.isCorrect ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        {answer.isCorrect ? 'Benar' : 'Salah'}
      </span>
    </div>
    <p className="text-gray-700 font-medium mb-3 text-sm">
      {answer.statement || "Teks Pertanyaan Tidak Ditemukan"}
    </p>
    {/* Detail jawaban diatur lebih rapih */}
    <div className='text-xs'>
      <p className={`font-semibold ${answer.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
        Jawabanmu: <span className="capitalize">{answer.userAnswer}</span>
      </p>
      {(!answer.isCorrect && answer.correctAnswer) && (
        <p className="text-gray-500 mt-1">
          Jawaban Benar: <span className="font-semibold capitalize">{answer.correctAnswer}</span>
        </p>
      )}
    </div>
  </div>
);

// --- FUNGSI MOTIVASI (TIDAK BERUBAH) ---
const getMotivationalMessage = (score, isMemoryGame) => {
  const type = isMemoryGame ? 'Poin' : 'Score';
  let grade = 'C';
  let message = `Anda berhasil mencapai ${type} ${score}. Jangan menyerah, coba lagi untuk skor yang lebih tinggi!`;
  let color = 'text-yellow-600';
  let badgeColor = 'bg-yellow-50/80';
  let icon = Zap;

  if (score >= 100) {
    grade = 'S Rank';
    message = "LEVEL MASTER! Anda mendominasi permainan ini. Pengetahuan Anda LUAR BIASA! 🏆";
    color = 'text-purple-600';
    badgeColor = 'bg-purple-100/90';
    icon = Trophy;
  } else if (score >= 90) {
    grade = 'A+';
    message = "FANTASTIS! Sedikit lagi mencapai skor sempurna! Pertahankan fokus dan coba raih S Rank!";
    color = 'text-green-600';
    badgeColor = 'bg-green-100/90';
    icon = Zap;
  } else if (score >= 80) {
    grade = 'B';
    message = "KEREN! Kamu sudah berada di jalur yang benar! Pelajari detailnya, lalu coba lagi!";
    color = 'text-pink-600';
    badgeColor = 'bg-pink-100/90';
    icon = Zap;
  }

  return { grade, message, color, badgeColor, icon };
};

/**
 * FUNGSI BARU UNTUK POST SKOR KE API
 */
const postScoreToAPI = async (data) => {
  // Ambil data yang relevan untuk dikirim
  const scoreData = {
    userId: 'USER_ID_DARI_AUTH_SINI', // GANTI dengan User ID yang sebenarnya dari Auth!
    gameType: data.gameType,
    score: data.gameType === 'memory' ? data.points : data.score,
    correctAnswers: data.gameType === 'memory' ? data.matchedCount : data.correct,
    wrongAnswers: data.gameType === 'memory' ? data.moves : data.wrong, // Perlu penyesuaian untuk Memory Game
    timeTaken: data.time,
    // data.answers (Detail jawaban biasanya TIDAK dikirim ke API skor, tapi bisa ditambahkan jika perlu)
  };

  try {
    const response = await fetch(API_SCORE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer TOKEN_USER', // Tambahkan token jika perlu
      },
      body: JSON.stringify(scoreData),
    });

    if (!response.ok) {
      // Log error dari server
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`Gagal mengirim skor: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Skor berhasil dikirim ke API:', result);
    // Hapus data dari localStorage setelah berhasil dikirim (Opsional, tapi direkomendasikan)
    // localStorage.removeItem('gameResult');

  } catch (error) {
    console.error('Gagal memposting skor ke API:', error.message);
    // Anda bisa menambahkan state untuk menampilkan pesan error ke user di sini
  }
};


export default function ResultPage() {
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();
  const resultRef = useRef(null);
  const completeAudioRef = useRef(null);
  // Tambahkan state untuk tracking apakah skor sudah di-post
  const [scorePosted, setScorePosted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      completeAudioRef.current = new Audio('/audio/complete.mp3');
    }

    const storedResult = localStorage.getItem('gameResult');

    if (storedResult) {
      const data = JSON.parse(storedResult);
      setResultData(data);
      setLoading(false);

      completeAudioRef.current?.play().catch(err => console.warn("Autoplay diblokir:", err));

      // --- LOGIKA UTAMA: POST SKOR KE API SETELAH DATA DITARIK ---
      if (!scorePosted) {
        postScoreToAPI(data);
        setScorePosted(true); // Pastikan hanya dieksekusi sekali
      }
      // -----------------------------------------------------------

      setTimeout(() => {
        // Animasi diperhalus
        gsap.to("#score-container", {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "expo.out",
          boxShadow: '0px 25px 50px -12px rgba(236, 72, 153, 0.4)'
        });
        gsap.fromTo("#stats-grid > div", {
          y: 20,
          opacity: 0
        }, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          delay: 0.5
        });
        gsap.to("#back-btn", { opacity: 1, duration: 0.5, delay: 0.2 });
        gsap.to("#result-list", { opacity: 1, duration: 0.8, delay: 1 });
        gsap.to("#motivational-message", { opacity: 1, y: 0, duration: 0.8, delay: 0.8 });
        gsap.to("#action-buttons", { opacity: 1, y: 0, duration: 0.8, delay: 1.2 });
        gsap.to("#recommendations", { opacity: 1, duration: 1, delay: 1.5 });

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
      setTimeout(() => router.push('/mini-game/'), 500);
    }
  }, [router, scorePosted]); // Tambahkan scorePosted sebagai dependency untuk memastikan logika post berjalan

  // ... (handleDownloadResult tetap sama) ...
  const handleDownloadResult = useCallback(() => {
    if (!resultRef.current) return;

    gsap.to("#download-btn", { opacity: 0.5, pointerEvents: "none", duration: 0.3 });

    html2canvas(resultRef.current, {
      useCORS: true,
      allowTaint: true,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
      scale: 3, // Kualitas gambar lebih tinggi
    }).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `Result_Game_Top_Player_${new Date().toISOString()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      gsap.to("#download-btn", { opacity: 1, pointerEvents: "auto", duration: 0.3 });
    }).catch(error => {
      console.error('Gagal membuat screenshot:', error);
      gsap.to("#download-btn", { opacity: 1, pointerEvents: "auto", duration: 0.3 });
    });
  }, []);

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
          onClick={() => router.push('/mini-game/')}
          className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Kembali ke Daftar Game
        </button>
      </div>
    );
  }

  // LOGIC MULTI-GAME
  const isMemoryGame = resultData.gameType === 'memory';
  const correctLabel = isMemoryGame ? 'Pasangan Tepat' : 'Jawaban Benar';
  const wrongLabel = isMemoryGame ? 'Total Gerakan' : 'Jawaban Salah';
  const correctValue = isMemoryGame ? resultData.matchedCount : resultData.correct;
  const wrongValue = isMemoryGame ? resultData.moves : resultData.wrong;
  const scoreValue = isMemoryGame ? resultData.points : resultData.score;
  const correctIcon = isMemoryGame ? Target : CheckCircle;
  const wrongIcon = isMemoryGame ? Repeat : XCircle;

  // PESAN MOTIVASI DINAMIS
  const { grade, message, color, badgeColor, icon: GradeIcon } = getMotivationalMessage(scoreValue, isMemoryGame);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-100 via-white to-gray-50">

      {showConfetti && <Confetti recycle={false} numberOfPieces={350} gravity={0.38} wind={0.03} />}

      <section className="container mx-auto px-4 pt-6">
        <button
          id="back-btn"
          onClick={() => router.push('/mini-game/')}
          className="flex items-center text-gray-600 hover:text-pink-500 transition-colors duration-200 opacity-0"
          aria-label="Kembali"
        >
          <ChevronLeft className="w-6 h-6 mr-2" />
          Kembali ke Menu Game
        </button>
      </section>

      {/* RESULT SECTION (untuk di-screenshot) */}
      <section className="container mx-auto px-4 py-8 md:py-12" ref={resultRef}>
        <div className="max-w-4xl mx-auto text-center">

          <h1 className="text-2xl md:text-3xl font-black text-pink-700 mb-2 drop-shadow-md">
            🎉 YOU DID IT, KESEHATAN HERO! 🎉
          </h1>
          <p className="text-gray-500 mb-8 text-lg font-medium">
            Ini adalah rapor rahasia performa Anda!
          </p>

        
          <div
            id="score-container"
            className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl shadow-pink-300/50 opacity-0 transform scale-0"
          >

            {/* 1. Grade dan Pesan Motivasi */}


            {/* 2. Score Circle */}
            <div className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex flex-col items-center justify-center text-white shadow-xl shadow-pink-400/50 transition-shadow duration-500">
              <span className="text-base font-medium opacity-80">{isMemoryGame ? 'TOTAL POIN' : 'FINAL SCORE'}</span>
              <span id="score-number" className="text-6xl md:text-7xl font-bold">{scoreValue}</span>
            </div>

            <div id="motivational-message" className={`p-4 md:p-5 rounded-2xl shadow-lg mx-auto max-w-lg mb-8 opacity-0 transform translate-y-10 border-b-4 border-pink-200 ${badgeColor}`}>
              <div className="flex items-center justify-center gap-3">
                <GradeIcon className={`w-8 h-8 ${color}`} />
                <span className={`text-4xl md:text-5xl font-extrabold ${color}`}>{grade}</span>
                <GradeIcon className={`w-8 h-8 ${color}`} />
              </div>
              <p className={`text-lg md:text-xl font-bold mt-3 ${color} leading-snug`}>
                {message}
              </p>
            </div>

            {/* 3. Statistik Ringkas (GRID RESPONSIVE) */}
            <div id="stats-grid" className="grid grid-cols-3 gap-3 md:gap-6 opacity-0">
              {/* Benar/Matched */}
              <div className="text-center p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
                <div className={`w-10 h-10 md:w-14 md:h-14 mx-auto mb-1 rounded-full flex items-center justify-center 
                    ${isMemoryGame ? 'bg-pink-100' : 'bg-green-100'}`}>
                  {React.createElement(correctIcon, { className: `w-5 h-5 md:w-7 md:h-7 ${isMemoryGame ? 'text-pink-600' : 'text-green-600'}` })}
                </div>
                <p className="text-xl md:text-3xl font-extrabold text-gray-800 leading-none" id="correct-count">{correctValue}</p>
                <p className="text-xs md:text-sm text-gray-500 font-medium">{correctLabel}</p>
              </div>
              {/* Salah/Moves */}
              <div className="text-center p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
                <div className={`w-10 h-10 md:w-14 md:h-14 mx-auto mb-1 rounded-full flex items-center justify-center 
                    ${isMemoryGame ? 'bg-purple-100' : 'bg-red-100'}`}>
                  {React.createElement(wrongIcon, { className: `w-5 h-5 md:w-7 md:h-7 ${isMemoryGame ? 'text-purple-600' : 'text-red-600'}` })}
                </div>
                <p className="text-xl md:text-3xl font-extrabold text-gray-800 leading-none" id="wrong-count">{wrongValue}</p>
                <p className="text-xs md:text-sm text-gray-500 font-medium">{wrongLabel}</p>
              </div>
              {/* Durasi */}
              <div className="text-center p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
                <div className="w-10 h-10 md:w-14 md:h-14 mx-auto mb-1 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 md:w-7 md:h-7 text-blue-600" />
                </div>
                <p className="text-xl md:text-3xl font-extrabold text-gray-800 leading-none" id="duration-time">{resultData.time}s</p>
                <p className="text-xs md:text-sm text-gray-500 font-medium">Waktu Tempuh</p>
              </div>
            </div>
          </div>
          {/* AKHIR MAIN RESULT CARD */}

          {/* Aksi Buttons */}
          <div id="action-buttons" className="mt-8 flex flex-col sm:flex-row justify-center gap-3 md:gap-5 opacity-0 transform translate-y-10">
            <button
              onClick={handleDownloadResult}
              id="download-btn"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-pink-600 text-white font-black text-base md:text-lg shadow-xl shadow-pink-400/60 hover:bg-pink-700 transition transform hover:scale-[1.03] min-w-[200px]"
            >
              <Download className="w-5 h-5 md:w-6 md:h-6" /> BAGIKAN PRESTASIMU (PNG)
            </button>
            <button
              onClick={() => router.push('/mini-game/')}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-pink-500 text-pink-500 bg-white/80 font-semibold text-base md:text-lg shadow-md hover:bg-pink-50 transition transform hover:scale-[1.03] min-w-[200px]"
            >
              <Repeat className="w-5 h-5 md:w-6 md:h-6" /> ULANGI CHALLENGE!
            </button>
          </div>

          {/* Detail Jawaban (Bedah Hasil) */}
          <div className="text-left mt-12 md:mt-16 opacity-0" id="result-list">
            <h2 className="text-2xl md:text-3xl font-black text-pink-600 mb-6 border-b-4 border-pink-300 inline-block pb-1">
              🔬 Bedah Hasil: Detail Jawaban {isMemoryGame ? 'Tepat' : 'Benar/Salah'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {resultData.answers.map((answer, index) => (
                isMemoryGame ? (
                  <MemoryDetailCard key={index} pair={answer} index={index} />
                ) : (
                  <QuizDetailCard key={index} answer={answer} index={index} />
                )
              ))}
            </div>
          </div>

          {/* REKOMENDASI ARTIKEL */}
          <div id="recommendations" className="mt-20 pt-10 border-t-4 border-pink-300 opacity-0">
            <h3 className="text-3xl md:text-4xl font-extrabold text-center text-pink-700 mb-2 drop-shadow-sm">
              💡 NEXT LEVEL LEARNING
            </h3>
            <p className="text-center text-gray-500 mb-10 text-lg md:text-xl font-medium">
              Sempurnakan skor Anda dengan membaca tuntas rekomendasi artikel kesehatan berikut.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Artikel 1: HIV */}
              <a
                href="#" // Ganti dengan URL artikel sesungguhnya
                className="group block transition duration-300 transform hover:translate-y-[-8px] shadow-xl hover:shadow-2xl hover:shadow-pink-300/70 rounded-xl overflow-hidden bg-white border border-gray-100"
              >
                <div className="p-4 flex flex-col h-full">
                  <div className="h-40 w-full relative mb-3">
                    <Image
                      src={"/image/article-image-1.png"}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: 'contain' }}
                      alt="Ilustrasi Pencegahan HIV"
                      className="transition-transform duration-500 group-hover:scale-[1.08]"
                    />
                  </div>
                  <h4 className="font-bold text-lg text-gray-800 text-center leading-snug p-2 group-hover:text-pink-600 transition">
                    HIV? Gak Usah Panik, Yuk Kenalan Dulu!
                  </h4>
                  <div className="mt-2 text-center">
                    <span className="text-base text-pink-500 font-extrabold flex items-center justify-center gap-1">
                      Baca Tuntas <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </a>

              {/* Artikel 2: Seks */}
              <a
                href="#" // Ganti dengan URL artikel sesungguhnya
                className="group block transition duration-300 transform hover:translate-y-[-8px] shadow-xl hover:shadow-2xl hover:shadow-pink-300/70 rounded-xl overflow-hidden bg-white border border-gray-100"
              >
                <div className="p-4 flex flex-col h-full">
                  <div className="h-40 w-full relative mb-3">
                    <Image
                      src="/image/article-image-2.png"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: 'contain' }}
                      alt="Ilustrasi Pengertian Seks"
                      className="transition-transform duration-500 group-hover:scale-[1.08]"
                    />
                  </div>
                  <h4 className="font-bold text-lg text-gray-800 text-center leading-snug p-2 group-hover:text-pink-600 transition">
                    Seks Itu Apa Sih? Biar Gak Salah Paham
                  </h4>
                  <div className="mt-2 text-center">
                    <span className="text-base text-pink-500 font-extrabold flex items-center justify-center gap-1">
                      Baca Tuntas <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </a>

              {/* Artikel 3: Menstruasi */}
              <a
                href="#" // Ganti dengan URL artikel sesungguhnya
                className="group block transition duration-300 transform hover:translate-y-[-8px] shadow-xl hover:shadow-2xl hover:shadow-pink-300/70 rounded-xl overflow-hidden bg-white border border-gray-100"
              >
                <div className="p-4 flex flex-col h-full">
                  <div className="h-40 w-full relative mb-3">
                    <Image
                      src={"/image/article-image-3.png"}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: 'contain' }}
                      alt="Ilustrasi Menstruasi Pertama"
                      className="transition-transform duration-500 group-hover:scale-[1.08]"
                    />
                  </div>
                  <h4 className="font-bold text-lg text-gray-800 text-center leading-snug p-2 group-hover:text-pink-600 transition">
                    Menstruasi Pertama: Kenapa dan Gak Usah Takut
                  </h4>
                  <div className="mt-2 text-center">
                    <span className="text-base text-pink-500 font-extrabold flex items-center justify-center gap-1">
                      Baca Tuntas <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </a>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}