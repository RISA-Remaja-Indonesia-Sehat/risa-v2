'use client';
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Plus, Zap, ChevronRight } from 'lucide-react';
import Confetti from 'react-confetti';
import useVaccineSavingsStore from '../../store/useVaccineSavingsStore';

export default function VaccineSavingsDashboard({ onNext }) {
  const { savingsData, addDeposit } = useVaccineSavingsStore();
  const [depositAmount, setDepositAmount] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const progress = (savingsData.total_saved / savingsData.vaccine_price) * 100;
  const remaining = savingsData.vaccine_price - savingsData.total_saved;

  useEffect(() => {
    if (progress >= 100) {
      setIsCompleted(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [progress]);

  const handleDeposit = () => {
    const amount = parseInt(depositAmount);
    if (amount > 0) {
      addDeposit(amount);
      setDepositAmount('');
    }
  };

  const chartData = [
    { name: 'Sudah Ditabung', value: savingsData.total_saved },
    { name: 'Sisa Target', value: Math.max(0, remaining) },
  ];

  const COLORS = ['#F7A8C3', '#FFE5EC'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 p-6">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Tabungan Vaksin</h1>
          <p className="text-gray-600 mb-8">Langkah 5: Mulai Tabung Sekarang!</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart Section */}
            <div className="flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">Progress Tabungan</p>
                <p className="text-4xl font-bold text-pink-600">{Math.round(progress)}%</p>
              </div>
            </div>

            {/* Info & Input Section */}
            <div className="space-y-6">
              {/* Target Info */}
              <div className="bg-gradient-to-br from-pink-50 to-yellow-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Target Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      Rp {savingsData.vaccine_price.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sudah Ditabung</p>
                    <p className="text-2xl font-bold text-pink-600">
                      Rp {savingsData.total_saved.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sisa Target</p>
                    <p className="text-2xl font-bold text-gray-900">
                      Rp {Math.max(0, remaining).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Deposit Input */}
              {!isCompleted && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-800">
                    💰 Tambah Tabungan
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-3 text-gray-600 font-semibold">Rp</span>
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500"
                        placeholder="Masukkan nominal"
                        min="1000"
                        step="1000"
                      />
                    </div>
                    <button
                      onClick={handleDeposit}
                      disabled={!depositAmount}
                      className="px-6 py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold rounded-lg hover:from-pink-500 hover:to-pink-600 disabled:bg-gray-300 transition-all flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      TABUNG
                    </button>
                  </div>
                </div>
              )}

              {/* Completion Message */}
              {isCompleted && (
                <div className="bg-green-50 border-2 border-green-300 p-6 rounded-lg">
                  <p className="text-green-800 font-bold text-lg">
                    🎉 Selamat! Target Tabunganmu Tercapai!
                  </p>
                  <p className="text-green-700 text-sm mt-2">
                    Kamu sudah siap untuk melanjutkan ke langkah penjadwalan vaksin.
                  </p>
                </div>
              )}

              {/* Next Button */}
              {isCompleted && (
                <button
                  onClick={onNext}
                  className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold py-3 rounded-lg hover:from-pink-500 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
                >
                  Lanjut ke Penjadwalan Vaksin
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Recent Deposits */}
          {savingsData.deposits && savingsData.deposits.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="font-bold text-gray-900 mb-4">Riwayat Tabungan</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {savingsData.deposits.map((deposit, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm text-gray-600">
                        {new Date(deposit.date).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <span className="font-semibold text-pink-600">
                      +Rp {deposit.amount.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
