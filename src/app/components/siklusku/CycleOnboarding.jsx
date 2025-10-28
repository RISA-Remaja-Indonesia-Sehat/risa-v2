'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { gsap } from 'gsap';
import useSiklusStore from '../../store/useSiklusStore';
import CalendarRange from './CalendarRange';
import { formatDisplayDate } from '@/lib/siklus/cycleMath';

const toJakartaYMD = (date = new Date()) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

const calculateDurationDays = (start, end) => {
  if (!start || !end) return null;
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;
  const diff = e.getTime() - s.getTime();
  if (!Number.isFinite(diff) || diff < 0) return null;
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
};

const mapSubmitError = (err) => {
  const msg = (err?.message ?? '').toLowerCase();
  if (msg.includes('overlap')) {
    return 'Tanggal haid tumpang tindih dengan siklus lain. Cek kembali rentangnya.';
  }
  if (msg.includes('unauthorized')) {
    return 'Silakan login terlebih dahulu.';
  }
  if (msg.includes('invalid') || msg.includes('format') || msg.includes('range')) {
    return 'Tanggal tidak valid. Periksa kembali ya.';
  }
  return 'Gagal menyimpan data. Coba lagi ya.';
};

function UnifiedStep({ values, errors, onChange }) {
  const today = toJakartaYMD();

  const rangeValue = useMemo(
    () => ({
      start: values.lastPeriodStart || null,
      end: values.lastPeriodEnd || null,
    }),
    [values.lastPeriodStart, values.lastPeriodEnd]
  );

  const durationWarning = useMemo(() => {
    const d = calculateDurationDays(values.lastPeriodStart, values.lastPeriodEnd);
    if (!d || d <= 8) return null;
    return 'Durasi haidmu lebih dari 8 hari. Kalau ini baru terjadi, coba diskusikan dengan orang dewasa atau tenaga kesehatan yang kamu percaya.';
  }, [values.lastPeriodStart, values.lastPeriodEnd]);

  const handleRangeChange = (nextRange) => {
    onChange('lastPeriodStart', nextRange.start || null);
    onChange('lastPeriodEnd', nextRange.end || null);
  };

  return (
    <fieldset className="space-y-6">
      <div className="space-y-2">
        <CalendarRange
          value={rangeValue}
          onChange={handleRangeChange}
          max={today}
          ariaInvalid={Boolean(errors.lastPeriodStart) || Boolean(errors.lastPeriodEnd)}
          ariaDescribedBy={[errors.lastPeriodStart ? 'lastPeriodStart-error' : null, errors.lastPeriodEnd ? 'lastPeriodEnd-error' : null].filter(Boolean).join(' ') || undefined}
        />

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Mulai: {rangeValue.start ? formatDisplayDate(rangeValue.start) : 'Belum dipilih'}</span>
          <span>{'\u2022'}</span>
          <span>Selesai: {rangeValue.end ? formatDisplayDate(rangeValue.end) : 'Belum dipilih'}</span>
        </div>

        <div className="space-y-1 text-xs text-red-500" aria-live="polite">
          {errors.lastPeriodStart ? (
            <p id="lastPeriodStart-error" role="alert">
              {errors.lastPeriodStart}
            </p>
          ) : null}
          {errors.lastPeriodEnd ? (
            <p id="lastPeriodEnd-error" role="alert">
              {errors.lastPeriodEnd}
            </p>
          ) : null}
        </div>

        {durationWarning ? <p className="text-xs text-amber-600">{durationWarning}</p> : null}
      </div>
    </fieldset>
  );
}

UnifiedStep.propTypes = {
  values: PropTypes.shape({
    lastPeriodStart: PropTypes.string,
    lastPeriodEnd: PropTypes.string,
  }).isRequired,
  errors: PropTypes.shape({
    lastPeriodStart: PropTypes.string,
    lastPeriodEnd: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

const getStepErrors = (values) => {
  const nextErrors = {};
  const today = toJakartaYMD();

  if (!values.lastPeriodStart) {
    nextErrors.lastPeriodStart = 'Isi tanggal mulai ya';
  } else if (values.lastPeriodStart > today) {
    nextErrors.lastPeriodStart = 'Tanggal tidak boleh di masa depan';
  }

  if (!values.lastPeriodEnd) {
    nextErrors.lastPeriodEnd = 'Isi tanggal selesai ya';
  } else if (values.lastPeriodEnd > today) {
    nextErrors.lastPeriodEnd = 'Tanggal tidak boleh di masa depan';
  }

  if (values.lastPeriodStart && values.lastPeriodEnd && values.lastPeriodEnd < values.lastPeriodStart) {
    nextErrors.lastPeriodEnd = 'Tanggal selesai tidak boleh sebelum tanggal mulai';
  }

  return nextErrors;
};

export default function CycleOnboarding({ onComplete }) {
  const addCycle = useSiklusStore((s) => s.addCycle);
  const loadAll = useSiklusStore((s) => s.loadAll);
  const setOnboardingCompleted = useSiklusStore((s) => s.setOnboardingCompleted);

  const [values, setValues] = useState({ lastPeriodStart: null, lastPeriodEnd: null });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const cardRef = useRef(null);
  const stepHeadingRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = globalThis?.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media) return undefined;

    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!cardRef.current || reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' });
    }, cardRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    stepHeadingRef.current?.focus();
  }, []);

  const stepValidation = useMemo(() => getStepErrors(values), [values]);

  const validateNow = () => {
    const nextErrors = getStepErrors(values);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = async () => {
    setSubmitError('');
    if (!validateNow()) return;

    setSubmitting(true);
    try {
      await addCycle({
        start: values.lastPeriodStart,
        end: values.lastPeriodEnd,
      });
      setOnboardingCompleted?.(true);
      const storage = globalThis?.localStorage;
      storage?.setItem('risa:loveLetterEligible', 'true');
      await loadAll();
      onComplete?.();
    } catch (err) {
      setSubmitError(mapSubmitError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    const storage = globalThis?.localStorage;
    storage?.removeItem('risa:loveLetterEligible');
    onComplete?.();
  };

  const handleChange = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setValues((prev) => ({ ...prev, [field]: value || null }));
  };

  const liveErrorMessage = Object.values(errors).find(Boolean) || submitError || '';
  const errorMessageId = liveErrorMessage ? 'onboarding-error-message' : undefined;

  return (
    <div className="space-y-6" ref={cardRef}>
      {liveErrorMessage ? (
        <span id={errorMessageId} className="sr-only" aria-live="assertive">
          {liveErrorMessage}
        </span>
      ) : null}

      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-pink-500">Informasi Haid Terakhir</p>
        <h3 ref={stepHeadingRef} tabIndex={-1} className="text-2xl font-semibold text-slate-800">
          Tanggal Haid Terakhir
        </h3>
      </header>

      <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
        <UnifiedStep values={values} errors={errors} onChange={handleChange} />
        {submitError ? <p className="mt-3 text-sm text-rose-500">{submitError}</p> : null}
      </div>

      <div className="flex flex-col items-center justify-end gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          data-ripple="true"
          onClick={handleBack}
          className="rounded-full border border-pink-300 bg-white px-6 py-2 text-sm font-medium text-pink-600 hover:bg-pink-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400 transition"
          disabled={submitting}
        >
          Batal
        </button>

        <button
          type="button"
          data-ripple="true"
          className="relative rounded-full bg-pink-500 px-6 py-2 text-sm font-semibold text-white shadow-sm transition-transform duration-200 ease-out hover:shadow-lg motion-safe:hover:scale-[1.03] motion-reduce:transform-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 cursor-pointer disabled:opacity-40 overflow-hidden"
          onClick={handleNext}
          disabled={submitting || Object.keys(stepValidation).length > 0}
          aria-disabled={submitting || Object.keys(stepValidation).length > 0}
          aria-describedby={errorMessageId}
        >
          {submitting ? 'Menyimpan...' : 'Selesai'}
        </button>
      </div>
    </div>
  );
}

CycleOnboarding.propTypes = {
  onComplete: PropTypes.func,
};
