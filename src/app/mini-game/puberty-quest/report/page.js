'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Award, Target } from 'lucide-react';
import BackButton from '@/app/components/games/BackButton';

export default function ReportPage() {
  const router = useRouter();
  const [pretestScore, setPretestScore] = useState(0);
  const [posttestScore, setPosttestScore] = useState(0);
  const [improvement, setImprovement] = useState(0);

  useEffect(() => {
    const pretest = parseInt(localStorage.getItem('puberty-quest-pretest-score') || '0');
    const posttest = parseInt(localStorage.getItem('puberty-quest-posttest-score') || '0');
    
    setPretestScore(pretest);
    setPosttestScore(posttest);
    setImprovement(posttest - pretest);
  }, []);

  const getGrade = (score) => {
    if (score >= 90) return { grade: 'A', color: 'text-green-600' };
    if (score >= 80) return { grade: 'B', color: 'text-rose-600' };
    if (score >= 70) return { grade: 'C', color: 'text-yellow-600' };
    return { grade: 'D', color: 'text-red-600' };
  };

  const preGrade = getGrade(pretestScore);
  const postGrade = getGrade(posttestScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-100 p-4">
      <div className="max-w-3xl mx-auto">
        <BackButton />
        
        <div className="mt-8 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-pink-200 text-center">
            <h1 className="text-4xl font-bold text-rose-700 mb-2">Laporan Progres</h1>
            <p className="text-gray-600">Lihat peningkatan pengetahuanmu tentang pubertas</p>
          </div>

          {/* Score Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pre-Test */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-pink-200">
              <p className="text-gray-600 font-semibold mb-4 text-center">Skor Pre-Test</p>
              <p className={`text-5xl font-bold ${preGrade.color} text-center mb-2`}>{pretestScore}</p>
              <p className={`text-xl font-bold ${preGrade.color} text-center mb-4`}>Grade {preGrade.grade}</p>
              <p className="text-sm text-gray-600 text-center">Pengetahuan awalmu sebelum belajar</p>
            </div>

            {/* Post-Test */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-pink-200">
              <p className="text-gray-600 font-semibold mb-4 text-center">Skor Post-Test</p>
              <p className={`text-5xl font-bold ${postGrade.color} text-center mb-2`}>{posttestScore}</p>
              <p className={`text-xl font-bold ${postGrade.color} text-center mb-4`}>Grade {postGrade.grade}</p>
              <p className="text-sm text-gray-600 text-center">Pengetahuanmu setelah belajar</p>
            </div>
          </div>

          {/* Improvement */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg border-2 border-green-300">
            <div className="flex items-center gap-4 mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <h2 className="text-2xl font-bold text-green-700">Peningkatan Kamu</h2>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-green-600 mb-2">+{improvement}</p>
              <p className="text-gray-700">Poin peningkatan dari pre-test ke post-test</p>
            </div>
          </div>

          {/* Analysis */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-pink-200">
            <h2 className="text-2xl font-bold text-rose-700 mb-6 flex items-center gap-2">
              <Award className="w-6 h-6" /> Analisis Progres
            </h2>
            
            <div className="space-y-4">
              {improvement > 0 ? (
                <>
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <p className="font-semibold text-green-700 mb-1">✓ Peningkatan Signifikan</p>
                    <p className="text-gray-700">Kamu menunjukkan peningkatan pemahaman yang baik tentang materi pubertas. Terus pertahankan semangat belajarmu!</p>
                  </div>
                  
                  {improvement >= 20 && (
                    <div className="p-4 bg-pink-50 rounded-lg border-l-4 border-pink-500">
                      <p className="font-semibold text-pink-700 mb-1">🌟 Luar Biasa!</p>
                      <p className="text-gray-700">Peningkatan lebih dari 20 poin menunjukkan dedikasi dan kerja keras kamu dalam belajar. Sangat mengesankan!</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <p className="font-semibold text-yellow-700 mb-1">💡 Catatan</p>
                  <p className="text-gray-700">Skormu tetap sama atau sedikit menurun. Jangan khawatir, ini kesempatan untuk belajar lebih dalam lagi!</p>
                </div>
              )}

              <div className="p-4 bg-pink-50 rounded-lg border-l-4 border-pink-500">
                <p className="font-semibold text-pink-700 mb-1">📚 Rekomendasi</p>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Baca ulang materi yang masih kurang dipahami</li>
                  <li>• Diskusikan dengan orang tua atau guru jika ada yang membingungkan</li>
                  <li>• Jangan ragu untuk mengulang chapter yang sulit</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/mini-game/puberty-quest')}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-3 rounded-lg hover:from-pink-600 hover:to-rose-600 transition cursor-pointer"
            >
              Kembali ke Puberty Quest
            </button>
            <button
              onClick={() => router.push('/mini-game')}
              className="w-full bg-white bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent font-bold py-3 rounded-lg border-2 border-pink-500 transition cursor-pointer"
            >
              Kembali ke Mini-Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
