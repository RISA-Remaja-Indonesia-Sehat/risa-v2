'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import useSiklusStore from '../../store/useSiklusStore';

const MoodPieChart = dynamic(() => import('./charts/MoodPieChart'), {
  ssr: false,
  loading: () => (
    <div className="flex h-48 w-full items-center justify-center rounded-2xl border border-dashed border-pink-200 bg-white/80 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">Memuat grafik mood...</div>
  ),
});

const MOOD_LABELS = {
  senang: { label: 'Senang', color: '#facc15' },
  sedih: { label: 'Sedih', color: '#60a5fa' },
  kesal: { label: 'Kesal', color: '#f87171' },
  cemas: { label: 'Cemas', color: '#a78bfa' },
  normal: { label: 'Biasa aja', color: '#94a3b8' },
};

const DAYS_WINDOW = 30;

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

const isWithinWindow = (isoKey) => {
  if (!isoKey) return false;
  const today = toJakartaYMD();
  const windowStart = toJakartaYMD(new Date(new Date().getTime() - (DAYS_WINDOW - 1) * 24 * 60 * 60 * 1000));
  return isoKey >= windowStart && isoKey <= today;
};

export default function MoodDistributionCard() {
  const insights = useSiklusStore((s) => s.insights);
  const dailyNotes = useSiklusStore((s) => s.dailyNotes);

  const fallbackCounts = useMemo(() => {
    if (!Array.isArray(dailyNotes) || !dailyNotes.length) return null;

    const counts = {};
    dailyNotes.forEach((note) => {
      const mood = typeof note?.mood === 'string' ? note.mood.toLowerCase() : null;
      if (!mood || !MOOD_LABELS[mood]) return;

      const dateKey = noteDateKey(note.date);
      if (!isWithinWindow(dateKey)) return;

      counts[mood] = (counts[mood] || 0) + 1;
    });

    return counts;
  }, [dailyNotes]);

  const { legendEntries, chartData, hasData } = useMemo(() => {
    const rawDistribution = insights?.moodDistributionLast30d || {};
    const counts = rawDistribution && Object.keys(rawDistribution).length ? rawDistribution : fallbackCounts || {};

    const legendEntries = Object.entries(MOOD_LABELS)
      .map(([mood, meta]) => ({
        mood,
        label: meta.label,
        color: meta.color,
        count: Number(counts[mood]) || 0,
      }))
      .filter((entry) => entry.count > 0)
      .sort((a, b) => b.count - a.count);

    const chartData = legendEntries.reduce((acc, entry) => {
      acc[entry.mood] = entry.count;
      return acc;
    }, {});

    return { legendEntries, chartData, hasData: legendEntries.length > 0 };
  }, [insights?.moodDistributionLast30d, fallbackCounts]);

  const colorMap = useMemo(() => {
    const colors = {};
    Object.entries(MOOD_LABELS).forEach(([mood, meta]) => {
      colors[mood] = meta.color;
    });
    return colors;
  }, []);

  return (
    <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Mood bulananmu</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Ini sebaran perasaanmu dalam {DAYS_WINDOW} hari terakhir</p>
        </div>

        {hasData ? (
          <div className="flex flex-col items-center">
            <MoodPieChart data={chartData} size={220} colors={colorMap} />

            <div className="mt-4 grid w-full grid-cols-2 gap-2">
              {legendEntries.map((entry) => (
                <div key={entry.mood} className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm font-medium">{entry.label}</span>
                  <span className="ml-auto text-xs text-slate-500">{entry.count}x</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-slate-500 dark:text-slate-400">Belum ada catatan mood dalam {DAYS_WINDOW} hari terakhir</p>
          </div>
        )}
      </div>
    </div>
  );
}
