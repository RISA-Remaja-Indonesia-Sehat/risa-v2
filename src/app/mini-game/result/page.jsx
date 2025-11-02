"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import html2canvas from "html2canvas";
import Confetti from "react-confetti";
import Image from "next/image";
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
} from "lucide-react";
import Link from "next/link";
// --- INTEGRASI ZUSTAND / AUTH ---
import useAuthStore from "../../store/useAuthStore";
import useMissions from "../../store/useMissions";
import useStickers from "../../store/useStickers";

import StickerRewardAnimation from "../../components/ui/StickerRewardAnimation";

// Konstanta
const DURATION_TO_REDIRECT = 10000;
// Ganti dengan endpoint API Anda yang sebenarnya!
const API_SCORE_ENDPOINT = "https://server-risa.vercel.app/api/scores";

// --- FUNGSI HELPER ---

// 1. Fungsi untuk mendapatkan Game ID dinamis (SESUAIKAN DENGAN BACKEND)
const getGameId = (gameType) => {
  switch (gameType) {
    case "MEMO_CARD":
      return 2;
    case "DRAG_DROP":
    case "mitosfakta":
      return 1;
    default:
      return 0;
  }
};

// 2. Fungsi Motivasi (Tidak Berubah)
const getMotivationalMessage = (score, isMemoryGame) => {
  const type = isMemoryGame ? "Poin" : "Score";
  let grade = "C";
  let message = `Anda berhasil mencapai ${type} ${score}. Jangan menyerah, coba lagi untuk skor yang lebih tinggi!`;
  let color = "text-yellow-600";
  let badgeColor = "bg-yellow-50/80";
  let icon = Zap;

  if (score >= 100) {
    grade = "S Rank";
    message =
      "LEVEL MASTER! Anda mendominasi permainan ini. Pengetahuan Anda LUAR BIASA! 🏆";
    color = "text-purple-600";
    badgeColor = "bg-purple-100/90";
    icon = Trophy;
  } else if (score >= 90) {
    grade = "A+";
    message =
      "FANTASTIS! Sedikit lagi mencapai skor sempurna! Pertahankan fokus dan coba raih S Rank!";
    color = "text-green-600";
    badgeColor = "bg-green-100/90";
    icon = Zap;
  } else if (score >= 80) {
    grade = "B";
    message =
      "KEREN! Kamu sudah berada di jalur yang benar! Pelajari detailnya, lalu coba lagi!";
    color = "text-pink-600";
    badgeColor = "bg-pink-100/90";
    icon = Zap;
  }

  return { grade, message, color, badgeColor, icon };
};

/**
 * FUNGSI UTAMA: POST SKOR KE API (FIXED LOGIC DENGAN NULL/UNDEFINED CHECK)
 * Menerima data game dan user ID yang sudah pasti ada dari Zustand.
 */
const postScoreToAPI = async (data, userId) => {
  // Safety check ID
  if (!userId || isNaN(userId) || userId <= 0) {
    console.warn("User ID tidak ditemukan atau tidak valid. Skor DIBATALKAN.");
    return;
  }

  const DYNAMIC_GAME_ID = getGameId(data.gameType);

  // --- 🚨 PERBAIKAN NULL CHECK DENGAN ?? 0 ---
  // Pastikan nilai selalu integer/number, bukan null atau undefined
  const pointsOrScore =
    data.gameType === "MEMO_CARD" ? data.points ?? 0 : data.score ?? 0;
  const durationTime = parseInt(data.time, 10) ?? 30;
  const correctCount =
    data.gameType === "MEMO_CARD" ? data.matchedCount ?? 0 : data.correct ?? 0;

  // Hitung wrong answer untuk memory: total moves dikurangi matched count. Pastikan minimal 0.
  const wrongCountMemory = (data.moves ?? 0) - correctCount;

  const finalWrongAnswer =
    data.gameType === "MEMO_CARD"
      ? Math.max(0, wrongCountMemory) // Minimum 0
      : data.wrong ?? 0; // Ambil dari data.wrong jika quiz, default 0

  const totalMovesCount =
    data.gameType === "MEMO_CARD"
      ? data.moves ?? 0
      : (data.correct ?? 0) + (data.wrong ?? 0);

  // --- STRUKTUR DATA FINAL UNTUK BACKEND ANDA ---
  // PASTIKAN SEMUA FIELD ADALAH INTEGER VALID
  const scoreData = {
    user_id: parseInt(userId), // Int
    game_id: DYNAMIC_GAME_ID, // Int
    points: pointsOrScore, // Int (sesuai skema)
    duration_seconds: 0, // Int
    total_moves: totalMovesCount, // Int
    correct_answer: correctCount, // Int
    wrong_answer: finalWrongAnswer, // Int? (Opsional, tapi kita kirim Int 0 atau lebih)
  };
  // ---------------------------------------------

  console.log("-----------------------------------------");
  console.log("🚀 Data Final yang dikirim ke API:", scoreData); // Logging Payload
  console.log("-----------------------------------------");

  try {
    const response = await fetch(API_SCORE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scoreData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ API Error Response (Status 400/500):", errorData); // Logging Error Detail
      throw new Error(
        `Gagal mengirim skor: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("✅ Skor berhasil dikirim (Status 2xx):", result); // Logging Sukses Detail
    return result;
  } catch (error) {
    console.error(
      "🚨 Gagal memposting skor ke API (Catch Error):",
      error.message
    );
  }
};

// --- Komponen Detail Card (Tidak Berubah) ---

// Card untuk detail jawaban Memory Game (Pasangan)
const MemoryDetailCard = ({ pair, index }) => (
  <div className="p-4 md:p-5 rounded-xl shadow-inner border border-pink-200 bg-pink-50/80 transition-all hover:bg-pink-100">
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
            ${
              answer.isCorrect
                ? "bg-green-50/80 border border-green-200 hover:bg-green-100"
                : "bg-red-50/80 border border-red-200 hover:bg-red-100"
            }`}
  >
    <div className="flex items-start justify-between mb-2">
      <h3 className="text-base font-bold text-gray-800">
        Pertanyaan {index + 1}
      </h3>
      <span
        className={`flex-shrink-0 flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded-full shadow-sm
                ${
                  answer.isCorrect
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
      >
        {answer.isCorrect ? (
          <CheckCircle className="w-3 h-3" />
        ) : (
          <XCircle className="w-3 h-3" />
        )}
        {answer.isCorrect ? "Benar" : "Salah"}
      </span>
    </div>
    <p className="text-gray-700 font-medium mb-3 text-sm">
      {answer.statement || "Teks Pertanyaan Tidak Ditemukan"}
    </p>
    {/* Detail jawaban diatur lebih rapih */}
    <div className="text-xs">
      <p
        className={`font-semibold ${
          answer.isCorrect ? "text-green-700" : "text-red-700"
        }`}
      >
        Jawabanmu: <span className="capitalize">{answer.userAnswer}</span>
      </p>
      {!answer.isCorrect && answer.correctAnswer && (
        <p className="text-gray-500 mt-1">
          Jawaban Benar:{" "}
          <span className="font-semibold capitalize">
            {answer.correctAnswer}
          </span>
        </p>
      )}
    </div>
  </div>
);

// --- Komponen Utama ResultPage ---
export default function ResultPage() {
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();
  const resultRef = useRef(null);
  const completeAudioRef = useRef(null);
  const [scorePosted, setScorePosted] = useState(false);

  // --- AMBIL DATA DARI ZUSTAND ---
  const user = useAuthStore((state) => state.user);
  const initAuth = useAuthStore((state) => state.initAuth);
  const { trackGame } = useMissions();
  const { addStickers, updateStickersToServer } = useStickers();

  const [showAnimation, setShowAnimation] = useState(false);

  // User ID: Ambil dari `user.id`. GANTI KE `user?.user_id` JIKA NAMA FIELDNYA BEDA!
  const DYNAMIC_USER_ID = user?.id || null;
  // --------------------------------

  useEffect(() => {
    if (typeof window !== "undefined") {
      completeAudioRef.current = new Audio("/audio/complete.mp3");

      // PENTING: Panggil initAuth untuk memuat data dari localStorage saat mount
      initAuth();
    }

    const storedResult = localStorage.getItem("gameResult");
    let data = null;

    if (storedResult) {
      try {
        data = JSON.parse(storedResult);
        setResultData(data);
        setLoading(false);
      } catch (e) {
        console.error("Error parsing gameResult from localStorage:", e);
        setLoading(false);
        return;
      }

      completeAudioRef.current
        ?.play()
        .catch((err) => console.warn("Autoplay diblokir:", err));
    } else {
      setLoading(false);
      setTimeout(() => router.push("/mini-game/"), 500);
      return;
    }

    // --- LOGIKA UTAMA: POST SKOR KE API ---
    if (!scorePosted && data && DYNAMIC_USER_ID) {
      // Panggil fungsi postScoreToAPI dengan data yang sudah di-fix
      postScoreToAPI(data, DYNAMIC_USER_ID)
        .then(() => {
          // Tambahkan ini: Setelah skor berhasil dikirim, track misi game
          console.log("Skor berhasil dikirim, tracking misi game...");
          trackGame(addStickers, () => {
            setShowAnimation(true),
              updateStickersToServer,
              gsap.to("#score-container", {
                scale: 1.1,
                duration: 0.5,
                yoyo: true,
                repeat: 1,
              });
          });
        })
        .catch((error) => {
          console.error("Gagal kirim skor atau track misi:", error);
        });
      setScorePosted(true); // Tandai sudah dipost
    } else if (!scorePosted && data && !DYNAMIC_USER_ID) {
      console.warn("User belum login/ID tidak ada. Skor tidak dikirim ke API.");
      setScorePosted(true); // Tetap tandai true agar tidak re-run
    }

    // Animasi GSAP
    setTimeout(() => {
      gsap.to("#score-container", {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "expo.out",
        boxShadow: "0px 25px 50px -12px rgba(236, 72, 153, 0.4)",
      });
      gsap.fromTo(
        "#stats-grid > div",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, delay: 0.5 }
      );
      gsap.to("#back-btn", { opacity: 1, duration: 0.5, delay: 0.2 });
      gsap.to("#result-list", { opacity: 1, duration: 0.8, delay: 1 });
      gsap.to("#motivational-message", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.8,
      });
      gsap.to("#action-buttons", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 1.2,
      });
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
  }, [router, scorePosted, DYNAMIC_USER_ID, initAuth, trackGame, useStickers]);

  // --- FUNGSI DOWNLOAD HASIL ---
  const handleDownloadResult = useCallback(() => {
    if (!resultRef.current) return;

    gsap.to("#download-btn", {
      opacity: 0.5,
      pointerEvents: "none",
      duration: 0.3,
    });

    html2canvas(resultRef.current, {
      useCORS: true,
      allowTaint: true,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
      scale: 3,
    })
      .then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `Result_Game_Top_Player_${new Date().toISOString()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        gsap.to("#download-btn", {
          opacity: 1,
          pointerEvents: "auto",
          duration: 0.3,
        });
      })
      .catch((error) => {
        console.error("Gagal membuat screenshot:", error);
        gsap.to("#download-btn", {
          opacity: 1,
          pointerEvents: "auto",
          duration: 0.3,
        });
      });
  }, []);
  // -----------------------------

  if (loading || !resultData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <p className="text-xl font-semibold text-pink-500 mb-4">
          {loading ? "Memuat Hasil Game..." : "Data Hasil Tidak Ditemukan 😔"}
        </p>
        {!loading && (
          <button
            onClick={() => router.push("/mini-game/")}
            className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Kembali ke Daftar Game
          </button>
        )}
      </div>
    );
  }

  // LOGIC MULTI-GAME
  const isMemoryGame = resultData.gameType === "memory";
  const correctLabel = isMemoryGame ? "Pasangan Tepat" : "Jawaban Benar";
  const wrongLabel = isMemoryGame ? "Total Gerakan" : "Jawaban Salah";
  const correctValue = isMemoryGame
    ? resultData.matchedCount
    : resultData.correct;
  const wrongValue = isMemoryGame ? resultData.moves : resultData.wrong; // moves untuk memory, wrong untuk quiz
  const scoreValue = isMemoryGame ? resultData.points : resultData.score;
  const correctIcon = isMemoryGame ? Target : CheckCircle;
  const wrongIcon = isMemoryGame ? Repeat : XCircle;

  // PESAN MOTIVASI DINAMIS
  const {
    grade,
    message,
    color,
    badgeColor,
    icon: GradeIcon,
  } = getMotivationalMessage(scoreValue, isMemoryGame);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-100 via-white to-gray-50">
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={350}
          gravity={0.38}
          wind={0.03}
        />
      )}

      <section className="container mx-auto px-4 pt-6">
        <button
          id="back-btn"
          onClick={() => router.push("/mini-game")}
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

          {/* INFO POSTING SKOR (OPSIONAL, HANYA UNTUK DEBUG/INFO USER) */}
          {DYNAMIC_USER_ID ? (
            <p className="text-gray-500 mb-8 text-lg font-medium">
              Skor ini telah berhasil dikirim atas nama User ID: 
              {DYNAMIC_USER_ID}
            </p>
          ) : (
            <p className="text-red-500 mb-8 text-lg font-medium">
              Anda belum login. Skor TIDAK dikirimkan ke Papan Skor!
            </p>
          )}

          <div
            id="score-container"
            className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl shadow-pink-100/50 opacity-0 transform scale-0"
          >
            {/* 2. Score Circle */}
            <div className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex flex-col items-center justify-center text-white shadow-xl shadow-pink-400/50 transition-shadow duration-500">
              <span className="text-base font-medium opacity-80">
                {isMemoryGame ? "TOTAL POIN" : "FINAL SCORE"}
              </span>
              <span
                id="score-number"
                className="text-6xl md:text-7xl font-bold"
              >
                {scoreValue}
              </span>
            </div>

            <div
              id="motivational-message"
              className={`p-4 md:p-5 rounded-2xl shadow-lg mx-auto max-w-lg mb-8 opacity-0 transform translate-y-10 border-b-4 border-pink-200 ${badgeColor}`}
            >
              <div className="flex items-center justify-center gap-3">
                <GradeIcon className={`w-8 h-8 ${color}`} />
                <span
                  className={`text-4xl md:text-5xl font-extrabold ${color}`}
                >
                  {grade}
                </span>
                <GradeIcon className={`w-8 h-8 ${color}`} />
              </div>
              <p
                className={`text-lg md:text-xl font-bold mt-3 ${color} leading-snug`}
              >
                {message}
              </p>
            </div>

            {/* 3. Statistik Ringkas (GRID RESPONSIVE) */}
            <div
              id="stats-grid"
              className="grid grid-cols-3 gap-3 md:gap-6 opacity-0"
            >
              {/* Benar/Matched */}
              <div className="text-center p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
                <div
                  className={`w-10 h-10 md:w-14 md:h-14 mx-auto mb-1 rounded-full flex items-center justify-center 
                                    ${
                                      isMemoryGame
                                        ? "bg-pink-100"
                                        : "bg-green-100"
                                    }`}
                >
                  {React.createElement(correctIcon, {
                    className: `w-5 h-5 md:w-7 md:h-7 ${
                      isMemoryGame ? "text-pink-600" : "text-green-600"
                    }`,
                  })}
                </div>
                <p
                  className="text-xl md:text-3xl font-extrabold text-gray-800 leading-none"
                  id="correct-count"
                >
                  {correctValue}
                </p>
                <p className="text-xs md:text-sm text-gray-500 font-medium">
                  {correctLabel}
                </p>
              </div>
              {/* Salah/Moves */}
              <div className="text-center p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
                <div
                  className={`w-10 h-10 md:w-14 md:h-14 mx-auto mb-1 rounded-full flex items-center justify-center 
                                    ${
                                      isMemoryGame
                                        ? "bg-purple-100"
                                        : "bg-red-100"
                                    }`}
                >
                  {React.createElement(wrongIcon, {
                    className: `w-5 h-5 md:w-7 md:h-7 ${
                      isMemoryGame ? "text-purple-600" : "text-red-600"
                    }`,
                  })}
                </div>
                <p
                  className="text-xl md:text-3xl font-extrabold text-gray-800 leading-none"
                  id="wrong-count"
                >
                  {wrongValue}
                </p>
                <p className="text-xs md:text-sm text-gray-500 font-medium">
                  {wrongLabel}
                </p>
              </div>
              {/* Durasi */}
              <div className="text-center p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
                <div className="w-10 h-10 md:w-14 md:h-14 mx-auto mb-1 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 md:w-7 md:h-7 text-blue-600" />
                </div>
                <p
                  className="text-xl md:text-3xl font-extrabold text-gray-800 leading-none"
                  id="duration-time"
                >
                  {resultData.time}s
                </p>
                <p className="text-xs md:text-sm text-gray-500 font-medium">
                  Waktu Tempuh
                </p>
              </div>
            </div>
          </div>
          {/* AKHIR MAIN RESULT CARD */}

          {/* Aksi Buttons */}
          <div
            id="action-buttons"
            className="mt-8 flex flex-col sm:flex-row justify-center gap-3 md:gap-5 opacity-0 transform translate-y-10"
          >
            <button
              onClick={handleDownloadResult}
              id="download-btn"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-pink-600 text-white font-black text-base md:text-lg shadow-xl shadow-pink-400/60 hover:bg-pink-700 transition transform hover:scale-[1.03] min-w-[200px]"
            >
              <Download className="w-5 h-5 md:w-6 md:h-6" /> BAGIKAN PRESTASIMU
            </button>
          </div>

          {/* Detail Jawaban (Bedah Hasil) */}
          <div className="text-left mt-12 md:mt-16 opacity-0" id="result-list">
            <h2 className="text-2xl md:text-3xl font-black text-pink-600 mb-6 border-b-4 border-pink-300 inline-block pb-1">
              🔬 Bedah Hasil: Detail Jawaban{" "}
              {isMemoryGame ? "Tepat" : "Benar/Salah"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {resultData.answers.map((answer, index) =>
                isMemoryGame ? (
                  <MemoryDetailCard key={index} pair={answer} index={index} />
                ) : (
                  <QuizDetailCard key={index} answer={answer} index={index} />
                )
              )}
            </div>
          </div>

          {/* REKOMENDASI ARTIKEL */}
          <div
            id="recommendations"
            className="mt-20 pt-10 border-t-4 border-pink-300 opacity-0"
          >
            <h3 className="text-xl md:text-2xl font-extrabold text-center text-pink-600 mb-8 drop-shadow-sm">
              Halo! Saya AI RISA. Saya lihat score kamu {scoreValue}.
            </h3>

            <p className="text-center text-lg text-gray-600 mb-6">
              Untuk membantu Anda belajar lebih lanjut, saya rekomendasikan artikel ini:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Artikel 1: HIV */}
              <Link
                href="/article/1"
                className="group block transition duration-300 transform hover:translate-y-[-4px] shadow-xl hover:shadow-pink-200/50 rounded-xl overflow-hidden bg-white border border-gray-100 "
              >
                <div className="p-4 flex flex-col h-full">
                  <div className="h-40 w-full relative mb-3">
                    <Image
                      src={"/image/article-image-1.png"}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: "contain" }}
                      alt="Ilustrasi Pencegahan HIV"
                    />
                  </div>
                  <h4 className="font-bold lg:text-lg text-gray-800 text-center leading-snug p-2 group-hover:text-pink-600 transition">
                    HIV? Gak Usah Panik, Yuk Kenalan Dulu!
                  </h4>
                  <div className="mt-2 text-center">
                    <span className="text-base text-pink-500 font-medium flex items-center justify-center gap-1">
                      Baca Sekarang{" "}
                      <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Artikel 2: Seks */}
              <Link
                href="/article/2"
                className="group block transition duration-300 transform hover:translate-y-[-8px] shadow-xl hover:shadow-pink-200/50 rounded-xl overflow-hidden bg-white border border-gray-100"
              >
                <div className="p-4 flex flex-col h-full">
                  <div className="h-40 w-full relative mb-3">
                    <Image
                      src="/image/article-image-2.png"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: "contain" }}
                      alt="Ilustrasi Pengertian Seks"
                    />
                  </div>
                  <h4 className="font-bold lg:text-lg text-gray-800 text-center leading-snug p-2 group-hover:text-pink-600 transition">
                    Seks Itu Apa Sih? Biar Gak Salah Paham
                  </h4>
                  <div className="mt-2 text-center">
                    <span className="text-base text-pink-500 font-medium flex items-center justify-center gap-1">
                      Baca Sekarang{" "}
                      <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Artikel 3: Menstruasi */}
              <Link
                href="/article/3"
                className="group block transition duration-300 transform hover:translate-y-[-8px] shadow-xl hover:shadow-pink-200/50 rounded-xl overflow-hidden bg-white border border-gray-100"
              >
                <div className="p-4 flex flex-col h-full">
                  <div className="h-40 w-full relative mb-3">
                    <Image
                      src={"/image/article-image-3.png"}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: "contain" }}
                      alt="Ilustrasi Menstruasi Pertama"
                    />
                  </div>
                  <h4 className="font-bold lg:text-lg text-gray-800 text-center leading-snug p-2 group-hover:text-pink-600 transition">
                    Menstruasi Pertama: Kenapa dan Gak Usah Takut
                  </h4>
                  <div className="mt-2 text-center">
                    <span className="text-base text-pink-500 font-medium flex items-center justify-center gap-1">
                      Baca Sekarang{" "}
                      <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <StickerRewardAnimation
        show={showAnimation}
        onComplete={() => setShowAnimation(false)}
      />
    </div>
  );
}
