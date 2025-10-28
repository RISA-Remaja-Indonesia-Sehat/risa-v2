'use client';

import { useMemo } from 'react';
import useSiklusStore from '../../store/useSiklusStore';

const MONTHLY_TARGET = 30;

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

const addDays = (isoKey, delta) => {
  if (!isoKey) return null;
  const [y, m, d] = isoKey.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  dt.setDate(dt.getDate() + delta);
  return toJakartaYMD(dt);
};

export default function ConsistencyCard() {
  const dailyNotes = useSiklusStore((s) => s.dailyNotes);

  const {
    totalTrackedDays,
    trackedLast30,
    longestStreak,
    hasTodayLog,
    consistencyPercent,
  } = useMemo(() => {
    if (!Array.isArray(dailyNotes) || !dailyNotes.length) {
      return {
        totalTrackedDays: 0,
        trackedLast30: 0,
        longestStreak: 0,
        hasTodayLog: false,
        consistencyPercent: 0,
      };
    }

    const todayKey = toJakartaYMD();
    const windowStart = toJakartaYMD(new Date(Date.now() - (MONTHLY_TARGET - 1) * 86400000));

    const uniqueDates = new Set(
      dailyNotes
        .map((note) => noteDateKey(note?.date))
        .filter((key) => typeof key === 'string')
    );

    const totalTrackedDays = uniqueDates.size;
    const hasTodayLog = uniqueDates.has(todayKey);

    let trackedLast30 = 0;
    for (const key of uniqueDates) {
      if (key >= windowStart && key <= todayKey) {
        trackedLast30 += 1;
      }
    }

    const orderedDates = Array.from(uniqueDates).sort((a, b) => a.localeCompare(b));
    let longestStreak = 0;
    let currentStreak = 0;
    let previous = null;

    for (const key of orderedDates) {
      if (previous && key === addDays(previous, 1)) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
      longestStreak = Math.max(longestStreak, currentStreak);
      previous = key;
    }

    const consistencyPercent = Math.min(
      100,
      Math.round((trackedLast30 / MONTHLY_TARGET) * 100)
    );

    return {
      totalTrackedDays,
      trackedLast30,
      longestStreak,
      hasTodayLog,
      consistencyPercent,
    };
  }, [dailyNotes]);

  return (
    <article className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Konsistensi pencatatan
        </h3>
        {hasTodayLog ? (
          <span
            className="inline-flex items-center rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700 dark:bg-pink-900/30 dark:text-pink-200"
            aria-label="Sudah membuat jurnal hari ini"
          >
            Hari ini✔️
          </span>
        ) : null}
      </div>

      <div className="mt-2 flex items-end justify-between">
        <p className="text-3xl font-semibold text-slate-800 dark:text-slate-100">
          {consistencyPercent}%
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Target: catat setiap hari selama {MONTHLY_TARGET} hari
        </p>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <progress
          max={100}
          value={consistencyPercent}
          className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"
        />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-slate-500 dark:text-slate-400">Log 30 hari</dt>
          <dd className="font-semibold text-slate-800 dark:text-slate-100">{trackedLast30} hari</dd>
        </div>
        <div>
          <dt className="text-slate-500 dark:text-slate-400">Total hari tercatat</dt>
          <dd className="font-semibold text-slate-800 dark:text-slate-100">
            {totalTrackedDays} hari
          </dd>
        </div>
        <div>
          <dt className="text-slate-500 dark:text-slate-400">Streak terpanjang</dt>
          <dd className="font-semibold text-slate-800 dark:text-slate-100">
            {longestStreak} hari
          </dd>
        </div>
      </dl>
    </article>
  );
}
