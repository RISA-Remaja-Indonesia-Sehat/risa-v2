'use client';

import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Droplet, Moon, Sparkles, Sprout } from 'lucide-react';
import Image from 'next/image';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/siklusku/Tabs';
import OnboardingGate from '../components/siklusku/OnboardingGate';
import FirstPeriodGuide from '../components/siklusku/FirstPeriodGuide';
import CycleOnboarding from '../components/siklusku/CycleOnboarding';
import ConsistencyCard from '../components/siklusku/ConsistencyCard';
import MoodDistributionCard from '../components/siklusku/MoodDistributionCard';
import MoodPatternCard from '../components/siklusku/MoodPatternCard';
import AchievementsCard from '../components/siklusku/AchievementsCard';
import LoveLetterModal from '../components/siklusku/LoveLetterModal';
import LogPeriodForm from '../components/siklusku/LogPeriodForm';
import DailyTracker from '../components/siklusku/DailyTracker';
import DailyLogsViewer from '../components/siklusku/DailyLogsViewer';
import CustomButton from '../components/ui/CustomButton';

import useSiklusStore from '../store/useSiklusStore';

import { gsap } from 'gsap';
import { attachRipple } from '@/lib/siklus/microInteractions';
import { formatDisplayDate } from '@/lib/siklus/cycleMath';

const CycleTrendChart = dynamic(() => import('../components/siklusku/charts/CycleTrendChart'), {
  ssr: false,
  loading: () => <ChartSkeleton label="grafik tren siklus" />,
});

const ChartExportButton = dynamic(() => import('../components/siklusku/charts/ChartExportButton'), {
  ssr: false,
  loading: () => <ExportButtonFallback />,
});

const MS_PER_DAY = 86400000;

const toJakartaYMD = (value = new Date()) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(value instanceof Date ? value : new Date(value));

const normalizePredictionDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return toJakartaYMD(date);
};

function ChartSkeleton({ label }) {
  return (
    <div className="flex h-48 w-full items-center justify-center rounded-3xl border border-dashed border-pink-200 bg-white/70 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">Memuat {label}...</div>
  );
}
ChartSkeleton.propTypes = { label: PropTypes.string.isRequired };

function ExportButtonFallback() {
  return (
    <button type="button" disabled className="relative inline-flex items-center justify-center rounded-full bg-pink-400 px-6 py-2 text-sm font-semibold text-white opacity-70 shadow-sm">
      Menyiapkan export...
    </button>
  );
}

const MOOD_META = {
  senang: { label: 'Senang', color: '#facc15' },
  sedih: { label: 'Sedih', color: '#60a5fa' },
  kesal: { label: 'Kesal', color: '#f87171' },
  cemas: { label: 'Cemas', color: '#a78bfa' },
  normal: { label: 'Biasa aja', color: '#94a3b8' },
};

const PHASE_ART = {
  menstruation: {
    imageAlt: 'Ilustrasi fase menstruasi',
    imageSrc: '/image/phase-menstruation.png',
    gradient: 'from-rose-100 via-white to-rose-50',
    gradientDark: 'dark:from-rose-950 dark:via-slate-950 dark:to-rose-900',
    badge: 'bg-rose-100 text-rose-600',
    badgeDark: 'dark:bg-rose-900/40 dark:text-rose-200 dark:border dark:border-rose-800/50',
    icon: Droplet,
    name: 'Menstruasi',
    description: 'Tubuh kamu sedang bersih-bersih nih. Lapisan rahim yang sebelumnya menebal lagi dibersihkan lewat darah haid.  Hormon estrogen masih rendah, jadi kamu mungkin akan merasa lelah ataupun moody.',
    tips: ['Istirahat cukup dan konsumsi makanan bergizi. Tubuhmu sedang bekerja keras!'],
  },
  follicular: {
    imageAlt: 'Ilustrasi fase folikuler',
    imageSrc: '/image/phase-follicular.png',
    gradient: 'from-green-100 via-white to-emerald-50',
    gradientDark: 'dark:from-emerald-950 dark:via-slate-950 dark:to-rose-900',
    badge: 'bg-emerald-100 text-emerald-600',
    badgeDark: 'dark:bg-emerald-900/40 dark:text-emerald-200 dark:border dark:border-emerald-800/50',
    icon: Sprout,
    name: 'Folikuler',
    description: 'Hormon estrogen mulai naik lagi. Tubuhmu sedang menyiapkan sel telur baru, dan kamu mungkin merasa lebih semangat, fokus, dan ceria. Kerasa nggak kalo kamu udah lebih berenergi?',
    tips: ['Gunakan energimu buat hal-hal produktif yuk! Kamu bisa olahraga ringan, baca artikel atau eksplor hal baru.'],
  },
  ovulation: {
    imageAlt: 'Ilustrasi fase ovulasi',
    imageSrc: '/image/phase-ovulation.png',
    gradient: 'from-amber-100 via-white to-yellow-50',
    gradientDark: 'dark:from-amber-950 dark:via-slate-950 dark:to-rose-900',
    badge: 'bg-amber-100 text-amber-600',
    badgeDark: 'dark:bg-amber-900/40 dark:text-amber-200 dark:border dark:border-amber-800/60',
    icon: Sparkles,
    name: 'Ovulasi',
    description: 'Telur dilepaskan dari ovarium. Kamu mungkin merasa lebih percaya diri dan cantik hari ini. Namun, beberapa orang juga merasakan sedikit nyeri di perut bagian bawah pada fase ini.',
    tips: ['Perempuan memiliki peluang kehamilan lebih tinggi di masa ini. Tetap jaga kesehatan ya, jangan lupa jaga asupan air putih dan istirahat cukup.'],
  },
  luteal: {
    imageAlt: 'Ilustrasi fase luteal',
    imageSrc: '/image/phase-luteal.png',
    gradient: 'from-indigo-100 via-white to-slate-50',
    gradientDark: 'dark:from-indigo-950 dark:via-slate-950 dark:to-rose-900',
    badge: 'bg-indigo-100 text-indigo-600',
    badgeDark: 'dark:bg-indigo-900/40 dark:text-indigo-200 dark:border dark:border-indigo-800/50',
    icon: Moon,
    name: 'Luteal',
    description: 'Hormon progesteron lagi naik nih untuk mempersiapkan rahim kalau terjadi pembuahan. Kalau tidak, tubuhmu sedang bersiap haid lagi. Di fase ini, wajar kalau kamu merasa cepat lelah, lapar, atau sensitif.',
    tips: ['Jangan lupa luangkan waktu buat diri sendiri ya. Ceritain RISA dong, gimana perasaanmu hari ini?'],
  },
  unknown: {
    imageAlt: 'Ilustrasi remaja muda',
    imageSrc: '/image/phase-unknown.png',
    gradient: 'from-rose-50 via-white to-rose-100',
    gradientDark: 'dark:from-rose-900 dark:via-rose-950 dark:to-rose-900',
    badge: 'bg-rose-100 text-rose-700 border border-rose-200',
    badgeDark: 'dark:bg-rose-800/70 dark:text-rose-200 dark:border dark:border-rose-700/60',
    icon: Sparkles,
    name: 'jurnal mood',
    description: 'Data siklus lengkap bantu kami menyesuaikan tips khusus untukmu.',
    tips: [],
  },
};

const PLACEHOLDER_COPY = {
  loading: {
    title: 'Menyiapkan ruangmu',
    message: 'Kami sedang memuat data siklusmu....',
    showPulse: true,
    imageSrc: '/image/placeholder-loading.png',
    imageAlt: 'Ilustrasi pengisian data sedang dimuat',
  },
  error: {
    title: 'Terjadi Kesalahan',
    message: 'Gagal memuat data. Silakan coba lagi.',
    showPulse: false,
    imageSrc: '/image/placeholder-error.png',
    imageAlt: 'Ilustrasi error',
  },
};

function OnboardingPlaceholder({ state, error, onRetry }) {
  const copy = state === 'error' ? PLACEHOLDER_COPY.error : PLACEHOLDER_COPY.loading;
  const src = copy.imageSrc || '/image/placeholder-form.png';
  const alt = copy.imageAlt || copy.title;

  return (
    <output className="block rounded-[32px] border border-pink-100/70 bg-white/85 p-8 text-center shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70" aria-live="polite" aria-busy={state === 'loading'}>
      <div className="mx-auto flex max-w-md flex-col items-center gap-6">
        <div className="relative h-28 w-28">
          <div className={`absolute inset-0 rounded-full ${copy.showPulse ? 'bg-pink-200/70 motion-safe:animate-pulse dark:bg-pink-900/40' : 'bg-pink-100/60 dark:bg-pink-900/20'}`} aria-hidden="true" />
          <Image src={src} alt={alt} width={100} height={100} className="relative z-10 h-full w-full object-contain" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{copy.title}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">{error || copy.message}</p>
        </div>
        {state === 'error' && onRetry ? (
          <CustomButton title="Coba Lagi" onClick={onRetry} className="px-4 py-2 text-sm" />
        ) : copy.showPulse ? (
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-pink-500" />
            </span>
            <span>Sedang memuat...</span>
          </div>
        ) : null}
      </div>
    </output>
  );
}
OnboardingPlaceholder.propTypes = {
  state: PropTypes.oneOf(['loading', 'error']),
  error: PropTypes.string,
  onRetry: PropTypes.func,
};

function computePhaseInfo(cycles, insights) {
  if (!Array.isArray(cycles) || !cycles.length) {
    return { phaseKey: 'unknown', day: null, cycleLength: 28, periodLength: 5 };
  }

  const latest = cycles[0];
  if (!latest?.start) {
    return { phaseKey: 'unknown', day: null, cycleLength: 28, periodLength: 5 };
  }

  const cycleLength = insights?.averageCycleLength ?? latest?.cycleLength ?? 28;
  const periodLength = insights?.averagePeriodLength ?? latest?.periodLength ?? 5;

  const startDate = new Date(latest.start);
  if (Number.isNaN(startDate.getTime())) {
    return { phaseKey: 'unknown', day: null, cycleLength, periodLength };
  }

  const today = new Date();
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / MS_PER_DAY);
  const day = daysSinceStart >= 0 ? daysSinceStart + 1 : null;

  if (!day) {
    return { phaseKey: 'unknown', day, cycleLength, periodLength };
  }

  if (day <= periodLength) {
    return { phaseKey: 'menstruation', day, cycleLength, periodLength };
  }
  if (day <= periodLength + 12) {
    return { phaseKey: 'follicular', day, cycleLength, periodLength };
  }
  if (day <= periodLength + 14) {
    return { phaseKey: 'ovulation', day, cycleLength, periodLength };
  }
  if (day <= cycleLength) {
    return { phaseKey: 'luteal', day, cycleLength, periodLength };
  }

  return { phaseKey: 'unknown', day, cycleLength, periodLength };
}

function buildUpcomingPeriods(predictions, cycles, insights) {
  if (Array.isArray(predictions) && predictions.length) {
    return predictions
      .map((item) => normalizePredictionDate(item?.start))
      .filter(Boolean)
      .slice(0, 3);
  }

  if (!Array.isArray(cycles) || !cycles.length) return [];
  const latest = cycles[0];
  if (!latest?.start) return [];

  const baseStart = new Date(latest.start);
  if (Number.isNaN(baseStart.getTime())) return [];

  const cycleLength = insights?.averageCycleLength ?? latest?.cycleLength ?? 28;

  const upcoming = [];
  for (let step = 1; step <= 3; step += 1) {
    upcoming.push(toJakartaYMD(new Date(baseStart.getTime() + step * cycleLength * MS_PER_DAY)));
  }
  return upcoming;
}

export default function SikluskuPage() {
  const rippleCleanupsRef = useRef([]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logFormOpen, setLogFormOpen] = useState(false);
  const [loveLetterOpen, setLoveLetterOpen] = useState(false);
  const [showOnboardingFlow, setShowOnboardingFlow] = useState(false);
  const [gateChoice, setGateChoice] = useState(null);

  const hydrated = useSiklusStore((s) => s.hydrated);
  const cycles = useSiklusStore((s) => s.cycles);
  const insights = useSiklusStore((s) => s.insights);
  const dailyNotes = useSiklusStore((s) => s.dailyNotes);
  const predictions = useSiklusStore((s) => s.predictions);
  const loadingCycles = useSiklusStore((s) => s.loadingCycles);
  const loadingDailyNotes = useSiklusStore((s) => s.loadingDailyNotes);
  const loadingInsights = useSiklusStore((s) => s.loadingInsights);
  const errorCycles = useSiklusStore((s) => s.errorCycles);
  const errorInsights = useSiklusStore((s) => s.errorInsights);
  const onboardingCompleted = useSiklusStore((s) => s.onboardingCompleted);
  const loveLetterShown = useSiklusStore((s) => s.loveLetterShown);

  const hydrateStore = useSiklusStore((s) => s.hydrate);
  const loadAll = useSiklusStore((s) => s.loadAll);
  const loadPredictions = useSiklusStore((s) => s.loadPredictions);
  const markLoveLetterShown = useSiklusStore((s) => s.markLoveLetterShown);

  useEffect(() => {
    const storage = globalThis?.localStorage;
    const token = storage?.getItem('token');
    setIsAuthenticated(Boolean(token));
    setAuthChecked(true);

    if (token) {
      hydrateStore();
    }
  }, [hydrateStore]);

  useEffect(() => {
    if (!authChecked || !isAuthenticated || !hydrated) return;
    loadAll();
  }, [authChecked, isAuthenticated, hydrated, loadAll]);

  useEffect(() => {
    if (!isAuthenticated || !cycles?.length || insights?.averageCycleLength <= 0) return;
    loadPredictions();
  }, [isAuthenticated, cycles, insights, loadPredictions]);

  useEffect(() => {
    if (!authChecked || !isAuthenticated) return;
    const storage = globalThis?.localStorage;

    if (!onboardingCompleted) {
      const storedChoice = storage?.getItem('risa:gateChoice');
      if (storedChoice) {
        setGateChoice(storedChoice);
        setShowOnboardingFlow(true);
      } else {
        setShowOnboardingFlow(true);
      }
    } else {
      setShowOnboardingFlow(false);
    }
  }, [authChecked, isAuthenticated, onboardingCompleted]);

  useEffect(() => {
    if (!isAuthenticated || !onboardingCompleted || loveLetterShown) return;
    const storage = globalThis?.localStorage;
    if (storage?.getItem('risa:loveLetterEligible') === 'true') {
      setLoveLetterOpen(true);
    }
  }, [isAuthenticated, onboardingCompleted, loveLetterShown]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        gsap.globalTimeline.pause();
        gsap.ticker?.sleep?.();
      } else {
        gsap.globalTimeline.resume();
        gsap.ticker?.wake?.();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const media = globalThis?.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media) return undefined;

    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);

    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const cleanupAll = () => {
      rippleCleanupsRef.current.forEach((fn) => fn?.());
      rippleCleanupsRef.current = [];
    };

    cleanupAll();
    if (prefersReducedMotion) return cleanupAll;

    const nodes = Array.from(document.querySelectorAll('[data-ripple="true"]'));
    rippleCleanupsRef.current = nodes.map((node) => attachRipple(node));

    return cleanupAll;
  }, [prefersReducedMotion]);

  const handleBelumClick = useCallback(() => {
    const storage = globalThis?.localStorage;
    storage?.setItem('risa:gateChoice', 'belum');
    setGateChoice('belum');
  }, []);

  const handleSudahClick = useCallback(() => {
    const storage = globalThis?.localStorage;
    storage?.setItem('risa:gateChoice', 'sudah');
    setGateChoice('sudah');
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    setShowOnboardingFlow(false);
    loadAll();
  }, [loadAll]);

  const handleLoveLetterClose = useCallback(() => {
    markLoveLetterShown();
    setLoveLetterOpen(false);
  }, [markLoveLetterShown]);

  const cycleInsight = useMemo(() => computePhaseInfo(cycles, insights), [cycles, insights]);
  const upcomingPeriods = useMemo(() => buildUpcomingPeriods(predictions, cycles, insights), [predictions, cycles, insights]);

  const cycleTrendPoints = useMemo(() => {
    const history = insights?.cycleHistory;
    if (!Array.isArray(history) || !history.length) {
      return [{ label: 'Saat ini', value: insights?.averageCycleLength || 0 }];
    }

    const formatter = new Intl.DateTimeFormat('id-ID', { month: 'short' });
    return history
      .slice(0, 6)
      .map((item) => {
        const reference = item?.end || item?.start;
        const date = reference ? new Date(reference) : null;
        if (!date || Number.isNaN(date.getTime())) return null;
        return {
          label: `${formatter.format(date)} ${String(date.getFullYear()).slice(-2)}`,
          value: item?.cycleLength || item?.periodLength || 0,
        };
      })
      .filter(Boolean);
  }, [insights]);

  const exportLegend = useMemo(() => {
    const counts = dailyNotes.reduce((acc, note) => {
      const key = typeof note?.mood === 'string' ? note.mood.toLowerCase() : null;
      if (!key) return acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([mood, count]) => {
        const meta = MOOD_META[mood] || { label: mood, color: '#94a3b8' };
        return { mood, label: meta.label, color: meta.color, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [dailyNotes]);

  const moodSummary = useMemo(() => {
    const counts = dailyNotes.reduce((acc, note) => {
      const key = typeof note?.mood === 'string' ? note.mood.toLowerCase() : null;
      if (!key) return acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    let dominantMood = '-';
    let max = 0;
    for (const [mood, count] of Object.entries(counts)) {
      if (count > max) {
        max = count;
        dominantMood = mood;
      }
    }

    return { dominantMood, total: dailyNotes.length };
  }, [dailyNotes]);

  const renderPhaseHero = () => {
    const phaseMeta = PHASE_ART[cycleInsight.phaseKey] || PHASE_ART.unknown;
    const isUnknown = cycleInsight.phaseKey === 'unknown';
    const tips = Array.isArray(phaseMeta.tips) ? phaseMeta.tips : [];
    const phaseName = phaseMeta.name;
    const headline = isUnknown ? 'Belum mulai haid? Gapapa!' : `Hari ke-${cycleInsight.day} siklusmu`;
    const subline = isUnknown ? '' : `Kamu sedang di fase ${phaseName}`;
    const description = isUnknown ? 'Kamu bisa mulai dari catat mood harianmu dulu.\nNanti kalau kamu udah haid, klik catat!' : phaseMeta.description;
    const Icon = phaseMeta.icon;

    let tipsMarkup;
    if (tips.length > 0) {
      tipsMarkup = (
        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-200">
          {tips.map((tip) => (
            <li key={tip} className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-pink-400 dark:bg-pink-300" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      );
    } else {
      tipsMarkup = <p className="text-sm text-slate-500 dark:text-slate-400">Catat mood kamu disini setiap hari!</p>;
    }

    return (
      <div className="space-y-6">
        <section className={`overflow-hidden rounded-[32px] border border-white/40 bg-gradient-to-r ${phaseMeta.gradient} ${phaseMeta.gradientDark ?? ''} p-6 shadow-sm sm:p-8 dark:border-white/10`}>
          <div className="grid gap-6 md:grid-cols-[1.15fr_auto] md:items-center">
            <div className="space-y-5">
              <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide ${phaseMeta.badge} ${phaseMeta.badgeDark ?? ''}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="text-slate-900 dark:text-slate-100">{phaseName}</span>
              </span>

              <div className="space-y-2 text-left">
                <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-[34px]">{headline}</h1>
                {subline ? <p className="text-sm text-slate-600 dark:text-slate-300">{subline}</p> : null}
              </div>

              <p className="whitespace-pre-line text-sm text-slate-600 dark:text-slate-300">{description}</p>

              {!isUnknown ? (
                <dl className="grid grid-cols-2 gap-4 text-left sm:max-w-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Panjang siklus</dt>
                    <dd className="text-lg font-semibold text-slate-900 dark:text-slate-100">{cycleInsight.cycleLength} hari</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Lama menstruasi</dt>
                    <dd className="text-lg font-semibold text-slate-900 dark:text-slate-100">{cycleInsight.periodLength} hari</dd>
                  </div>
                </dl>
              ) : null}

              {isUnknown && onboardingCompleted ? <CustomButton type="button" title="Catat Siklusku 🩸" onClick={() => setLogFormOpen(true)} className="px-5 py-2 text-sm" /> : null}

              {cycles.length > 0 ? (
                <div>
                  <CustomButton type="button" title="Tambahkan Tanggal Haid" onClick={() => setLogFormOpen(true)} className="px-4 py-2 text-xs" />
                </div>
              ) : null}
            </div>

            <div className="relative hidden h-64 w-64 md:block">
              <div className="absolute inset-0 rounded-full bg-white/70 blur-3xl dark:bg-white/10" aria-hidden="true" />
              <Image src={phaseMeta.imageSrc} alt={phaseMeta.imageAlt} width={256} height={256} className="relative z-10 h-full w-full object-contain" />
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-700/60 dark:bg-slate-900">
          <div className="space-y-4 text-left">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Tips spesial untukmu:</h2>
            {tipsMarkup}
          </div>
        </section>
      </div>
    );
  };

  const renderDashboard = () => {
    const hasUpcoming = upcomingPeriods.length > 0;

    return (
      <div className="space-y-8">
        {renderPhaseHero()}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            {cycles.length > 0 ? <TabsTrigger value="report">Laporan</TabsTrigger> : null}
          </TabsList>

          <TabsContent value="dashboard">
            <div className="space-y-8">
              <section className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <ConsistencyCard />

                {hasUpcoming ? (
                  <section className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Perkiraan haid berikutnya</h3>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      {upcomingPeriods.map((isoDate) => (
                        <li key={isoDate} className="flex items-center justify-between rounded-2xl bg-pink-50 px-4 py-3">
                          <span className="font-semibold text-pink-600">{formatDisplayDate(isoDate) || isoDate}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : (
                  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Perkiraan haid berikutnya</h3>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Tambahkan catatan haid untuk melihat prediksi.</p>
                  </section>
                )}
              </section>

              <DailyTracker />
            </div>

            <DailyLogsViewer />

            <section className="grid grid-cols-1">
              <MoodDistributionCard />
            </section>

            <section id="recommendations" className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-700/60 dark:bg-slate-900">
              <h3 className="mb-8 text-center text-xl font-bold text-gray-800 dark:text-slate-100">Rekomendasi bacaan untuk kamu</h3>

              <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-3 md:gap-4 lg:gap-6">
                <a
                  href="/article-hiv.html"
                  className="group block cursor-pointer rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:text-pink-600 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="mb-2 h-48 w-full rounded-xl bg-cover bg-top" style={{ backgroundImage: 'url(/image/article-image-1.png)' }} aria-hidden="true" />
                  <span className="font-medium">HIV? Gak Usah Panik, Yuk Kenalan Dulu!</span>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-400">Kenalan sama HIV biar gak salah paham dan tetap bisa jaga diri.</p>
                </a>

                <a
                  href="/article-seks.html"
                  className="group block cursor-pointer rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:text-pink-600 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="mb-2 h-48 w-full rounded-xl bg-cover bg-top" style={{ backgroundImage: 'url(/image/article-image-2.png)' }} aria-hidden="true" />
                  <span className="font-medium">Seks Itu Apa Sih? Biar Gak Salah Paham dan Bisa Jaga Diri!</span>
                  <p className="text-sm leading-relaxed text-gray-600 dark{text-slate-400}">Belajar soal seks biar gak salah langkah dan bisa jaga diri.</p>
                </a>

                <a
                  href="/article-menstruasi.html"
                  className="group block cursor-pointer rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:text-pink-600 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="mb-2 h-48 w-full rounded-xl bg-cover bg-top" style={{ backgroundImage: 'url(/image/article-image-3.png)' }} aria-hidden="true" />
                  <span className="font-medium">Menstruasi Pertama: Kenapa Bisa Terjadi dan Gak Usah Takut!</span>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-400">Menstruasi pertama itu alami, yuk siapin diri biar gak panik.</p>
                </a>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="report">
            <div className="space-y-8">
              <section className="grid grid-cols-1">
                <AchievementsCard />
              </section>

              <section className="grid grid-cols-1">
                <MoodPatternCard />
              </section>

              <section className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Tren panjang siklus</h3>
                  <CycleTrendChart points={cycleTrendPoints} />
                </div>

                <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Rekap siklusmu</h3>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    <li className="flex items-center justify-between rounded-2xl bg-pink-50 px-4 py-3">
                      <span>Rata-rata siklus</span>
                      <span className="font-semibold text-pink-600">{insights?.averageCycleLength || 28} hari</span>
                    </li>
                    <li className="flex items-center justify-between rounded-2xl bg-pink-50 px-4 py-3">
                      <span>Rata-rata menstruasi</span>
                      <span className="font-semibold text-pink-600">{insights?.averagePeriodLength || 5} hari</span>
                    </li>
                    <li className="flex items-center justify-between rounded-2xl bg-pink-50 px-4 py-3">
                      <span>Mood dominan</span>
                      <span className="capitalize font-semibold text-pink-600">{moodSummary.dominantMood}</span>
                    </li>
                  </ul>
                </div>
              </section>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-pink-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Unduh laporan</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Simpan sebagai PNG untuk dibaca kapan saja.</p>
                </div>
                <ChartExportButton
                  filename="siklusku-report.png"
                  stats={{
                    averageCycleLength: insights?.averageCycleLength || 28,
                    averagePeriodLength: insights?.averagePeriodLength || 5,
                    dominantMood: moodSummary.dominantMood,
                    moodEntries: dailyNotes.length,
                  }}
                  legend={exportLegend}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  let onboardingContent = renderDashboard();
  if (showOnboardingFlow && !onboardingCompleted) {
    if (!gateChoice) {
      onboardingContent = <OnboardingGate open onBelum={handleBelumClick} onSudah={handleSudahClick} reducedMotion={prefersReducedMotion} />;
    } else if (gateChoice === 'belum') {
      onboardingContent = <FirstPeriodGuide onComplete={handleOnboardingComplete} />;
    } else {
      onboardingContent = <CycleOnboarding onComplete={handleOnboardingComplete} />;
    }
  }

  if (!authChecked) {
    return (
      <main className="container mx-auto max-w-4xl px-4 py-10">
        <OnboardingPlaceholder state="loading" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="container mx-auto max-w-4xl px-4 py-10">
        <OnboardingGate open requiresAuth />
      </main>
    );
  }

  const isLoadingData = !hydrated || loadingCycles || loadingInsights || loadingDailyNotes;

  if (isLoadingData) {
    return (
      <main className="container mx-auto max-w-4xl px-4 py-10">
        <OnboardingPlaceholder state="loading" />
      </main>
    );
  }

  const hasError = Boolean(errorCycles || errorInsights);

  if (hasError) {
    return (
      <main className="container mx-auto max-w-4xl px-4 py-10">
        <OnboardingPlaceholder state="error" error={errorCycles || errorInsights} onRetry={() => loadAll()} />
      </main>
    );
  }

  return (
    <main id="main-content" tabIndex={-1} role="main" className="container mx-auto max-w-4xl space-y-8 px-4 py-10 dark:text-slate-100">
      <LoveLetterModal open={loveLetterOpen} onClose={handleLoveLetterClose} reducedMotion={prefersReducedMotion} />

      {onboardingContent}

      <LogPeriodForm open={logFormOpen} onClose={() => setLogFormOpen(false)} />
    </main>
  );
}
