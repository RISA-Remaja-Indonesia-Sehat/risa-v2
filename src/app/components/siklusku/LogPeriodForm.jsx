'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { gsap } from 'gsap';
import useSiklusStore from '../../store/useSiklusStore';
import CalendarRange from './CalendarRange';
import { formatDisplayDate } from '@/lib/siklus/cycleMath';

const MS_PER_DAY = 86400000;

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

const mapSubmitError = (err) => {
  const message = (err?.message || '').toLowerCase();

  if (message.includes('overlap')) {
    return 'Rentang tanggal bertabrakan dengan catatan yang sudah ada.';
  }
  if (message.includes('unauthorized')) {
    return 'Silakan login terlebih dahulu.';
  }
  if (message.includes('invalid') || message.includes('range') || message.includes('format')) {
    return 'Tanggal tidak valid. Coba cek lagi ya.';
  }
  return 'Gagal menyimpan catatan. Coba lagi ya.';
};

const computeAutoEnd = (startISO, insights, cycles) => {
  if (!startISO) return null;
  const start = new Date(startISO);
  if (Number.isNaN(start.getTime())) return null;

  const rawLength = insights?.averagePeriodLength ?? cycles?.[0]?.periodLength ?? 5;
  const safeLength = Math.max(1, Number.parseInt(rawLength, 10) || 5);
  const end = new Date(start.getTime() + (safeLength - 1) * MS_PER_DAY);
  return toJakartaYMD(end);
};

export default function LogPeriodForm({ open, onClose }) {
  const router = useRouter();
  const addCycle = useSiklusStore((s) => s.addCycle);
  const loadAll = useSiklusStore((s) => s.loadAll);
  const cycles = useSiklusStore((s) => s.cycles);
  const insights = useSiklusStore((s) => s.insights);

  const cardRef = useRef(null);
  const [range, setRange] = useState({ start: null, end: null });
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const hasOverlap = (startISO, endISO) => {
    if (!startISO || !endISO || !Array.isArray(cycles)) return false;
    const start = new Date(startISO);
    const end = new Date(endISO);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
    for (const cycle of cycles) {
      const cycleStart = cycle?.start ? new Date(cycle.start) : null;
      const cycleEnd = cycle?.end ? new Date(cycle.end) : cycleStart;
      if (!cycleStart || Number.isNaN(cycleStart.getTime())) continue;
      const effectiveEnd = cycleEnd && !Number.isNaN(cycleEnd.getTime()) ? cycleEnd : cycleStart;
      if (start <= effectiveEnd && end >= cycleStart) return true;
    }
    return false;
  };

  useEffect(() => {
    if (!open) return undefined;

    setErrors({});
    setFeedback('');
    setSubmitting(false);

    const latest = cycles.length ? cycles[0] : null;
    setRange({
      start: toJakartaYMD(latest?.start),
      end: toJakartaYMD(latest?.end),
    });

    const media = globalThis?.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (media?.matches || !cardRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.28, ease: 'power2.out' });
    }, cardRef);

    return () => ctx.revert();
  }, [open, cycles]);

  const validate = (candidateRange = range) => {
    const nextErrors = {};
    const today = toJakartaYMD();

    if (!candidateRange.start) {
      nextErrors.start = 'Pilih tanggal mulai ya.';
    } else if (today && candidateRange.start > today) {
      nextErrors.start = 'Tanggal mulai tidak boleh di masa depan.';
    }

    if (!candidateRange.end) {
      nextErrors.end = 'Pilih tanggal selesai ya.';
    } else if (today && candidateRange.end > today) {
      nextErrors.end = 'Tanggal selesai tidak boleh di masa depan.';
    }

    if (candidateRange.start && candidateRange.end && candidateRange.end < candidateRange.start) {
      nextErrors.end = 'Tanggal selesai tidak boleh sebelum tanggal mulai.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    let nextRange = range;

    if (range.start && !range.end) {
      const autoEnd = computeAutoEnd(range.start, insights, cycles);
      if (autoEnd) {
        nextRange = { ...range, end: autoEnd };
        setRange(nextRange);
      }
    }

    if (!validate(nextRange)) return;

    if (hasOverlap(nextRange.start, nextRange.end)) {
      const msg = 'Rentang tanggal bertabrakan dengan catatan yang sudah ada.';
      setErrors((prev) => ({ ...prev, start: msg, end: msg }));
      setFeedback('');
      return;
    }

    setSubmitting(true);
    setFeedback('');

    try {
      await addCycle({
        start_date: nextRange.start,
        end_date: nextRange.end,
      });

      setFeedback('Tersimpan! Prediksi dan ringkasan sedang diperbarui.');
      setTimeout(() => {
        onClose?.();
        loadAll(); // refresh data after the dialog closes so the page doesn’t flash loading
      }, 400);
    } catch (err) {
      if (err?.status === 401 || err?.status === 403) {
        router.push('/login');
        return;
      }
      const msg = mapSubmitError(err);
      if (msg && msg.toLowerCase().includes('bertabrakan')) {
        setErrors((prev) => ({ ...prev, start: msg, end: msg }));
        setFeedback('');
      } else {
        setFeedback(msg);
      }
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const rangeError = errors.start || errors.end;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="logperiod-title" className="fixed inset-0 z-[80] m-0 flex items-center justify-center bg-transparent p-4">
      <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" onClick={() => !submitting && onClose?.()} aria-hidden="true" />

      <div ref={cardRef} className="relative w-full max-w-md rounded-3xl border border-pink-100 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:max-w-lg sm:p-6">
        <header className="mb-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-pink-500">Catatan Haid Baru</p>
          <h3 id="logperiod-title" className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            Tambahkan Tanggal Haid
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Pilih rentang tanggal haid yang ingin kamu catat.</p>
        </header>

        <div className="space-y-4">
          <div>
            <CalendarRange value={range} onChange={setRange} max={toJakartaYMD() || undefined} ariaInvalid={Boolean(rangeError)} />
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>Mulai: {range.start ? formatDisplayDate(range.start) : 'Belum dipilih'}</span>
              <span>{'\u2022'}</span>
              <span>Selesai: {range.end ? formatDisplayDate(range.end) : 'Belum dipilih'}</span>
            </div>
            <div className="space-y-1 text-xs text-rose-500" aria-live="polite">
              {rangeError ? <p role="alert">{rangeError}</p> : null}
            </div>
          </div>

          {feedback ? <div className="rounded-xl border border-pink-100 bg-pink-50 px-3 py-2 text-xs text-pink-700 dark:border-pink-900/50 dark:bg-pink-900/20 dark:text-pink-200">{feedback}</div> : null}
        </div>

        <footer className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => !submitting && onClose?.()}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            disabled={submitting}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-full bg-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-600 hover:shadow-lg focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={submitting}
          >
            {submitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </footer>
      </div>
    </div>
  );
}

LogPeriodForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
