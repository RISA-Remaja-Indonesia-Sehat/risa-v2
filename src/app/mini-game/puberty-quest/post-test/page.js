'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import BackButton from '@/app/components/games/BackButton';

const POSTTEST_QUESTIONS = [
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

export default function PosttestPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [pretestScore, setPretestScore] = useState(0);

  useEffect(() => {
    const pretest = localStorage.getItem('puberty-quest-pretest-score');
    if (pretest) setPretestScore(parseInt(pretest));
  }, []);

  const handleAnswer = (optionIndex) => {
    const newAnswers = { ...answers, [currentQuestion]: optionIndex };
    setAnswers(newAnswers);

    if (currentQuestion < POSTTEST_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore(newAnswers);
      setShowResult(true);
    }
  };

  const calculateScore = (finalAnswers) => {
    let correct = 0;
    POSTTEST_QUESTIONS.forEach((q, idx) => {
      if (finalAnswers[idx] === q.correct) correct++;
    });
    setScore(Math.round((correct / POSTTEST_QUESTIONS.length) * 100));
  };

  const handleViewReport = () => {
    localStorage.setItem('puberty-quest-posttest-score', score);
    router.push('/mini-game/puberty-quest/report');
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
  };

  const question = POSTTEST_QUESTIONS[currentQuestion];
  const passed = score >= 80;

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-100 p-4">
        <div className="max-w-2xl mx-auto">
          <BackButton />
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-pink-200 mt-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-rose-700 mb-4">Hasil Post-Test</h1>
              <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-white mb-6 shadow-lg ${passed ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-orange-400 to-red-500'}`}>
                <span className="text-5xl font-bold">{score}</span>
              </div>
              
              {passed ? (
                <>
                  <p className="text-2xl font-bold text-green-600 mb-2">🎉 Selamat! Kamu Lulus!</p>
                  <p className="text-gray-600 mb-8">Peningkatan dari pre-test: <span className="font-bold text-green-600">+{score - pretestScore}</span></p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-orange-600 mb-2">⚠️ Belum Lulus</p>
                  <p className="text-gray-600 mb-8">Nilai minimal untuk lulus adalah 80. Coba lagi!</p>
                </>
              )}
            </div>

            <div className="space-y-4 mb-8">
              {POSTTEST_QUESTIONS.map((q, idx) => (
                <div key={q.id} className={`p-4 rounded-lg border-2 ${answers[idx] === q.correct ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                  <div className="flex items-start gap-3">
                    {answers[idx] === q.correct ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-1">Soal {idx + 1}</p>
                      <p className="text-sm text-gray-600">{q.options[answers[idx]]}</p>
                      {answers[idx] !== q.correct && (
                        <p className="text-sm text-green-700 mt-2">Jawaban benar: {q.options[q.correct]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {passed ? (
                <button
                  onClick={handleViewReport}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition"
                >
                  Lihat Laporan Progres →
                </button>
              ) : (
                <>
                  <button
                    onClick={handleRetry}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition"
                  >
                    Coba Lagi
                  </button>
                  <button
                    onClick={() => router.push('/mini-game/puberty-quest')}
                    className="w-full bg-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-400 transition"
                  >
                    Kembali ke Menu
                  </button>
                </>
              )}
            </div>
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
            <h1 className="text-3xl font-bold text-rose-700 mb-2">Post-Test</h1>
            <p className="text-gray-600">Tes akhir untuk mengukur pemahamanmu</p>
            <div className="mt-4 bg-pink-100 rounded-lg p-3">
              <p className="text-sm text-rose-700">Soal {currentQuestion + 1} dari {POSTTEST_QUESTIONS.length}</p>
              <div className="w-full bg-pink-200 rounded-full h-2 mt-2">
                <div className="bg-rose-500 h-2 rounded-full transition-all" style={{ width: `${((currentQuestion + 1) / POSTTEST_QUESTIONS.length) * 100}%` }}></div>
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
