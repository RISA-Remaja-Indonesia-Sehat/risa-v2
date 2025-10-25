'use client';

import { create } from 'zustand';
import * as api from '@/lib/siklus/api';
import { STORAGE_KEYS, DEFAULT_VALUES, getLocalValue, setLocalValue } from '@/lib/siklus/localStore';

const toJakartaYMD = (value = new Date()) => {
  const date = value instanceof Date ? value : value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

const addDays = (date, days) => new Date(new Date(date).getTime() + days * 86400000);

const DEFAULT_INSIGHTS = {
  averageCycleLength: null,
  averagePeriodLength: null,
  moodDistributionLast30d: {},
  cycleHistory: [],
  totalCycles: 0,
};

const useSiklusStore = create((set, get) => ({
  hydrated: false,

  cycles: [],
  dailyNotes: [],
  insights: DEFAULT_INSIGHTS,
  predictions: [],

  loadingCycles: false,
  loadingDailyNotes: false,
  loadingInsights: false,
  loadingPredictions: false,

  errorCycles: null,
  errorDailyNotes: null,
  errorInsights: null,
  errorPredictions: null,

  onboardingCompleted: DEFAULT_VALUES[STORAGE_KEYS.onboardingCompleted],
  loveLetterShown: DEFAULT_VALUES[STORAGE_KEYS.loveLetterShownOnce],
  gateChoice: getLocalValue(STORAGE_KEYS.gateChoice),

  hydrate: () => {
    if (get().hydrated) return;

    const onboardingCompleted = getLocalValue(STORAGE_KEYS.onboardingCompleted);
    const loveLetterShown = getLocalValue(STORAGE_KEYS.loveLetterShownOnce);
    const gateChoice = getLocalValue(STORAGE_KEYS.gateChoice);

    set({
      hydrated: true,
      onboardingCompleted,
      loveLetterShown,
      gateChoice,
    });
  },

  loadAll: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token) {
      set({
        errorCycles: 'Silakan login untuk melihat data Anda',
        errorDailyNotes: 'Silakan login untuk melihat data Anda',
        errorInsights: 'Silakan login untuk melihat data Anda',
      });
      return;
    }

    set({
      loadingCycles: true,
      loadingDailyNotes: true,
      loadingInsights: true,
      errorCycles: null,
      errorDailyNotes: null,
      errorInsights: null,
    });

    try {
      const [cyclesRes, insightsRes] = await Promise.all([
        api.getCycles({ limit: 50 }).catch((err) => {
          console.error('Failed to load cycles:', err);
          return { data: [] };
        }),
        api.getInsights().catch((err) => {
          console.error('Failed to load insights:', err);
          return { data: DEFAULT_INSIGHTS };
        }),
      ]);

      const toDate = toJakartaYMD();
      const fromDate = toJakartaYMD(addDays(new Date(), -30));

      const notesRes = await api.getDailyNotes({ from: fromDate, to: toDate, limit: 90 }).catch((err) => {
        console.error('Failed to load daily notes:', err);
        return { data: [] };
      });

      set({
        cycles: cyclesRes.data || [],
        insights: insightsRes.data || DEFAULT_INSIGHTS,
        dailyNotes: notesRes.data || [],
        loadingCycles: false,
        loadingDailyNotes: false,
        loadingInsights: false,
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      set({
        loadingCycles: false,
        loadingDailyNotes: false,
        loadingInsights: false,
        errorCycles: 'Gagal memuat data',
        errorDailyNotes: 'Gagal memuat data',
        errorInsights: 'Gagal memuat data',
      });
    }
  },

  addCycle: async (payload) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      throw new Error('Silakan login terlebih dahulu');
    }

    set({ loadingCycles: true, errorCycles: null });

    try {
      const response = await api.createCycle(payload);
      const newCycle = response.data?.cycle || response.data;
      const updatedInsights = response.data?.insights;

      set((state) => ({
        cycles: [newCycle, ...state.cycles].sort((a, b) => new Date(b.start_date || b.start) - new Date(a.start_date || a.start)),
        insights: updatedInsights || state.insights,
        loadingCycles: false,
        onboardingCompleted: true,
      }));

      setLocalValue(STORAGE_KEYS.onboardingCompleted, true);

      return newCycle;
    } catch (error) {
      set({
        loadingCycles: false,
        errorCycles: error.message || 'Gagal menambahkan siklus',
      });
      throw error;
    }
  },

  updateCycle: async (id, patch) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      throw new Error('Silakan login terlebih dahulu');
    }

    set({ loadingCycles: true, errorCycles: null });

    try {
      const response = await api.updateCycle(id, patch);
      const updatedCycle = response.data?.cycle || response.data;
      const updatedInsights = response.data?.insights;

      set((state) => ({
        cycles: state.cycles.map((cycle) => (cycle.id === id ? updatedCycle : cycle)).sort((a, b) => new Date(b.start_date || b.start) - new Date(a.start_date || a.start)),
        insights: updatedInsights || state.insights,
        loadingCycles: false,
      }));

      return updatedCycle;
    } catch (error) {
      set({
        loadingCycles: false,
        errorCycles: error.message || 'Gagal memperbarui siklus',
      });
      throw error;
    }
  },

  deleteCycle: async (id) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      throw new Error('Silakan login terlebih dahulu');
    }

    set({ loadingCycles: true, errorCycles: null });

    try {
      const response = await api.deleteCycle(id);
      const updatedInsights = response.data?.insights;

      set((state) => ({
        cycles: state.cycles.filter((cycle) => cycle.id !== id),
        insights: updatedInsights || state.insights,
        loadingCycles: false,
      }));

      return true;
    } catch (error) {
      set({
        loadingCycles: false,
        errorCycles: error.message || 'Gagal menghapus siklus',
      });
      throw error;
    }
  },

  loadPredictions: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    set({ loadingPredictions: true, errorPredictions: null });

    try {
      const response = await api.getPredictions({ count: 3 });
      set({
        predictions: response.data?.nextStarts || [],
        loadingPredictions: false,
      });
    } catch (error) {
      set({
        loadingPredictions: false,
        errorPredictions: error.message || 'Gagal memuat prediksi',
      });
    }
  },

  upsertDailyNote: async (date, payload) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      throw new Error('Silakan login terlebih dahulu');
    }

    set({ loadingDailyNotes: true, errorDailyNotes: null });

    try {
      const response = await api.upsertDailyNote(date, payload);
      const savedNote = response.data?.note || response.data;
      const updatedInsights = response.data?.insights;

      set((state) => {
        const key = toJakartaYMD(date);
        const existingIndex = state.dailyNotes.findIndex((note) => toJakartaYMD(note.date) === key);
        let updatedNotes;

        if (existingIndex >= 0) {
          updatedNotes = [...state.dailyNotes];
          updatedNotes[existingIndex] = savedNote;
        } else {
          updatedNotes = [...state.dailyNotes, savedNote].sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        return {
          dailyNotes: updatedNotes,
          insights: updatedInsights || state.insights,
          loadingDailyNotes: false,
        };
      });

      return savedNote;
    } catch (error) {
      set({
        loadingDailyNotes: false,
        errorDailyNotes: error.message || 'Gagal menyimpan catatan harian',
      });
      throw error;
    }
  },

  deleteDailyNote: async (date) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      throw new Error('Silakan login terlebih dahulu');
    }

    set({ loadingDailyNotes: true, errorDailyNotes: null });

    try {
      const response = await api.deleteDailyNote(date);
      const updatedInsights = response.data?.insights;

      set((state) => ({
        dailyNotes: state.dailyNotes.filter((note) => toJakartaYMD(note.date) !== toJakartaYMD(date)),
        insights: updatedInsights || state.insights,
        loadingDailyNotes: false,
      }));

      return true;
    } catch (error) {
      set({
        loadingDailyNotes: false,
        errorDailyNotes: error.message || 'Gagal menghapus catatan harian',
      });
      throw error;
    }
  },

  recomputeInsights: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    set({ loadingInsights: true, errorInsights: null });

    try {
      const response = await api.recomputeInsights();
      set({
        insights: response.data || DEFAULT_INSIGHTS,
        loadingInsights: false,
      });
    } catch (error) {
      set({
        loadingInsights: false,
        errorInsights: error.message || 'Gagal menghitung ulang insight',
      });
    }
  },

  isDateCoveredByAnyCycle: (date) => {
    const cycles = get().cycles || [];
    if (!cycles.length) return false;
    const target = toJakartaYMD(date);
    if (!target) return false;

    for (const c of cycles) {
      const start = c.start_date || c.start;
      if (!start) continue;
      const startKey = toJakartaYMD(start);
      if (!startKey) continue;

      const endDate = c.end_date || c.end || (c.period_length ? addDays(start, (c.period_length || 1) - 1) : start);
      const endKey = toJakartaYMD(endDate);

      if (startKey && endKey && target >= startKey && target <= endKey) return true;
    }
    return false;
  },

  isMenstruationDay: (date) => {
    const cycles = get().cycles || [];
    if (!cycles.length) return false;
    const target = toJakartaYMD(date);
    if (!target) return false;

    for (const c of cycles) {
      const start = c.start_date || c.start;
      const period = c.period_length || c.periodLength || null;
      if (!start || !period) continue;
      const startKey = toJakartaYMD(start);
      const endKey = toJakartaYMD(addDays(start, Math.max(1, Number.parseInt(period, 10) || 1) - 1));
      if (startKey && endKey && target >= startKey && target <= endKey) return true;
    }
    return false;
  },

  getDailyNoteByDate: (date) => {
    const key = toJakartaYMD(date);
    if (!key) return null;
    const notes = get().dailyNotes || [];
    return notes.find((n) => toJakartaYMD(n.date) === key) || null;
  },

  setOnboardingCompleted: (completed) => {
    const normalized = Boolean(completed);
    setLocalValue(STORAGE_KEYS.onboardingCompleted, normalized);
    set({ onboardingCompleted: normalized });
  },

  markLoveLetterShown: () => {
    setLocalValue(STORAGE_KEYS.loveLetterShownOnce, true);
    set({ loveLetterShown: true });
  },

  resetLoveLetter: () => {
    setLocalValue(STORAGE_KEYS.loveLetterShownOnce, false);
    set({ loveLetterShown: false });
  },

  setGateChoice: (choice) => {
    setLocalValue(STORAGE_KEYS.gateChoice, choice);
    set({ gateChoice: choice });
  },

  clearAllData: () => {
    set({
      cycles: [],
      dailyNotes: [],
      insights: DEFAULT_INSIGHTS,
      predictions: [],
      onboardingCompleted: false,
      loveLetterShown: false,
      gateChoice: null,
    });

    setLocalValue(STORAGE_KEYS.onboardingCompleted, false);
    setLocalValue(STORAGE_KEYS.loveLetterShownOnce, false);
    setLocalValue(STORAGE_KEYS.gateChoice, null);
  },
}));

export default useSiklusStore;
