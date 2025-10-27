'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Droplets, MessageCircle, Calendar } from 'lucide-react';
import useSiklusStore from '../../store/useSiklusStore';
import { cycleDay, calculatePhase } from '@/lib/siklus/cycleMath';

const FLOW_LEVELS = [
  { id: 1, label: 'Ringan', color: 'bg-pink-100 text-pink-600', emoji: '💧' },
  { id: 2, label: 'Sedang', color: 'bg-pink-200 text-pink-700', emoji: '💧💧' },
  { id: 3, label: 'Banyak', color: 'bg-pink-300 text-pink-800', emoji: '💧💧💧' },
  { id: 4, label: 'Sangat Banyak', color: 'bg-red-200 text-red-700', emoji: '💧💧💧💧' },
];

const SYMPTOMS = [
  { id: 'cramps', label: 'Kram perut', emoji: '😣' },
  { id: 'headache', label: 'Sakit kepala', emoji: '🤕' },
  { id: 'bloating', label: 'Perut kembung', emoji: '😮‍💨' },
  { id: 'backache', label: 'Sakit punggung', emoji: '😰' },
  { id: 'fatigue', label: 'Lelah', emoji: '😴' },
  { id: 'acne', label: 'Jerawatan', emoji: '😔' },
];

const MOODS = [
  { id: 'senang', label: 'Senang', emoji: '😊', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'sedih', label: 'Sedih', emoji: '😢', color: 'bg-blue-100 text-blue-700' },
  { id: 'kesal', label: 'Kesal', emoji: '😠', color: 'bg-red-100 text-red-700' },
  { id: 'cemas', label: 'Cemas', emoji: '😰', color: 'bg-purple-100 text-purple-700' },
  { id: 'normal', label: 'Biasa aja', emoji: '😐', color: 'bg-gray-100 text-gray-700' },
];

const DEFAULT_CYCLE_LENGTH = 28;
const DEFAULT_PERIOD_LENGTH = 5;

const toJakartaYMD = (date = new Date()) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

const noteDateKey = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return toJakartaYMD(date);
};

const normalizePositive = (value, fallback) => {
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 0) {
    return numeric;
  }
  return fallback;
};

export default function DailyTracker() {
  const router = useRouter();
  const dailyNotes = useSiklusStore((s) => s.dailyNotes);
  const cycles = useSiklusStore((s) => s.cycles);
  const insights = useSiklusStore((s) => s.insights);
  const upsertDailyNote = useSiklusStore((s) => s.upsertDailyNote);
  const loadingDailyNotes = useSiklusStore((s) => s.loadingDailyNotes);
  const isDateCoveredByAnyCycle = useSiklusStore((s) => s.isDateCoveredByAnyCycle);
  const isMenstruationDay = useSiklusStore((s) => s.isMenstruationDay);

  const todayKey = useMemo(() => toJakartaYMD(), []);
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [story, setStory] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const latestCycle = useMemo(() => (cycles.length ? cycles[0] : null), [cycles]);
  const lastPeriodStartKey = useMemo(() => noteDateKey(latestCycle?.start || latestCycle?.start_date), [latestCycle]);

  const fallbackCycleLength = normalizePositive(latestCycle?.cycleLength ?? latestCycle?.cycle_length, DEFAULT_CYCLE_LENGTH);
  const cycleLength = normalizePositive(insights?.averageCycleLength, fallbackCycleLength);

  const fallbackPeriodLength = normalizePositive(latestCycle?.periodLength ?? latestCycle?.period_length, DEFAULT_PERIOD_LENGTH);
  const periodLength = normalizePositive(insights?.averagePeriodLength, fallbackPeriodLength);

  const noteForSelectedDate = useMemo(() => {
    if (!selectedDate) return null;
    return dailyNotes.find((note) => noteDateKey(note.date) === selectedDate) || null;
  }, [dailyNotes, selectedDate]);

  useEffect(() => {
    if (!noteForSelectedDate) {
      setSelectedMood(null);
      setSelectedFlow(null);
      setSelectedSymptoms([]);
      setStory('');
      return;
    }

    setSelectedMood(noteForSelectedDate.mood || null);
    setSelectedFlow(typeof noteForSelectedDate.flowLevel === 'number' ? noteForSelectedDate.flowLevel : null);
    setSelectedSymptoms(Array.isArray(noteForSelectedDate.symptoms) ? [...noteForSelectedDate.symptoms] : []);
    setStory(noteForSelectedDate.story || '');
  }, [noteForSelectedDate]);

  const covered = useMemo(() => (selectedDate ? isDateCoveredByAnyCycle(selectedDate) : false), [selectedDate, isDateCoveredByAnyCycle]);
  const isMenstruation = useMemo(() => (selectedDate ? isMenstruationDay(selectedDate) : false), [selectedDate, isMenstruationDay]);

  useEffect(() => {
    if (!isMenstruation && selectedFlow !== null) {
      setSelectedFlow(null);
    }
  }, [isMenstruation, selectedFlow]);

  useEffect(() => {
    if (covered || selectedSymptoms.length === 0) return;
    setSelectedSymptoms([]);
  }, [covered, selectedSymptoms.length]);

  const toggleSymptom = useCallback((symptomId) => {
    setSelectedSymptoms((prev) => (prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId]));
  }, []);

  const handleStoryChange = useCallback((event) => {
    setStory(event.target.value.slice(0, 500));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedMood || !selectedDate) return;

    setFormError('');
    setIsSubmitting(true);
    try {
      await upsertDailyNote(selectedDate, {
        mood: selectedMood,
        menstrual_blood: isMenstruation ? selectedFlow : null,
        symptoms: covered ? selectedSymptoms : [],
        story: story.trim() || null,
      });
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        router.push('/login');
      } else {
        setFormError('Gagal menyimpan catatan. Coba lagi ya.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedMood, selectedDate, isMenstruation, selectedFlow, covered, selectedSymptoms, story, upsertDailyNote, router]);

  const isFormValid = useMemo(() => Boolean(selectedMood), [selectedMood]);
  const saving = isSubmitting || loadingDailyNotes;

  return (
    <div className="space-y-6 rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
      <div className="text-center">
        <h2 className="flex items-center justify-center gap-2 text-xl font-semibold text-slate-800">
          <Calendar className="h-5 w-5 text-pink-500" />
          Jurnal harianku
        </h2>
        <p className="mt-1 text-sm text-slate-600">Catat perasaan dan kondisimu hari ini</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Tanggal</label>
        <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} max={todayKey} className="w-full rounded-xl border border-pink-200 p-3 focus:border-transparent focus:ring-2 focus:ring-pink-500" />
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Heart className="h-4 w-4 text-pink-500" />
          Mood hari ini *
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              type="button"
              onClick={() => setSelectedMood(mood.id)}
              className={`rounded-xl border-2 p-3 text-center transition-all ${selectedMood === mood.id ? `${mood.color} border-current` : 'border-gray-200 hover:border-pink-300'}`}
            >
              <div className="mb-1 text-2xl">{mood.emoji}</div>
              <div className="text-xs font-medium">{mood.label}</div>
            </button>
          ))}
        </div>
      </div>

      {isMenstruation ? (
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Droplets className="h-4 w-4 text-pink-500" />
            Banyaknya haid (opsional)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {FLOW_LEVELS.map((flow) => (
              <button
                key={flow.id}
                type="button"
                onClick={() => setSelectedFlow(flow.id)}
                className={`rounded-xl border-2 p-3 text-center transition-all ${selectedFlow === flow.id ? `${flow.color} border-current` : 'border-gray-200 hover:border-pink-300'}`}
              >
                <div className="mb-1 text-lg">{flow.emoji}</div>
                <div className="text-xs font-medium">{flow.label}</div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {covered ? (
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Gejala yang dirasakan (opsional)</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SYMPTOMS.map((symptom) => (
              <button
                key={symptom.id}
                type="button"
                onClick={() => toggleSymptom(symptom.id)}
                className={`rounded-xl border-2 p-3 text-center transition-all ${selectedSymptoms.includes(symptom.id) ? 'border-pink-300 bg-pink-100 text-pink-700' : 'border-gray-200 hover:border-pink-300'}`}
              >
                <div className="mb-1 text-lg">{symptom.emoji}</div>
                <div className="text-xs font-medium">{symptom.label}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-pink-200 bg-pink-50/60 p-3 text-xs text-pink-600">Tambahkan tanggal haid terlebih dahulu untuk mencatat gejala secara lengkap ya.</div>
      )}

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <MessageCircle className="h-4 w-4 text-pink-500" />
          Cerita hari ini (opsional)
        </label>
        <textarea
          value={story}
          onChange={handleStoryChange}
          placeholder="Tulis cerita atau catatan khusus hari ini..."
          rows={3}
          maxLength={500}
          className="w-full resize-none rounded-xl border border-pink-200 p-3 focus:border-transparent focus:ring-2 focus:ring-pink-500"
        />
        <div className="text-right text-xs text-slate-500">{story.length}/500 karakter</div>
      </div>

      {formError ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{formError}</div> : null}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isFormValid || saving}
        className={`w-full rounded-xl py-3 font-semibold transition-all ${isFormValid && !saving ? 'bg-pink-500 text-white hover:bg-pink-600 hover:shadow-lg' : 'cursor-not-allowed bg-gray-300 text-gray-500'}`}
      >
        {saving ? 'Menyimpan...' : 'Simpan Jurnal Hari Ini'}
      </button>
    </div>
  );
}
