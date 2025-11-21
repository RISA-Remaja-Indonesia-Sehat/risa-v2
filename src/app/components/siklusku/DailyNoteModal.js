"use client";
import { useState, useEffect } from "react";
import { X, Save, Sparkles } from "lucide-react";
import useSiklusStore from "../../store/useSiklusStore";
import useAuthStore from "../../store/useAuthStore";

const DailyNoteModal = () => {
  const {
    showDailyNoteModal,
    setShowDailyNoteModal,
    selectedDate,
    getDailyNote,
    addDailyNote,
  } = useSiklusStore();
  const { token } = useAuthStore();

  const [formData, setFormData] = useState({
    isPeriod: false,
    flowLevel: "",
    gejala: [],
    mood: "",
    levelEnergy: "sedang",
    cerita: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [insight, setInsight] = useState("");

  const gejalOptions = [
    "Pusing",
    "Kram perut",
    "Lelah",
    "Mood swing",
    "Food craving",
    "Payudara sensitif",
    "Jerawat",
    "Lainnya",
  ];

  const moodOptions = [
    { value: "senang", label: "Senang", emoji: "😊" },
    { value: "sedih", label: "Sedih", emoji: "😢" },
    { value: "kesal", label: "Kesal", emoji: "😠" },
    { value: "biasa saja", label: "Biasa Saja", emoji: "😐" },
    { value: "cemas", label: "Cemas", emoji: "😰" },
    { value: "overthinking", label: "Overthinking", emoji: "🤔" },
  ];

  useEffect(() => {
    if (showDailyNoteModal && selectedDate) {
      const existingNote = getDailyNote(selectedDate);
      if (existingNote) {
        setFormData({
          isPeriod: existingNote.isPeriod,
          flowLevel: existingNote.flowLevel || "",
          gejala: JSON.parse(existingNote.gejala || "[]"),
          mood: existingNote.mood,
          levelEnergy: existingNote.levelEnergy,
          cerita: existingNote.cerita,
        });
      } else {
        setFormData({
          isPeriod: false,
          flowLevel: "",
          gejala: [],
          mood: "",
          levelEnergy: "sedang",
          cerita: "",
        });
      }
    }
  }, [showDailyNoteModal, selectedDate, getDailyNote]);

  const handleGejalChange = (gejala) => {
    setFormData((prev) => ({
      ...prev,
      gejala: prev.gejala.includes(gejala)
        ? prev.gejala.filter((g) => g !== gejala)
        : [...prev.gejala, gejala],
    }));
  };

  const generateInsight = async (noteData) => {
    try {
      const response = await fetch("/api/ai-siklus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "daily_insight",
          data: noteData,
          date: selectedDate,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return result.insight;
      }
    } catch (error) {
      console.error("Error generating insight:", error);
    }
    return "Terima kasih sudah mencatat hari ini! Terus jaga kesehatan dan mood-mu ya! 💕";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit ke backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/daily-notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date: selectedDate,
            isPeriod: formData.isPeriod,
            flowLevel: formData.isPeriod ? formData.flowLevel : null,
            gejala: JSON.stringify(formData.gejala),
            mood: formData.mood,
            levelEnergy: formData.levelEnergy,
            cerita: formData.cerita,
          }),
        }
      );

      if (response.ok) {
        // Generate insight
        const dailyInsight = await generateInsight(formData);
        setInsight(dailyInsight);

        // Simpan ke store
        addDailyNote(selectedDate, {
          ...formData,
          gejala: JSON.stringify(formData.gejala),
        });

        // Tunggu 3 detik untuk menampilkan insight, lalu tutup modal
        setTimeout(() => {
          setShowDailyNoteModal(false);
          setInsight("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting daily note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showDailyNoteModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {insight ? (
          // Insight Display
          <div className="p-4 sm:p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Insight Harian
            </h3>
            <div className="bg-gradient-to-r from-pink-50 to-yellow-50 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed">{insight}</p>
            </div>
            <div className="mt-6 text-sm text-gray-500">
              Tertutup otomatis...
            </div>
          </div>
        ) : (
          // Form
          <>
            <div className="flex items-center justify-between p-4 sm:p-6 border-b">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Catatan Harian -{" "}
                {new Date(selectedDate).toLocaleDateString("id-ID")}
              </h2>
              <button
                onClick={() => setShowDailyNoteModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 space-y-4 sm:space-y-6"
            >
              {/* Status Menstruasi */}
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Apakah kamu sedang menstruasi hari ini?
                </label>
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Tidak
                  </span>
                  <label className="relative inline-block w-12 h-6 sm:w-14 sm:h-8 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPeriod}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isPeriod: e.target.checked,
                          flowLevel: e.target.checked ? prev.flowLevel : "",
                        }))
                      }
                      className="opacity-0 w-0 h-0"
                    />
                    <span
                      className={`absolute inset-0 rounded-full transition-all duration-300 ${
                        formData.isPeriod ? "bg-pink-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 sm:top-1 sm:left-1 sm:w-6 sm:h-6 bg-white rounded-full transition-transform duration-300 ${
                          formData.isPeriod
                            ? "translate-x-5 sm:translate-x-6"
                            : "translate-x-0"
                        }`}
                      ></span>
                    </span>
                  </label>
                  <span className="text-xs sm:text-sm text-gray-600">Ya</span>
                </div>
              </div>
              {formData.isPeriod && (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Tingkat Perdarahan
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[
                      { value: "sedikit", label: "Sedikit", emoji: "💧" },
                      { value: "normal", label: "Normal", emoji: "🩸" },
                      { value: "banyak", label: "Banyak", emoji: "🔴" },
                    ].map((flow) => (
                      <label
                        key={flow.value}
                        className={`flex flex-col items-center p-2 sm:p-3 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.flowLevel === flow.value
                            ? "border-pink-500 bg-pink-50"
                            : "border-gray-200 hover:border-pink-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="flowLevel"
                          value={flow.value}
                          checked={formData.flowLevel === flow.value}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              flowLevel: e.target.value,
                            }))
                          }
                          className="sr-only"
                        />
                        <span className="text-xl sm:text-2xl mb-1">
                          {flow.emoji}
                        </span>
                        <span className="text-xs sm:text-sm font-medium">
                          {flow.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Gejala */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Gejala yang Dirasakan
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {gejalOptions.map((gejala) => (
                    <label
                      key={gejala}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.gejala.includes(gejala)}
                        onChange={() => handleGejalChange(gejala)}
                        className="w-4 h-4 text-pink-500 rounded"
                      />
                      <span className="text-sm">{gejala}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Mood Hari Ini
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {moodOptions.map((mood) => (
                    <label
                      key={mood.value}
                      className={`flex flex-col items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.mood === mood.value
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="mood"
                        value={mood.value}
                        checked={formData.mood === mood.value}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            mood: e.target.value,
                          }))
                        }
                        className="sr-only"
                      />
                      <span className="text-2xl mb-1">{mood.emoji}</span>
                      <span className="text-sm font-medium">{mood.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level Energi */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Level Energi: {formData.levelEnergy}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="1"
                  value={
                    formData.levelEnergy === "rendah"
                      ? 0
                      : formData.levelEnergy === "sedang"
                      ? 1
                      : 2
                  }
                  onChange={(e) => {
                    const levels = ["rendah", "sedang", "tinggi"];
                    setFormData((prev) => ({
                      ...prev,
                      levelEnergy: levels[e.target.value],
                    }));
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Rendah</span>
                  <span>Sedang</span>
                  <span>Tinggi</span>
                </div>
              </div>

              {/* Cerita Harian */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Cerita Harian
                </label>
                <textarea
                  value={formData.cerita}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, cerita: e.target.value }))
                  }
                  placeholder="Ceritakan bagaimana harimu... (opsional)"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  rows="4"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.mood}
                className="w-full bg-pink-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Simpan Catatan
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default DailyNoteModal;
