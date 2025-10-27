'use client';

import { useMemo } from 'react';
import useSiklusStore from '../../store/useSiklusStore';
import { ACHIEVEMENTS, calculateAchievements } from '@/lib/siklus/achievements';
import { calculateStreak, calculateConsistency } from '@/lib/siklus/streak';

const DEFAULT_MESSAGE =
  'Catat suasana hatimu secara rutin untuk membuka pencapaian dan hadiah spesial.';

export default function AchievementsCard() {
  const dailyNotes = useSiklusStore((s) => s.dailyNotes);
  const cycles = useSiklusStore((s) => s.cycles);
  const insights = useSiklusStore((s) => s.insights);
  const onboardingCompleted = useSiklusStore((s) => s.onboardingCompleted);

  const moodLogs = useMemo(() => {
    if (!Array.isArray(dailyNotes)) return [];
    return dailyNotes.map((note) => ({
      date: note?.date,
      mood: note?.mood,
    }));
  }, [dailyNotes]);

  const streak = useMemo(() => calculateStreak(moodLogs), [moodLogs]);
  const consistency = useMemo(() => calculateConsistency(moodLogs), [moodLogs]);

  const earnedAchievements = useMemo(() => {
    const payload = {
      streak,
      consistency,
      onboardingCompleted,
      onboardingData: {
        lastPeriodStart: cycles?.[0]?.start ?? null,
        cycleLength: insights?.averageCycleLength ?? null,
        periodLength: insights?.averagePeriodLength ?? null,
      },
      moodLogs,
    };

    return calculateAchievements(payload);
  }, [streak, consistency, onboardingCompleted, cycles, insights, moodLogs]);

  if (!earnedAchievements.length) {
    return (
      <div className="rounded-3xl border border-pink-100 bg-white p-6 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Pencapaian</h3>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{DEFAULT_MESSAGE}</p>
      </div>
    );
  }

  const badgeIcon = '🌟';

  return (
    <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Pencapaian</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Kamu berhasil mengumpulkan beberapa pencapaian. Pertahankan ya!
      </p>

      <div className="mt-4 space-y-3">
        {earnedAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className="flex items-center gap-3 rounded-2xl border border-amber-100/70 bg-amber-50/80 px-3 py-3 text-sm shadow-sm dark:border-amber-500/20 dark:bg-amber-500/10"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-200 text-lg text-amber-700 shadow"
              aria-hidden="true"
            >
              {badgeIcon}
            </span>
            <div className="space-y-1">
              <p className="font-semibold text-slate-800 dark:text-slate-100">{achievement.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-300">{achievement.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
