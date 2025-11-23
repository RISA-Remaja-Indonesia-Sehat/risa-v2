'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Heart } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import usePubertyQuestStore from '../../store/usePubertyQuestStore';
import IntroScreen from '../../components/puberty-quest/IntroScreen';
import { TTS_SCRIPTS } from '../../components/puberty-quest/quizData';
import BackButton from '@/app/components/games/BackButton';

const CHAPTERS = [
  { id: 1, title: 'Awal Pubertas', description: 'Kenali tanda-tanda pubertas' },
  { id: 2, title: 'Organ Reproduksi', description: 'Kenalan dengan organ tubuh'},
  { id: 3, title: 'Siklus Menstruasi', description: 'Pahami siklus tubuhmu'},
  { id: 4, title: 'Pubertas & Emosi', description: 'Kelola emosi dengan baik'},
  { id: 5, title: 'Merawat Diri', description: 'Ritual kesehatan diri'},
];

export default function PubertyQuestPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuthStore();
  const { progress, fetchProgress, loading } = usePubertyQuestStore();

  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    const hasSeenIntro = localStorage.getItem('puberty-quest-intro-seen');
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
    
    fetchProgress();
  }, [isLoggedIn]);

  useEffect(() => {
    const nav = document.querySelector('nav');
    const footer = document.querySelector('footer');
    if (nav) nav.style.display = 'none';
    if (footer) footer.style.display = 'none';

    return () => {
      if (nav) nav.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, []);

  const getChapterStatus = (chapter) => {
    const chapterProgress = progress.find(p => p.chapter === chapter.id);
    const prevChapterCompleted = chapter.id === 1 || progress.find(p => p.chapter === chapter.id - 1)?.completed;
    return {
      completed: chapterProgress?.completed || false,
      score: chapterProgress?.score || 0,
      isUnlocked: prevChapterCompleted
    };
  };

  const handleCloseIntro = () => {
    setShowIntro(false);
    localStorage.setItem('puberty-quest-intro-seen', 'true');
  };

  const completedCount = progress.filter(p => p.completed).length;
  const progressPercentage = (completedCount / CHAPTERS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-100">
      {showIntro && (
        <IntroScreen message={TTS_SCRIPTS.intro} onClose={handleCloseIntro} />
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <BackButton />
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-rose-700 mb-4">
            🌸 Puberty Quest 🌸
          </h1>
          <p className="text-lg text-rose-600 max-w-2xl mx-auto">
            Perjalanan seru mengenal tubuhmu! Selesaikan setiap chapter untuk belajar lebih banyak.
          </p>
        </div>

        {/* Progress Overview - Beautiful Design */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-pink-100 via-rose-50 to-pink-50 rounded-3xl p-8 shadow-xl border-2 border-pink-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
                <h2 className="text-2xl font-bold text-rose-700">Progress Kamu</h2>
              </div>
              <div className="bg-white rounded-full px-6 py-2 shadow-md border-2 border-pink-300">
                <span className="font-bold text-rose-600 text-lg">{completedCount}/{CHAPTERS.length}</span>
              </div>
            </div>

            {/* Progress Bar with Glow */}
            <div className="mb-4">
              <div className="relative h-4 bg-white rounded-full overflow-hidden shadow-inner border border-pink-200">
                <div
                  className="h-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Motivational Message */}
            <div className="text-center">
              {completedCount === CHAPTERS.length ? (
                <p className="text-rose-700 font-bold text-lg">🎉 Wow! Kamu sudah menyelesaikan semua chapter!</p>
              ) : (
                <p className="text-rose-600 font-semibold">
                  {completedCount === 0 ? '🚀 Mulai petualanganmu sekarang!' : `✨ ${CHAPTERS.length - completedCount} chapter lagi untuk menyelesaikan!`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Chapters Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHAPTERS.map((chapter) => {
              const status = getChapterStatus(chapter);
              
              return (
                <div
                  key={chapter.id}
                  className={`rounded-2xl p-6 shadow-lg border-2 transition-all ${
                    status.isUnlocked
                      ? 'bg-white border-pink-300 hover:border-rose-500 hover:shadow-xl cursor-pointer hover:scale-105'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                  onClick={() => {
                    if (status.isUnlocked) {
                      router.push(`/mini-game/puberty-quest/chapter-${chapter.id}`);
                    }
                  }}
                >
                  {/* Chapter Number */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      status.completed
                        ? 'bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-lg'
                        : status.isUnlocked
                        ? 'bg-gradient-to-br from-pink-200 to-rose-200 text-rose-700'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {status.completed ? '✓' : chapter.id}
                    </div>
                  </div>

                  {/* Chapter Info */}
                  <h3 className="text-xl font-bold text-rose-700 mb-2">{chapter.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{chapter.description}</p>

                  {/* Status */}
                  {status.completed ? (
                    <div className="bg-gradient-to-r from-pink-100 to-rose-100 text-rose-700 px-3 py-2 rounded-lg text-sm font-medium border border-pink-300">
                      ✓ Selesai - Score: {status.score}
                    </div>
                  ) : status.isUnlocked ? (
                    <div className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-md">
                      Mulai Petualangan →
                    </div>
                  ) : (
                    <div className="bg-gray-100 text-gray-500 px-3 py-2 rounded-lg text-sm font-medium">
                      🔒 Selesaikan chapter sebelumnya
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-pink-100 rounded-2xl p-6 border-2 border-pink-300">
          <h3 className="font-bold text-rose-700 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> Tips:
          </h3>
          <ul className="text-rose-700 text-sm space-y-1">
            <li>• Selesaikan chapter secara berurutan untuk unlock chapter berikutnya</li>
            <li>• Progress kamu otomatis tersimpan</li>
            <li>• Kamu bisa mengulang chapter kapan saja</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
