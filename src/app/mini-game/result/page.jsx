'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import Confetti from 'react-confetti';
import Image from 'next/image';
import { ChevronLeft, Target, Repeat, CheckCircle, XCircle, Trophy, ChevronRight, Zap, BrainCircuit, Sparkles, Share2 } from 'lucide-react';
import Link from 'next/link';
// --- INTEGRASI ZUSTAND / AUTH ---
import useAuthStore from '../../store/useAuthStore';
import useMissions from '../../store/useMissions';
import useStickers from '../../store/useStickers';

import StickerRewardAnimation from '../../components/ui/StickerRewardAnimation';
import CustomButton from '../../components/ui/CustomButton';

// Konstanta
const DURATION_TO_REDIRECT = 10000;
const API_SCORE_ENDPOINT = 'https://server-risa.vercel.app/api/scores';

// --- FUNGSI HELPER ---
const getGameId = (gameType) => {
  switch (gameType) {
    case 'MEMO_CARD':
      return 2;
    case 'DRAG_DROP':
    case 'mitosfakta':
      return 1;
    default:
      return 0;
  }
};

const getMotivationalMessage = (score, isMemoryGame) => {
  const type = isMemoryGame ? 'poin' : 'nilai';
  let grade = 'C';
  let message = `Kamu berhasil mendapat ${type} ${score}. Jangan menyerah, yuk coba lagi untuk skor yang lebih tinggi!`;
  let color = 'text-yellow-600';
  let badgeColor = 'bg-yellow-50/80';
  let icon = Zap;

  if (score >= 100) {
    grade = 'S Rank';
    message = 'LEVEL MASTER! Kamu mendominasi permainan ini. Pengetahuan kamu LUAR BIASA! 🏆';
    color = 'text-purple-600';
    badgeColor = 'bg-purple-100/90';
    icon = Trophy;
  } else if (score >= 90) {
    grade = 'A+';
    message = 'FANTASTIS! Sedikit lagi mencapai skor sempurna! Pertahankan fokus dan coba raih nilai sempurna!';
    color = 'text-green-600';
    badgeColor = 'bg-green-100/90';
    icon = Zap;
  } else if (score >= 80) {
    grade = 'B';
    message = 'KEREN! Kamu sudah berada di jalur yang benar! Pelajari detailnya, lalu coba lagi!';
    color = 'text-pink-600';
    badgeColor = 'bg-pink-100/90';
    icon = Zap;
  }

  return { grade, message, color, badgeColor, icon };
};

const toSeconds = (val) => {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') {
    if (val.includes(':')) {
      const [mm = '0', ss = '0'] = val.split(':');
      const m = parseInt(mm, 10);
      const s = parseInt(ss, 10);
      if (!isNaN(m) && !isNaN(s)) return m * 60 + s;
    }
    const n = parseInt(val, 10);
    if (!isNaN(n)) return n;
  }
  return 0;
};

const postScoreToAPI = async (data, userId) => {
  if (!userId || isNaN(userId) || userId <= 0) {
    console.warn('User ID tidak ditemukan atau tidak valid. Skor DIBATALKAN.');
    return;
  }

  const DYNAMIC_GAME_ID = getGameId(data.gameType);
  const pointsOrScore = data.gameType === 'MEMO_CARD' ? data.points ?? 0 : data.score ?? 0;
  const durationSeconds = Number.isFinite(data?.duration_seconds) ? data.duration_seconds : toSeconds(data?.duration ?? data?.time ?? 0);
  const correctCount = data.gameType === 'MEMO_CARD' ? data.matchedCount ?? 0 : data.correct ?? 0;
  const wrongCountMemory = (data.moves ?? 0) - correctCount;

  const finalWrongAnswer = data.gameType === 'MEMO_CARD' ? Math.max(0, wrongCountMemory) : data.wrong ?? 0;

  const totalMovesCount = data.gameType === 'MEMO_CARD' ? data.moves ?? 0 : (data.correct ?? 0) + (data.wrong ?? 0);

  const scoreData = {
    user_id: parseInt(userId),
    game_id: DYNAMIC_GAME_ID,
    points: pointsOrScore,
    duration_seconds: durationSeconds,
    total_moves: totalMovesCount,
    correct_answer: correctCount,
    wrong_answer: finalWrongAnswer,
  };

  try {
    const response = await fetch(API_SCORE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scoreData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error Response:', errorData);
      throw new Error(`Gagal mengirim skor: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Skor berhasil dikirim:', result);
    return result;
  } catch (error) {
    console.error('🚨 Gagal memposting skor ke API:', error.message);
  }
};

// --- Komponen Detail Card ---
const MemoryDetailCard = ({ pair, index }) => (
  <div className="p-4 md:p-5 rounded-xl shadow-inner border border-pink-200 bg-pink-50/80 transition-all hover:bg-pink-100">
    <div className="flex items-start justify-between mb-2">
      <h3 className="text-base font-bold text-pink-700">Pasangan Tepat {index + 1}</h3>
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

const QuizDetailCard = ({ answer, index }) => (
  <div
    className={`p-4 md:p-5 rounded-xl shadow-inner transition-all 
            ${answer.isCorrect ? 'bg-green-50/80 border border-green-200 hover:bg-green-100' : 'bg-red-50/80 border border-red-200 hover:bg-red-100'}`}
  >
    <div className="flex items-start justify-between mb-2">
      <h3 className="text-base font-bold text-gray-800">Pertanyaan {index + 1}</h3>
      <span
        className={`flex-shrink-0 flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded-full shadow-sm
                ${answer.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
      >
        {answer.isCorrect ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        {answer.isCorrect ? 'Benar' : 'Salah'}
      </span>
    </div>
    <p className="text-gray-700 font-medium mb-3 text-sm">{answer.statement || 'Teks Pertanyaan Tidak Ditemukan'}</p>
    <div className="text-xs">
      <p className={`font-semibold ${answer.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
        Jawabanmu: <span className="capitalize">{answer.userAnswer}</span>
      </p>
      {!answer.isCorrect && answer.correctAnswer && (
        <p className="text-gray-500 mt-1">
          Jawaban Benar: <span className="font-semibold capitalize">{answer.correctAnswer}</span>
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
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiArticles, setAiArticles] = useState([]);
  const [aiRequestSent, setAiRequestSent] = useState(false);

  const { user, initAuth } = useAuthStore();
  const { trackGame } = useMissions();
  const { addStickers, updateStickersToServer } = useStickers();

  const [showAnimation, setShowAnimation] = useState(false);

  const DYNAMIC_USER_ID = user?.id || null;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      completeAudioRef.current = new Audio('/audio/complete.mp3');
      initAuth();
    }

    const storedResult = localStorage.getItem('gameResult');
    let data = null;

    if (storedResult) {
      try {
        data = JSON.parse(storedResult);
        setResultData(data);
        setLoading(false);
      } catch (e) {
        console.error('Error parsing gameResult from localStorage:', e);
        setLoading(false);
        return;
      }

      completeAudioRef.current?.play().catch((err) => console.warn('Autoplay diblokir:', err));
    } else {
      setLoading(false);
      setTimeout(() => router.push('/mini-game/'), 500);
      return;
    }

    if (!scorePosted && data && DYNAMIC_USER_ID) {
      postScoreToAPI(data, DYNAMIC_USER_ID)
        .then(() => {
          trackGame(addStickers, () => {
            setShowAnimation(true),
              updateStickersToServer,
              gsap.to('#score-container', {
                scale: 1.1,
                duration: 0.5,
                yoyo: true,
                repeat: 1,
              });
          });
        })
        .catch((error) => {
          console.error('Gagal kirim skor atau track misi:', error);
        });
      setScorePosted(true);
    } else if (!scorePosted && data && !DYNAMIC_USER_ID) {
      console.warn('User belum login/ID tidak ada. Skor tidak dikirim ke API.');
      setScorePosted(true);
    }

    const isAiGameType = data && (data.gameType === 'DRAG_DROP' || data.gameType === 'mitosfakta' || data.gameType === 'MEMO_CARD' || data.gameType === 'memory');
    if (isAiGameType && !aiRequestSent) {
      setIsAiLoading(true);
      setAiRequestSent(true);

      const normalizedAnswers =
        data.gameType === 'DRAG_DROP' || data.gameType === 'mitosfakta'
          ? data.answers || []
          : (data.answers || []).map((p) => ({
              statement: `${p.term || 'Istilah'} — ${p.definition || 'Definisi'}`,
              userAnswer: 'matched',
              correctAnswer: 'matched',
              isCorrect: true,
            }));
      const normalizedScore = data.gameType === 'MEMO_CARD' || data.gameType === 'memory' ? data.points ?? data.score ?? 0 : data.score ?? 0;

      fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: normalizedAnswers, score: normalizedScore }),
      })
        .then(async (res) => {
          const text = await res.text();
          if (!res.ok) {
            console.error('AI route error', res.status, text);
            throw new Error('AI API error');
          }
          try {
            return JSON.parse(text);
          } catch (e) {
            console.error('AI JSON parse error: ', e, text);
            throw new Error('AI API error');
          }
        })
        .then((payload) => {
          setAiAnalysis(payload?.analysis || '');
          setAiArticles(Array.isArray(payload?.recommendedArticles) ? payload.recommendedArticles : []);
        })
        .catch((err) => {
          console.warn('AI request failed:', err?.message || err);
          setAiAnalysis('RISA lagi sibuk sebentar. Ini ringkasan singkat: kamu sudah bagus, lanjut asah topik yang salah, ya!');
          setAiArticles([]);
        })
        .finally(() => setIsAiLoading(false));
    }

    setTimeout(() => {
      gsap.to('#score-container', {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'expo.out',
        boxShadow: '0px 25px 50px -12px rgba(236, 72, 153, 0.4)',
      });
      gsap.fromTo('#stats-grid > div', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, delay: 0.5 });
      gsap.to('#back-btn', { opacity: 1, duration: 0.5, delay: 0.2 });
      gsap.to('#result-list', { opacity: 1, duration: 0.8, delay: 1 });
      gsap.to('#motivational-message', { opacity: 1, y: 0, duration: 0.8, delay: 0.8 });
      gsap.to('#action-buttons', { opacity: 1, y: 0, duration: 0.8, delay: 1.2 });
      gsap.to('#recommendations', { opacity: 1, duration: 1, delay: 1.5 });
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
  }, [router, scorePosted, DYNAMIC_USER_ID, initAuth, trackGame, addStickers, updateStickersToServer, aiRequestSent]);

  // --- SHARE: Web Share API (fallback clipboard) ---
  const handleShareResult = useCallback(async () => {
    const origin = window.location.origin;
    const shareUrl = window.location.href || `${origin}/mini-game`;
    const gameType = resultData?.gameType || 'game';
    const score = gameType === 'MEMO_CARD' || gameType === 'memory' ? resultData?.points ?? resultData?.score ?? 0 : resultData?.score ?? resultData?.points ?? 0;

    const shareTitle = `Main ${gameType} di RISA seru banget, beneran bikin mikir! Aku dapat nilai ${score} loh`;
    const shareText = `Yuk main juga, biar kita bandingin hasilnya!`;

    gsap.to('#share-btn-game', { opacity: 0.5, pointerEvents: 'none', duration: 0.3 });

    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle, text: `${shareText}\n${shareUrl}`, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(`${shareTitle}\n${shareText}\n${shareUrl}`);
        alert('Link hasil sudah disalin. Tempelkan ke chat/medsos kamu!');
      }
    } catch (e) {
      console.error('Gagal membagikan hasil:', e);
      try {
        await navigator.clipboard.writeText(`${shareTitle}\n${shareText}\n${shareUrl}`);
        alert('Link hasil sudah disalin. Tempelkan ke chat/medsos kamu!');
      } catch {
        alert('Gagal membagikan/menyalin link.');
      }
    } finally {
      gsap.to('#share-btn-game', { opacity: 1, pointerEvents: 'auto', duration: 0.3 });
    }
  }, [resultData]);

  if (loading || !resultData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <p className="text-xl font-semibold text-pink-500 mb-4">{loading ? 'Memuat Hasil Game...' : 'Data Hasil Tidak Ditemukan 😔'}</p>
        {!loading && (
          <button onClick={() => router.push('/mini-game/')} className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
            <ChevronLeft className="w-5 h-5 mr-1" /> Kembali ke Daftar Game
          </button>
        )}
      </div>
    );
  }

  const isMemoryGame = resultData.gameType === 'memory' || resultData.gameType === 'MEMO_CARD';
  const isAiGame = resultData.gameType === 'DRAG_DROP' || resultData.gameType === 'mitosfakta' || resultData.gameType === 'MEMO_CARD' || resultData.gameType === 'memory';
  const correctLabel = isMemoryGame ? 'Pasangan Tepat' : 'Jawaban Benar';
  const wrongLabel = isMemoryGame ? 'Total Gerakan' : 'Jawaban Salah';
  const correctValue = isMemoryGame ? resultData.matchedCount ?? resultData.correct_answer ?? 0 : resultData.correct ?? 0;
  const wrongValue = isMemoryGame ? resultData.total_moves ?? resultData.moves ?? 0 : resultData.wrong ?? 0;
  const scoreValue = isMemoryGame ? resultData.points ?? resultData.score ?? 0 : resultData.score ?? resultData.points ?? 0;
  const rawTime = resultData.time ?? resultData.duration ?? resultData.duration_seconds;
  const displayTime = typeof rawTime === 'string' ? rawTime : `${Number(rawTime || 0)}s`;
  const correctIcon = isMemoryGame ? Target : CheckCircle;
  const wrongIcon = isMemoryGame ? Repeat : XCircle;

  const { grade, message, color, badgeColor, icon: GradeIcon } = getMotivationalMessage(scoreValue, isMemoryGame);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-100 via-white to-gray-50">
      {showConfetti && <Confetti recycle={false} numberOfPieces={350} gravity={0.38} wind={0.03} />}

      <section className="container mx-auto px-4 pt-6">
        <button id="back-btn" onClick={() => router.push('/mini-game')} className="flex items-center text-gray-600 hover:text-pink-500 transition-colors duration-200 opacity-0" aria-label="Kembali">
          <ChevronLeft className="w-6 h-6 mr-2" />
          Kembali ke Menu Game
        </button>
      </section>

      {/* RESULT SECTION */}
      <section className="container mx-auto px-4 py-8 md:py-12" ref={resultRef} data-capture-root>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-black text-pink-500 mb-2 drop-shadow-md">Kamu mendapat</h1>

          <div id="score-container" className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl shadow-pink-100/50 opacity-0 transform scale-0">
            {/* Score Circle */}
            <div className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex flex-col items-center justify-center text-white shadow-xl shadow-pink-400/50 transition-shadow duration-500">
              <span className="text-base font-medium opacity-80">{isMemoryGame ? 'TOTAL POIN' : 'TOTAL NILAI'}</span>
              <span id="score-number" className="text-6xl md:text-7xl font-bold">
                {scoreValue}
              </span>
            </div>

            <div id="motivational-message" className={`p-4 md:p-5 rounded-2xl shadow-lg mx-auto max-w-lg mb-3 opacity-0 transform translate-y-10 border-b-4 border-pink-200 ${badgeColor}`}>
              <div className="flex items-center justify-center gap-3">
                <GradeIcon className={`w-8 h-8 ${color}`} />
                <span className={`text-2xl md:text-3xl font-extrabold ${color}`}>{grade}</span>
                <GradeIcon className={`w-8 h-8 ${color}`} />
              </div>
              <p className={`text-md md:text-xl font-bold mt-3 ${color} leading-snug`}>{message}</p>
            </div>

            {/* Action buttons */}
            <div id="action-buttons" className="mt-2 flex flex-col sm:flex-row justify-center gap-3 md:gap-4 opacity-0 transform translate-y-10">
              <CustomButton id="share-btn-game" title="Bagikan Hasil" text="Bagikan Hasilmu" onClick={handleShareResult} className="text-base md:text-lg min-w-[200px] flex items-center justify-center gap-2 px-6 py-3" role="button" />
            </div>
          </div>

          {/* Detail Jawaban */}
          <div className="text-left mt-12 md:mt-16 opacity-0" id="result-list">
            <h2 className="text-2xl md:text-3xl font-black text-pink-600 mb-6 border-b-4 border-pink-300 inline-block pb-1">🔬 Bedah Hasil: Detail Jawaban {isMemoryGame ? 'Tepat' : 'Benar/Salah'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {Array.isArray(resultData.answers) && resultData.answers.length > 0 ? (
                resultData.answers.map((answer, index) => (isMemoryGame ? <MemoryDetailCard key={index} pair={answer} index={index} /> : <QuizDetailCard key={index} answer={answer} index={index} />))
              ) : (
                <div className="col-span-1 md:col-span-2">
                  <div className="p-4 md:p-5 rounded-xl border border-pink-200 bg-pink-50/80 text-center text-pink-700 font-medium shadow-sm">
                    {isMemoryGame ? 'Belum ada pasangan tepat yang ditemukan pada permainan ini.' : 'Belum ada detail jawaban untuk ditampilkan.'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rekomendasi */}
          <div id="recommendations" className="mt-20 pt-10 border-t-4 border-pink-300 opacity-0">
            {isAiGame ? (
              <>
                <div className="mb-6 text-left">
                  <div className="p-5 md:p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-white border border-purple-200 rounded-2xl shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-md">
                        <BrainCircuit className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 text-pink-600 font-semibold">
                          <Sparkles className="w-5 h-5" />
                          <span>Analisis AI RISA</span>
                        </div>
                        {isAiLoading ? (
                          <div className="flex items-center gap-2 text-gray-600">
                            <div className="w-4 h-4 border-2 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
                            <span>Menyusun rekomendasi personalmu…</span>
                          </div>
                        ) : (
                          <p className="text-base md:text-lg text-gray-800 leading-relaxed">{aiAnalysis}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {aiArticles.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {aiArticles.map((article) => (
                      <Link
                        key={article.id}
                        href={article.href}
                        className="group block transition duration-300 transform hover:translate-y-[-6px] shadow-xl hover:shadow-pink-200/50 rounded-xl overflow-hidden bg-white border border-gray-100"
                      >
                        <div className="p-4 flex flex-col h-full">
                          <div className="h-40 w-full relative mb-3">
                            <Image src={article.image} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'contain' }} alt={article.alt || article.title} />
                          </div>
                          <h4 className="font-bold lg:text-lg text-gray-800 text-center leading-snug p-2 group-hover:text-pink-600 transition">{article.title}</h4>
                          <div className="mt-2 text-center">
                            <span className="text-base text-pink-500 font-medium flex items-center justify-center gap-1">
                              Baca Sekarang <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  !isAiLoading && <p className="text-center text-lg text-gray-600 mb-6">Kerja bagus! RISA tidak memiliki rekomendasi tambahan saat ini.</p>
                )}
              </>
            ) : (
              <>
                <p className="text-center text-lg text-gray-600 mb-6">Yuk dibaca! Artikel ini akan bantu tingkatkan pengetahuan dan poin di game berikutnya. 🚀</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <Link href="/article/1" className="group block transition duration-300 transform hover:translate-y-[-4px] shadow-xl hover:shadow-pink-200/50 rounded-xl overflow-hidden bg-white border border-gray-100 ">
                    <div className="p-4 flex flex-col h-full">
                      <div className="h-40 w-full relative mb-3">
                        <Image src={'/image/article-image-1.png'} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'contain' }} alt="Ilustrasi Pencegahan HIV" />
                      </div>
                      <h4 className="font-bold lg:text-lg text-gray-800 text-center leading-snug p-2 group-hover:text-pink-600 transition">HIV? Gak Usah Panik, Yuk Kenalan Dulu!</h4>
                      <div className="mt-2 text-center">
                        <span className="text-base text-pink-500 font-medium flex items-center justify-center gap-1">
                          Baca Sekarang <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                  <Link href="/article/2" className="group block transition duration-300 transform hover:translate-y-[-8px] shadow-xl hover:shadow-pink-200/50 rounded-xl overflow-hidden bg-white border border-gray-100">
                    <div className="p-4 flex flex-col h-full">
                      <div className="h-40 w-full relative mb-3">
                        <Image src="/image/article-image-2.png" fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'contain' }} alt="Ilustrasi Pengertian Seks" />
                      </div>
                      <h4 className="font-bold lg:text-lg text-gray-800 text-center leading-snug p-2 group-hover:text-pink-600 transition">Seks Itu Apa Sih? Biar Gak Salah Paham</h4>
                      <div className="mt-2 text-center">
                        <span className="text-base text-pink-500 font-medium flex items-center justify-center gap-1">
                          Baca Sekarang <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                  <Link href="/article/3" className="group block transition duration-300 transform hover:translate-y-[-8px] shadow-xl hover:shadow-pink-200/50 rounded-xl overflow-hidden bg-white border border-gray-100">
                    <div className="p-4 flex flex-col h-full">
                      <div className="h-40 w-full relative mb-3">
                        <Image src={'/image/article-image-3.png'} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'contain' }} alt="Ilustrasi Menstruasi Pertama" />
                      </div>
                      <h4 className="font-bold lg:text-lg text-gray-800 text-center leading-snug p-2 group-hover:text-pink-600 transition">Menstruasi Pertama: Kenapa dan Gak Usah Takut</h4>
                      <div className="mt-2 text-center">
                        <span className="text-base text-pink-500 font-medium flex items-center justify-center gap-1">
                          Baca Sekarang <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <StickerRewardAnimation show={showAnimation} onComplete={() => setShowAnimation(false)} />
    </div>
  );
}
