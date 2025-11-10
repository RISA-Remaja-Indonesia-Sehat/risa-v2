"use client";
import { Plus } from "lucide-react";
import useSiklusStore from "../../store/useSiklusStore";

const FloatingAddButton = () => {
  const { selectedDate, getDailyNote, setShowDailyNoteModal } =
    useSiklusStore();

  const today = new Date().toISOString().split("T")[0];
  const hasNoteToday = getDailyNote(today);
  const isToday = selectedDate === today;

  // Hanya tampilkan jika hari ini dan belum ada note
  if (!isToday || hasNoteToday) {
    return null;
  }

  return (
    <button
      onClick={() => setShowDailyNoteModal(true)}
      className="fixed bottom-6 right-6 w-14 h-14 bg-pink-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center z-40"
      title="Tambah catatan hari ini"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
};

export default FloatingAddButton;
