'use client';
import { useState, useEffect } from 'react';
import { Heart, Apple, Zap, AlertCircle, Loader } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useSiklusStore from '../../store/useSiklusStore';

export default function DailyInsightDisplay() {
  const { token } = useAuthStore();
  const { selectedDate, getDailyNote } = useSiklusStore();
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);

  const note = getDailyNote(selectedDate);

  useEffect(() => {
    if (note && token) {
      fetchDailyInsight();
    }
  }, [note, selectedDate, token]);

  const fetchDailyInsight = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-siklus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'daily_insight',
          data: { ...note, dailyNotes: {} },
          date: selectedDate,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Daily insight result:', result);
        setInsight(result);
      }
    } catch (error) {
      console.error('Error fetching daily insight:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!note) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">💭 Insight Harianmu</h3>
        <p className="text-gray-500 text-center py-8">
          Tambah catatan harian untuk mendapatkan insight personal
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">💭 Insight Harianmu</h3>
        <div className="flex items-center justify-center py-8">
          <Loader className="w-6 h-6 text-pink-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">💭 Insight Harianmu</h3>
        <p className="text-gray-500 text-center py-8">
          Gagal memuat insight. Silakan coba lagi.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Insight Card */}
      <div className="bg-gradient-to-br from-pink-50 via-pink-50 to-white rounded-2xl p-6 border-2 border-pink-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-pink-700 mb-3 text-lg">Insight Harianmu</h3>
            <p className="text-gray-800 leading-relaxed text-base">{insight.insight}</p>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      {insight?.activities && Array.isArray(insight.activities) && insight.activities.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border-2 border-pink-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-pink-500" />
            <h3 className="font-bold text-pink-700 text-lg">Kegiatan yang Cocok</h3>
          </div>
          <div className="space-y-3">
            {insight.activities.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-50 to-white rounded-xl border border-pink-100 hover:border-pink-300 transition-colors"
              >
                <div className="w-3 h-3 bg-pink-500 rounded-full flex-shrink-0"></div>
                <p className="text-gray-800 font-medium">{activity}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Foods Section */}
      {insight?.foods && Array.isArray(insight.foods) && insight.foods.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border-2 border-pink-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Apple className="w-6 h-6 text-pink-500" />
            <h3 className="font-bold text-pink-700 text-lg">Makanan yang Cocok</h3>
          </div>
          <div className="space-y-3">
            {insight.foods.map((food, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-50 to-white rounded-xl border border-pink-100 hover:border-pink-300 transition-colors"
              >
                <div className="w-3 h-3 bg-pink-500 rounded-full flex-shrink-0"></div>
                <p className="text-gray-800 font-medium">{food}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Symptom Tips Section */}
      {insight?.symptomTips && (
        <div className="bg-white rounded-2xl p-6 border-2 border-pink-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3 mb-4">
            <Heart className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
            <h3 className="font-bold text-pink-700 text-lg">Tips Menghadapi Gejala</h3>
          </div>
          <p className="text-gray-800 leading-relaxed text-base">{insight.symptomTips}</p>
        </div>
      )}

      {/* Consultation Alert */}
      {insight?.needsConsultation && (
        <div className="bg-gradient-to-br from-pink-100 via-pink-50 to-white rounded-2xl p-6 border-2 border-pink-400 shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <AlertCircle className="w-8 h-8 text-pink-600 flex-shrink-0 mt-1" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-pink-700 mb-2 text-lg">⚠️ Perlu Konsultasi Medis</h3>
              <p className="text-gray-800 mb-3 font-medium">{insight.consultationReason}</p>
              <p className="text-gray-700 leading-relaxed text-sm">
                Kami merekomendasikan untuk berkonsultasi dengan dokter spesialis kandungan atau mengunjungi rumah sakit terdekat untuk memastikan kesehatan reproduksimu. Jangan khawatir, ini adalah langkah preventif yang penting untuk kesejahteraan Anda.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
