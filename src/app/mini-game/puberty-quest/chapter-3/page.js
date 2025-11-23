'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ChapterDialog from '../../../components/puberty-quest/ChapterDialog';
import { QUIZ_DATA, TTS_SCRIPTS } from '../../../components/puberty-quest/quizData';
import usePubertyQuestStore from '../../../store/usePubertyQuestStore';
import { Heart, Zap, Droplet } from 'lucide-react';

const PHASES = ['Menstruasi', 'Folikular', 'Ovulasi', 'Luteal'];
const ACTIONS = [
  { name: 'Istirahat Cukup', mood: 10, energy: 10, hydration: 5 },
  { name: 'Minum Air', mood: 5, energy: 5, hydration: 15 },
  { name: 'Olahraga Ringan', mood: 15, energy: -5, hydration: -5 },
  { name: 'Kelola Stress', mood: 20, energy: 10, hydration: 0 }
];

export default function Chapter3() {
  const router = useRouter();
  const { saveProgress } = usePubertyQuestStore();
  const [phase, setPhase] = useState(0);
  const [mood, setMood] = useState(50);
  const [energy, setEnergy] = useState(50);
  const [hydration, setHydration] = useState(50);
  const [showQuiz, setShowQuiz] = useState(false);
  const [dialogState, setDialogState] = useState({ show: true, type: 'intro', message: TTS_SCRIPTS.chapter3.intro });
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  const handleAction = (action) => {
    setMood(prev => Math.min(100, Math.max(0, prev + action.mood)));
    setEnergy(prev => Math.min(100, Math.max(0, prev + action.energy)));
    setHydration(prev => Math.min(100, Math.max(0, prev + action.hydration)));
    if (phase < PHASES.length - 1) {
      setTimeout(() => setPhase(prev => prev + 1), 500);
    } else {
      setTimeout(() => setShowQuiz(true), 1000);
    }
  };

  const finishChapter = async () => {
    await saveProgress(3, 100, true);
    setShowCompleteDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-yellow-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-pink-400 rounded-3xl p-6 shadow-lg mb-6 border-2 border-pink-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Chapter 3: Siklus Menstruasi</h1>
              <p className="text-pink-100">Fase: <span className="font-bold">{PHASES[phase]}</span></p>
            </div>
            <button
              onClick={() => router.push('/mini-game/puberty-quest')}
              className="px-4 py-2 bg-white hover:bg-pink-100 rounded-full text-pink-600 font-bold transition-all"
            >
              ← Kembali
            </button>
          </div>
        </div>

        {!showQuiz ? (
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-pink-200">
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-pink-100 to-pink-50 p-6 rounded-2xl border-2 border-pink-300">
                <Heart className="w-8 h-8 text-pink-500 mb-3 fill-pink-500" />
                <p className="text-sm font-bold text-pink-700 mb-2">Mood</p>
                <div className="w-full bg-white rounded-full h-3 border border-pink-300">
                  <div className="bg-gradient-to-r from-pink-400 to-pink-500 h-3 rounded-full" style={{ width: `${mood}%` }} />
                </div>
                <p className="text-xs text-pink-600 mt-2 font-semibold">{mood}%</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-6 rounded-2xl border-2 border-yellow-300">
                <Zap className="w-8 h-8 text-yellow-500 mb-3 fill-yellow-500" />
                <p className="text-sm font-bold text-yellow-700 mb-2">Energi</p>
                <div className="w-full bg-white rounded-full h-3 border border-yellow-300">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full" style={{ width: `${energy}%` }} />
                </div>
                <p className="text-xs text-yellow-600 mt-2 font-semibold">{energy}%</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-100 to-cyan-50 p-6 rounded-2xl border-2 border-cyan-300">
                <Droplet className="w-8 h-8 text-cyan-500 mb-3 fill-cyan-500" />
                <p className="text-sm font-bold text-cyan-700 mb-2">Hidrasi</p>
                <div className="w-full bg-white rounded-full h-3 border border-cyan-300">
                  <div className="bg-gradient-to-r from-cyan-400 to-cyan-500 h-3 rounded-full" style={{ width: `${hydration}%` }} />
                </div>
                <p className="text-xs text-cyan-600 mt-2 font-semibold">{hydration}%</p>
              </div>
            </div>

            <h3 className="font-bold text-xl text-pink-600 mb-4">Pilih tindakan terbaik:</h3>
            <div className="grid grid-cols-2 gap-4">
              {ACTIONS.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleAction(action)}
                  className="p-4 bg-pink-100 hover:bg-pink-200 rounded-2xl border-2 border-pink-300 font-bold text-pink-700 transition-all hover:scale-105 shadow-md"
                >
                  {action.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-pink-200 text-center">
            <h2 className="text-3xl font-bold text-pink-600 mb-4">🎉 Selamat!</h2>
            <p className="text-gray-700 mb-8 text-lg">Kamu berhasil melewati semua fase siklus!</p>
            <button
              onClick={finishChapter}
              className="bg-pink-400 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all"
            >
              Selesai
            </button>
          </div>
        )}

        <ChapterDialog
          type="intro"
          message={TTS_SCRIPTS.chapter3.intro}
          show={dialogState.show}
          onClose={() => {
            setDialogState((prev) => ({ ...prev, show: false }));
            setShowGameDialog(true);
          }}
        />

        <ChapterDialog
          type="game"
          message={TTS_SCRIPTS.chapter3.game}
          show={showGameDialog}
          onClose={() => setShowGameDialog(false)}
        />

        <ChapterDialog
          type="complete"
          message={TTS_SCRIPTS.chapter3.complete}
          show={showCompleteDialog}
          onClose={() => {
            setShowCompleteDialog(false);
            router.push('/mini-game/puberty-quest');
          }}
        />
      </div>
    </div>
  );
}
