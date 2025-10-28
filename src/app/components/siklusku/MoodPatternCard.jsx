'use client';

import { useMemo } from 'react';
import useSiklusStore from '../../store/useSiklusStore';
import { analyzeMoodPatternsByPhase, CYCLE_PHASES, PHASE_NAMES } from '@/lib/siklus/moodPatterns';

const PHASE_ORDER = [CYCLE_PHASES.MENSTRUATION, CYCLE_PHASES.FOLLICULAR, CYCLE_PHASES.OVULATION, CYCLE_PHASES.LUTEAL];

const MOOD_LABELS = {
  senang: { label: 'Senang', emoji: '😊' },
  sedih: { label: 'Sedih', emoji: '😢' },
  kesal: { label: 'Kesal', emoji: '😠' },
  cemas: { label: 'Cemas', emoji: '😰' },
  normal: { label: 'Biasa aja', emoji: '😐' },
};

export default function MoodPatternCard() {
  const dailyNotes = useSiklusStore((s) => s.dailyNotes);
  const cycles = useSiklusStore((s) => s.cycles);
  const insights = useSiklusStore((s) => s.insights);

  const normalizedLogs = useMemo(() => {
    if (!Array.isArray(dailyNotes)) {
      return [];
    }

    return dailyNotes
      .map((note) => ({
        ...note,
        mood: typeof note?.mood === 'string' ? note.mood.toLowerCase() : null,
      }))
      .filter((note) => note.mood && note.date);
  }, [dailyNotes]);

  const cycleSummary = useMemo(() => {
    const latestCycle = Array.isArray(cycles) && cycles.length ? cycles[0] : null;
    const lastPeriodStart = latestCycle?.start ?? null;

    return {
      lastPeriodStart,
      averageCycleLength: insights?.averageCycleLength ?? latestCycle?.cycleLength ?? 28,
      averagePeriodLength: insights?.averagePeriodLength ?? latestCycle?.periodLength ?? 5,
    };
  }, [cycles, insights]);

  const patterns = useMemo(() => analyzeMoodPatternsByPhase(normalizedLogs, cycleSummary), [normalizedLogs, cycleSummary]);

  if (!patterns?.hasData) {
    return (
      <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Pola Suasana Hati</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Catat suasana hatimu secara rutin untuk melihat pola berdasarkan fase siklus.</p>
      </div>
    );
  }

  const renderPhaseSummary = (phase) => {
    const summary = patterns.summary?.[phase];
    const totalEntries = summary?.total || 0;

    const topKey = (summary?.topMood || '').toLowerCase();
    const topMood = MOOD_LABELS[topKey];

    const secondaryMoods = Array.isArray(summary?.moodCounts) ? summary.moodCounts.slice(1, 3) : [];

    return (
      <div key={phase} className="rounded-2xl border border-slate-100 bg-white/60 p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{PHASE_NAMES[phase]}</p>
          <span className="text-xs text-slate-400 dark:text-slate-500">{totalEntries} catatan</span>
        </div>

        {topMood ? (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">
              {topMood.emoji}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{topMood.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {summary.topCount}x / {summary.topPercentage}%
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Belum ada mood dominan pada fase ini.</p>
        )}

        {secondaryMoods.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {secondaryMoods.map((item) => {
              const key = (item.mood || '').toLowerCase();
              const moodMeta = MOOD_LABELS[key];
              const label = moodMeta?.label || item.mood || '—';

              return (
                <span key={item.mood} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
                  <span aria-hidden="true">{moodMeta?.emoji}</span>
                  <span>{label}</span>
                  <span className="text-slate-400 dark:text-slate-500">{item.count}x</span>
                </span>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Pola Suasana Hati</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Mood yang paling sering kamu rasakan pada setiap fase siklus.</p>

      <div className="mt-4 grid gap-3">{PHASE_ORDER.map(renderPhaseSummary)}</div>
    </div>
  );
}
