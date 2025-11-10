"use client";
import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format, isAfter, startOfDay } from "date-fns";
import { id } from "date-fns/locale";
import useSiklusStore from "../../store/useSiklusStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-day-picker/dist/style.css";

const CalendarComponent = () => {
  const { dailyNotes, selectedDate, setSelectedDate, setShowDailyNoteModal } =
    useSiklusStore();

  const [month, setMonth] = useState(new Date());
  const today = startOfDay(new Date());

  // Konversi dailyNotes ke format yang bisa digunakan DayPicker
  const noteDates = Object.entries(dailyNotes)
    .filter(([_, note]) => note !== null)
    .map(([date, _]) => new Date(date));
  const periodDates = Object.entries(dailyNotes)
    .filter(([_, note]) => note && note.isPeriod)
    .map(([date, _]) => new Date(date));

  const handleDayClick = (date) => {
    // Cek apakah tanggal yang dipilih adalah hari ini atau sebelumnya
    if (isAfter(date, today)) {
      return; // Tidak bisa pilih tanggal masa depan
    }

    const dateStr = format(date, "yyyy-MM-dd");
    setSelectedDate(dateStr);

    // Jika belum ada note untuk tanggal ini, buka modal
    if (!dailyNotes[dateStr]) {
      setShowDailyNoteModal(true);
    }
  };

  const modifiers = {
    hasNote: noteDates,
    period: periodDates,
    future: (date) => isAfter(date, today),
    selected: selectedDate ? [new Date(selectedDate)] : [],
  };

  const modifiersStyles = {
    hasNote: {
      backgroundColor: "#fef3c7",
      borderRadius: "50%",
    },
    period: {
      backgroundColor: "#fecaca",
      borderRadius: "50%",
    },
    future: {
      color: "#d1d5db",
      cursor: "not-allowed",
    },
    selected: {
      backgroundColor: "#ec4899",
      color: "white",
      borderRadius: "50%",
    },
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl text-center font-bold text-gray-800 mb-3">
          Kalender Siklusku
        </h3>
        <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm w-fit mx-auto">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-200 border-2 border-red-400 rounded-full"></div>
            <span className="text-gray-600">Menstruasi</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-200 border-2 border-yellow-500 rounded-full"></div>
            <span className="text-gray-600">Ada Catatan</span>
          </div>
        </div>
      </div>

      <div className="calendar-container w-fit mx-auto">
        <style jsx global>{`
          .rdp {
            --rdp-cell-size: 40px;
            --rdp-accent-color: #ec4899;
            --rdp-background-color: #fdf2f8;
            margin: 0;
          }

          @media (max-width: 640px) {
            .rdp {
              --rdp-cell-size: 32px;
            }
            .rdp-day {
              font-size: 12px;
            }
          }

          .rdp-months {
            display: flex;
            justify-content: center;
          }

          .rdp-month {
            margin: 0;
          }

          .rdp-table {
            margin: 0 auto;
          }

          .rdp-head_cell {
            font-weight: 600;
            color: #6b7280;
            font-size: 12px;
          }

          @media (min-width: 640px) {
            .rdp-head_cell {
              font-size: 14px;
            }
          }

          .rdp-cell {
            padding: 1px;
          }

          @media (min-width: 640px) {
            .rdp-cell {
              padding: 2px;
            }
          }

          .rdp-button {
            border-radius: 50%;
            border: none;
            width: 32px;
            height: 32px;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s;
          }

          @media (min-width: 640px) {
            .rdp-button {
              width: 40px;
              height: 40px;
              font-size: 14px;
            }
          }

          .rdp-button:hover:not([disabled]) {
            background-color: #fce7f3;
            transform: scale(1.1);
          }

          .rdp-button[disabled] {
            opacity: 0.4;
          }

          .rdp-nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.5rem;
          }

          @media (min-width: 640px) {
            .rdp-nav {
              margin-bottom: 1rem;
            }
          }

          .rdp-nav_button {
            background: #f3f4f6;
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
          }

          @media (min-width: 640px) {
            .rdp-nav_button {
              width: 36px;
              height: 36px;
            }
          }

          .rdp-nav_button:hover {
            background: #e5e7eb;
            transform: scale(1.1);
          }

          .rdp-caption_label {
            font-size: 16px;
            font-weight: 700;
            color: #1f2937;
          }

          @media (min-width: 640px) {
            .rdp-caption_label {
              font-size: 18px;
            }
          }
        `}</style>

        <DayPicker
          mode="single"
          selected={selectedDate ? new Date(selectedDate) : undefined}
          onDayClick={handleDayClick}
          month={month}
          onMonthChange={setMonth}
          locale={id}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          disabled={(date) => isAfter(date, today)}
          components={{
            IconLeft: () => <ChevronLeft className="w-4 h-4" />,
            IconRight: () => <ChevronRight className="w-4 h-4" />,
          }}
        />
      </div>

      <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-500">
        Klik tanggal untuk menambah atau melihat catatan harian
      </div>
    </div>
  );
};

export default CalendarComponent;
