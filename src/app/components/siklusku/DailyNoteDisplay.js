"use client";
import { useState } from "react";
import { Edit, Trash2, Plus, Calendar } from "lucide-react";
import useSiklusStore from "../../store/useSiklusStore";
import useAuthStore from "../../store/useAuthStore";

const DailyNoteDisplay = () => {
  const { selectedDate, getDailyNote, setShowDailyNoteModal, addDailyNote } =
    useSiklusStore();
  const { token } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const note = getDailyNote(selectedDate);

  const handleEdit = () => {
    setShowDailyNoteModal(true);
  };

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus catatan ini?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/daily-notes/${selectedDate}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Remove from store
        addDailyNote(selectedDate, null);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      senang: "😊",
      sedih: "😢",
      kesal: "😠",
      "biasa saja": "😐",
      cemas: "😰",
      overthinking: "🤔",
    };
    return moodEmojis[mood] || "😐";
  };

  const getEnergyColor = (level) => {
    const colors = {
      rendah: "text-red-500 bg-red-50",
      sedang: "text-yellow-500 bg-yellow-50",
      tinggi: "text-green-500 bg-green-50",
    };
    return colors[level] || colors.sedang;
  };

  if (!note) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="mb-4 sm:mb-6">
          <h3 className="text-md sm:text-xl text-center font-bold text-gray-800">
            Catatan Harian
          </h3>
          <div className="text-sm text-center text-gray-500">
            {formatDate(selectedDate)}
          </div>
        </div>

        <div className="text-center py-4 md:py-8">
          <Calendar className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-xs md:text-base mb-4">
            Belum ada catatan untuk tanggal ini
          </p>
          <button
            onClick={() => setShowDailyNoteModal(true)}
            className="bg-pink-400 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-100 flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Tambah Catatan
          </button>
        </div>
      </div>
    );
  }

  const gejalaList = JSON.parse(note.gejala || "[]");

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-md sm:text-xl font-bold text-gray-800">
          Catatan Harian
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleEdit}
            className="p-2 text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
            title="Edit catatan"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Hapus catatan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Tanggal */}
        <div className="text-sm text-gray-500 mb-4">
          {formatDate(selectedDate)}
        </div>

        {/* Status Menstruasi */}
        <div className="flex items-center gap-1 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-sm md:rounded-xl">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div>
            <span className="text-sm md:text-base font-medium text-gray-700">
              {note.isPeriod ? "Sedang Menstruasi" : "Tidak Menstruasi"}
            </span>
            {note.isPeriod && note.flowLevel && (
              <span className="text-sm text-gray-500 ml-2">
                ({note.flowLevel})
              </span>
            )}
          </div>
        </div>

        {/* Mood */}
        <div className="flex items-center gap-1 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-sm md:rounded-xl">
          <span className="text-lg md:text-2xl">{getMoodEmoji(note.mood)}</span>
          <div className="text-sm md:text-base">
            <span className="font-medium text-gray-700">Mood: </span>
            <span className="capitalize">{note.mood}</span>
          </div>
        </div>

        {/* Level Energi */}
        <div className="flex items-center gap-1 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-sm md:rounded-xl">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${getEnergyColor(
              note.levelEnergy
            )}`}
          >
            {note.levelEnergy}
          </div>
          <span className="text-sm md:text-base text-gray-700">
            Level Energi
          </span>
        </div>

        {/* Gejala */}
        {gejalaList.length > 0 && (
          <div className="p-2 md:p-3 bg-gray-50 rounded-sm md:rounded-xl">
            <div className="text-sm md:text-base font-medium text-gray-700 mb-2">
              Gejala:
            </div>
            <div className="flex flex-wrap gap-2">
              {gejalaList.map((gejala, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full"
                >
                  {gejala}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Cerita */}
        {note.cerita && (
          <div className="p-2 md:p-3 bg-gray-50 rounded-sm md:rounded-xl">
            <div className="text-sm md:text-base font-medium text-gray-700 mb-2">
              Cerita Harian:
            </div>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              {note.cerita}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyNoteDisplay;
