"use client";
import { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import useSiklusStore from "../store/useSiklusStore";
import HeroSection from "../components/siklusku/HeroSection";
import CalendarComponent from "../components/siklusku/CalendarComponent";
import MoodStatistics from "../components/siklusku/MoodStatistics";
import DailyNoteDisplay from "../components/siklusku/DailyNoteDisplay";
import DailyNoteModal from "../components/siklusku/DailyNoteModal";
import FloatingAddButton from "../components/siklusku/FloatingAddButton";
import ArticleRecommendations from "../components/siklusku/ArticleRecommendations";
import CustomButton from "../components/ui/CustomButton";
import Link from "next/link";
import SiklusFTUE from "../components/first-time/SiklusFTUE";

const SikluskuPage = () => {
  const { isLoggedIn, token, user } = useAuthStore();
  const {
    dailyNotes,
    setCurrentPhase,
    setPhaseInsight,
    setRecommendedArticles,
    lastAnalysisDate,
    setLastAnalysisDate,
    addDailyNote,
    setCurrentUserId,
  } = useSiklusStore();

  // Set current user dan fetch data saat login
  useEffect(() => {
    if (isLoggedIn && token && user) {
      setCurrentUserId(user.id || user.userId);
      fetchDailyNotes();
    }
  }, [isLoggedIn, token, user]);

  // Analisis fase siklus setiap ada perubahan data
  useEffect(() => {
    if (Object.keys(dailyNotes).length > 0) {
      // Analisis setiap kali ada perubahan data, tidak hanya sekali per hari
      analyzePhase();
    }
  }, [dailyNotes]);

  const fetchDailyNotes = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/daily-notes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const notes = await response.json();

        // Convert array to object dengan date sebagai key
        const notesObj = {};
        notes.forEach((note) => {
          const date = new Date(note.date).toISOString().split("T")[0];
          notesObj[date] = note;
        });

        // Update store dengan semua notes sekaligus
        Object.entries(notesObj).forEach(([date, note]) => {
          addDailyNote(date, note);
        });
      }
    } catch (error) {
      console.error("Error fetching daily notes:", error);
    }
  };

  const analyzePhase = async () => {
    try {
      const response = await fetch("/api/ai-siklus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "phase_analysis",
          data: { dailyNotes },
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Update store dengan hasil analisis
        setCurrentPhase(result.phase);
        setPhaseInsight(result.insight);
        setRecommendedArticles(result.recommendedArticles);
        console.log("Phase analysis result:", result);
      }
    } catch (error) {
      console.error("Error analyzing phase:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-50">
      <SiklusFTUE />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <HeroSection />

        {isLoggedIn ? (
          <>
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Kalender */}
              <div className="lg:col-span-1">
                <CalendarComponent />
              </div>

              {/* Daily Note Display */}
              <div className="lg:col-span-1">
                <DailyNoteDisplay />
              </div>

              {/* Statistik Mood */}
              <div className="lg:col-span-1">
                <MoodStatistics />
              </div>
            </div>

            {/* Rekomendasi Artikel */}
            <ArticleRecommendations />

            {/* Modal & Floating Button */}
            <DailyNoteModal />
            <FloatingAddButton />
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Login untuk Mulai Mencatat Siklusmu
            </h2>
            <p className="text-gray-600 mb-8">
              Dapatkan insight personal dan rekomendasi artikel yang sesuai
              dengan fase siklus menstruasimu
            </p>
            <Link href="/login">
              <CustomButton className="px-8 py-3" title="Login Sekarang" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SikluskuPage;
