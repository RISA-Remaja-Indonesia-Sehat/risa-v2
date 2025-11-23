'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ChapterDialog from '../../../components/puberty-quest/ChapterDialog';
import { TTS_SCRIPTS } from '../../../components/puberty-quest/quizData';
import usePubertyQuestStore from '../../../store/usePubertyQuestStore';

const SCENARIOS = [
  {
    situation: 'Kamu merasa kesal karena teman tidak mengerti perasaanmu',
    options: [
      { text: 'Marah dan tidak bicara lagi', good: false },
      { text: 'Bicara baik-baik dan jelaskan perasaanmu', good: true },
      { text: 'Pura-pura tidak apa-apa', good: false }
    ]
  },
  {
    situation: 'Mood kamu tiba-tiba down tanpa alasan jelas',
    options: [
      { text: 'Menyalahkan diri sendiri', good: false },
      { text: 'Istirahat dan lakukan hal yang menyenangkan', good: true },
      { text: 'Mengabaikan perasaan', good: false }
    ]
  }
];

export default function Chapter4() {
  const router = useRouter();
  const { saveProgress } = usePubertyQuestStore();
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [dialogState, setDialogState] = useState({ show: true, type: 'intro', message: TTS_SCRIPTS.chapter4.intro });
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  const handleChoice = (good) => {
    if (good) {
      setScore(prev => prev + 50);
      const audio = new Audio('/audio/correctAnswer.mp3');
      audio.play();
    } else {
      const audio = new Audio('/audio/wrongAnswer.mp3');
      audio.play();
    }
    
    if (current < SCENARIOS.length - 1) {
      setTimeout(() => setCurrent(prev => prev + 1), 1000);
    } else {
      finishChapter();
    }
  };

  const finishChapter = async () => {
    await saveProgress(4, score, true);
    setShowCompleteDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-yellow-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-pink-400 rounded-3xl p-6 shadow-lg mb-6 border-2 border-pink-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Chapter 4: Pubertas & Emosi</h1>
              <p className="text-pink-100">Kelola emosimu dengan bijak</p>
            </div>
            <button
              onClick={() => router.push('/mini-game/puberty-quest')}
              className="px-4 py-2 bg-white hover:bg-pink-100 rounded-full text-pink-600 font-bold transition-all"
            >
              ← Kembali
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-pink-200">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-bold text-pink-600 bg-pink-100 px-4 py-2 rounded-full">Skenario {current + 1}/{SCENARIOS.length}</span>
              <div className="bg-pink-400 px-6 py-2 rounded-full font-bold text-white shadow-md">
                Score: {score}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-pink-700 mb-6">{SCENARIOS[current].situation}</h2>
          </div>

          <div className="space-y-4">
            {SCENARIOS[current].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleChoice(opt.good)}
                className="w-full p-5 bg-gray-50 hover:bg-pink-200 rounded-2xl border-2 border-pink-300 text-left font-semibold text-gray-800 transition-all shadow-md"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>

        <ChapterDialog
          type="intro"
          message={TTS_SCRIPTS.chapter4.intro}
          show={dialogState.show}
          onClose={() => {
            setDialogState((prev) => ({ ...prev, show: false }));
            setShowGameDialog(true);
          }}
        />

        <ChapterDialog
          type="game"
          message={TTS_SCRIPTS.chapter4.game}
          show={showGameDialog}
          onClose={() => setShowGameDialog(false)}
        />

        <ChapterDialog
          type="complete"
          message={TTS_SCRIPTS.chapter4.complete}
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
