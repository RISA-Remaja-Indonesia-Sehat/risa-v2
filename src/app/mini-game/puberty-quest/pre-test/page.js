'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';
import BackButton from '@/app/components/games/BackButton';

const PRETEST_QUESTIONS = [
  {
    id: 1,
    question: 'Nadia memperhatikan bahwa akhir-akhir ini ia lebih mudah marah dan tersinggung padahal tidak ada masalah besar. Menurutmu apa yang kemungkinan sedang terjadi?',
    options: ['Nadia sedang flu', 'Hormon dalam tubuh Nadia sedang berubah karena pubertas', 'Nadia terlalu banyak olahraga', 'Nadia harus berhenti berteman dengan orang lain'],
    correct: 1
  },
  {
    id: 2,
    question: 'Alya menemukan bercak cokelat muda di celananya untuk pertama kalinya. Apa yang kemungkinan terjadi?',
    options: ['Alya sakit perut karena makanan pedas', 'Itu tanda menstruasi pertama mulai datang', 'Itu tanda tubuh kekurangan vitamin', 'Itu tanda luka di kulit'],
    correct: 1
  },
  {
    id: 3,
    question: 'Seorang remaja perempuan merasakan keputihan yang bening tanpa bau kuat. Apa yang sebaiknya ia lakukan?',
    options: ['Panik dan langsung minum obat antibiotik', 'Membersihkan area kewanitaan secara berlebihan dengan sabun wangi', 'Tetap menjaga kebersihan dan memahami bahwa itu normal', 'Mengabaikannya dan tidak membersihkan sama sekali'],
    correct: 2
  },
  {
    id: 4,
    question: 'Mira merasa siklus menstruasinya kadang 30 hari, kadang 35 hari. Apa yang bisa dia simpulkan?',
    options: ['Siklus menstruasinya tidak normal dan harus operasi', 'Ini wajar karena tubuhnya masih beradaptasi dalam masa pubertas', 'Mira harus berhenti makan makanan manis', 'Mira harus selalu menstruasi di tanggal yang sama'],
    correct: 1
  },
  {
    id: 5,
    question: 'Saat menstruasi, Rahma lupa mengganti pembalut selama lebih dari 6 jam. Apa yang seharusnya dilakukan Rahma?',
    options: ['Mengganti pembalut secara rutin tiap 3–6 jam', 'Tidak perlu mengganti pembalut kecuali saat sudah penuh', 'Menggunakan dua pembalut sekaligus agar tidak perlu diganti', 'Membersihkan dengan alkohol agar lebih wangi'],
    correct: 0
  }
];

export default function PretestPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (optionIndex) => {
    const newAnswers = { ...answers, [currentQuestion]: optionIndex };
    setAnswers(newAnswers);

    if (currentQuestion < PRETEST_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore(newAnswers);
      setShowResult(true);
    }
  };

  const calculateScore = (finalAnswers) => {
    let correct = 0;
    PRETEST_QUESTIONS.forEach((q, idx) => {
      if (finalAnswers[idx] === q.correct) correct++;
    });
    setScore(Math.round((correct / PRETEST_QUESTIONS.length) * 100));
  };

  const handleStartQuest = () => {
    localStorage.setItem('puberty-quest-pretest-score', score);
    router.push('/mini-game/puberty-quest');
  };

  const question = PRETEST_QUESTIONS[currentQuestion];

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-100 p-4">
        <div className="max-w-2xl mx-auto">
          <BackButton />
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-pink-200 mt-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-rose-700 mb-4">Hasil Pre-Test</h1>
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg">
                <span className="text-5xl font-bold">{score}</span>
              </div>
              <p className="text-xl text-gray-700 mb-4">Skor Awalmu</p>
              <p className="text-gray-600 mb-8">Sekarang mulai petualangan Puberty Quest dan lihat peningkatanmu!</p>
            </div>

            <button
              onClick={handleStartQuest}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-3 rounded-lg hover:from-pink-600 hover:to-rose-600 transition"
            >
              Mulai Puberty Quest →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-100 p-4">
      <div className="max-w-2xl mx-auto">
        <BackButton />
        <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-pink-200 mt-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-rose-700 mb-2">Pre-Test</h1>
            <p className="text-gray-600">Tes pengetahuan awalmu tentang pubertas</p>
            <div className="mt-4 bg-pink-100 rounded-lg p-3">
              <p className="text-sm text-rose-700">Soal {currentQuestion + 1} dari {PRETEST_QUESTIONS.length}</p>
              <div className="w-full bg-pink-200 rounded-full h-2 mt-2">
                <div className="bg-rose-500 h-2 rounded-full transition-all" style={{ width: `${((currentQuestion + 1) / PRETEST_QUESTIONS.length) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-6">{question.question}</h2>
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-rose-500 hover:bg-pink-50 transition font-medium text-gray-700"
                >
                  {String.fromCharCode(65 + idx)}. {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
