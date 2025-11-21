"use client";
import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import useSiklusStore from "../../store/useSiklusStore";
import { Smile, Frown, Meh, Heart, Brain, Zap } from "lucide-react";

const MOOD_CONFIG = {
  senang: { color: "#fbbf24", icon: Smile, label: "Senang" },
  sedih: { color: "#60a5fa", icon: Frown, label: "Sedih" },
  kesal: { color: "#f87171", icon: Zap, label: "Kesal" },
  "biasa saja": { color: "#a3a3a3", icon: Meh, label: "Biasa Saja" },
  cemas: { color: "#c084fc", icon: Brain, label: "Cemas" },
  overthinking: { color: "#fb7185", icon: Heart, label: "Overthinking" },
};

const MOOD_INSIGHTS = {
  senang: "Bulan ini kamu sering merasa bahagia! Pertahankan hal-hal positif yang membuatmu senang.",
  sedih: "Sepertinya bulan ini cukup berat untukmu. Ingat, perasaan ini normal dan akan berlalu.",
  kesal: "Mood kamu sering naik turun bulan ini. Coba teknik pernapasan saat merasa kesal.",
  "biasa saja": "Mood kamu cenderung stabil bulan ini. Itu bagus untuk keseimbangan emosi!",
  cemas: "Kamu sering merasa cemas bulan ini. Cobalah journaling atau berbicara dengan orang terdekat.",
  overthinking: "Pikiran kamu sering berputar-putar. Coba teknik mindfulness untuk menenangkan pikiran.",
};

const MoodStatistics = () => {
  const { dailyNotes } = useSiklusStore();

  const moodData = useMemo(() => {
    const moodCount = {};
    const notes = Object.values(dailyNotes);

    // Hitung mood dari bulan ini
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthNotes = Object.entries(dailyNotes).filter(([date, note]) => {
      if (!note) return false;
      const noteDate = new Date(date);
      return (
        noteDate.getMonth() === currentMonth &&
        noteDate.getFullYear() === currentYear
      );
    });

    thisMonthNotes.forEach(([_, note]) => {
      if (note && note.mood) {
        moodCount[note.mood] = (moodCount[note.mood] || 0) + 1;
      }
    });

    return Object.entries(moodCount)
      .map(([mood, count]) => ({
        name: MOOD_CONFIG[mood]?.label || mood,
        value: count,
        color: MOOD_CONFIG[mood]?.color || "#9ca3af",
        percentage: Math.round((count / thisMonthNotes.length) * 100),
      }))
      .sort((a, b) => b.value - a.value);
  }, [dailyNotes]);

  const topMoods = moodData.slice(0, 3);
  const totalEntries = Object.values(dailyNotes).filter(
    (note) => note !== null
  ).length;

  const generateInsight = useMemo(() => {
    if (moodData.length === 0)
      return "Mulai catat mood harianmu untuk mendapatkan insight!";

    const topMood = moodData[0];
    return (
      MOOD_INSIGHTS[topMood.name.toLowerCase()] ||
      "Terus catat mood harianmu untuk insight yang lebih akurat!"
    );
  }, [moodData]);

  if (totalEntries === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-md sm:text-xl text-center font-bold text-gray-800 mb-4">
          Statistik Mood Bulanan
        </h3>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-500">Belum ada data mood untuk ditampilkan</p>
          <p className="text-sm text-gray-400 mt-2">
            Mulai catat mood harianmu!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
      <h3 className="text-md sm:text-xl text-center font-bold text-gray-800 mb-6">
        Statistik Mood Bulanan
      </h3>

      {moodData.length > 0 ? (
        <div className="space-y-6">
          {/* Donut Chart */}
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {moodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} hari`, name]}
                  labelStyle={{ color: "#374151" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top 3 Moods */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700">
              Mood Teratas Bulan Ini:
            </h4>
            {topMoods.map((mood, index) => {
              const IconComponent =
                Object.values(MOOD_CONFIG).find(
                  (config) => config.label === mood.name
                )?.icon || Meh;

              return (
                <div
                  key={mood.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-full"
                      style={{ backgroundColor: mood.color + "20" }}
                    >
                      <IconComponent
                        className="w-4 h-4"
                        style={{ color: mood.color }}
                      />
                    </div>
                    <span className="font-medium text-gray-700">
                      {mood.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">
                      {mood.percentage}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {mood.value} hari
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Insight */}
          <div className="bg-gradient-to-r from-pink-50 to-yellow-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500" />
              Insight Mood Bulanan
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {generateInsight}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">😊</div>
          <p className="text-gray-500">
            Catat mood harianmu untuk melihat statistik
          </p>
        </div>
      )}
    </div>
  );
};

export default MoodStatistics;
