import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSiklusStore = create(
  persist(
    (set, get) => ({
      // User tracking
      currentUserId: null,

      // Data AI Analysis
      currentPhase: null,
      phaseInsight: null,
      recommendedArticles: [],
      lastAnalysisDate: null,

      // Daily Notes
      dailyNotes: {},
      selectedDate: new Date().toISOString().split("T")[0],

      // UI State
      isLoading: false,
      showDailyNoteModal: false,

      // Actions
      setCurrentUserId: (userId) => {
        const state = get();
        if (state.currentUserId !== userId) {
          // Clear data when user changes
          set({
            currentUserId: userId,
            currentPhase: null,
            phaseInsight: null,
            recommendedArticles: [],
            lastAnalysisDate: null,
            dailyNotes: {},
            selectedDate: new Date().toISOString().split("T")[0],
          });
        }
      },

      setCurrentPhase: (phase) => set({ currentPhase: phase }),
      setPhaseInsight: (insight) => set({ phaseInsight: insight }),
      setRecommendedArticles: (articles) =>
        set({ recommendedArticles: articles }),
      setLastAnalysisDate: (date) => set({ lastAnalysisDate: date }),

      addDailyNote: (date, note) =>
        set((state) => {
          const newDailyNotes = { ...state.dailyNotes };
          if (note === null) {
            delete newDailyNotes[date];
          } else {
            newDailyNotes[date] = note;
          }
          return { dailyNotes: newDailyNotes };
        }),

      removeDailyNote: (date) =>
        set((state) => {
          const newDailyNotes = { ...state.dailyNotes };
          delete newDailyNotes[date];
          return { dailyNotes: newDailyNotes };
        }),

      setSelectedDate: (date) => set({ selectedDate: date }),
      setLoading: (loading) => set({ isLoading: loading }),
      setShowDailyNoteModal: (show) => set({ showDailyNoteModal: show }),

      // Get daily note for specific date
      getDailyNote: (date) => {
        const state = get();
        return state.dailyNotes[date] || null;
      },

      // Clear all data
      clearData: () =>
        set({
          currentPhase: null,
          phaseInsight: null,
          recommendedArticles: [],
          lastAnalysisDate: null,
          dailyNotes: {},
        }),
    }),
    {
      name: (state) => `siklus-storage-${state.currentUserId || "anonymous"}`,
      partialize: (state) => ({
        currentUserId: state.currentUserId,
        currentPhase: state.currentPhase,
        phaseInsight: state.phaseInsight,
        recommendedArticles: state.recommendedArticles,
        lastAnalysisDate: state.lastAnalysisDate,
        dailyNotes: state.dailyNotes,
      }),
    }
  )
);

export default useSiklusStore;
