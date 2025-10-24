export const CYCLE_PHASES = {
  MENSTRUATION: 'menstruation',
  FOLLICULAR: 'follicular',
  OVULATION: 'ovulation',
  LUTEAL: 'luteal',
};

const PHASE_LIST = Object.values(CYCLE_PHASES);

export const PHASE_NAMES = {
  [CYCLE_PHASES.MENSTRUATION]: 'Menstruasi',
  [CYCLE_PHASES.FOLLICULAR]: 'Folikuler',
  [CYCLE_PHASES.OVULATION]: 'Ovulasi',
  [CYCLE_PHASES.LUTEAL]: 'Luteal',
};

function toPositiveInteger(value, fallback) {
  const numeric = Number.parseInt(value, 10);
  if (Number.isFinite(numeric) && numeric > 0) return numeric;
  return fallback;
}

export function determineCyclePhase(dayInCycle, cycleLength = 28, periodLength = 5) {
  const normalizedCycleLength = toPositiveInteger(cycleLength, 28);
  const normalizedPeriodLength = Math.min(normalizedCycleLength, Math.max(1, toPositiveInteger(periodLength, 5)));

  if (!dayInCycle) return CYCLE_PHASES.MENSTRUATION;

  const day = ((Math.round(dayInCycle) - 1 + normalizedCycleLength) % normalizedCycleLength) + 1;

  if (day <= normalizedPeriodLength) return CYCLE_PHASES.MENSTRUATION;

  const ovulationDay = Math.min(normalizedCycleLength - 1, Math.max(normalizedPeriodLength + 1, normalizedCycleLength - 14));
  const ovulationEnd = Math.min(normalizedCycleLength, ovulationDay + 1);

  if (day >= ovulationDay && day <= ovulationEnd) return CYCLE_PHASES.OVULATION;
  if (day < ovulationDay) return CYCLE_PHASES.FOLLICULAR;
  return CYCLE_PHASES.LUTEAL;
}

/** Calculate the day in cycle for a given date */
export function calculateDayInCycle(date, cycleStartDate, cycleLength = 28) {
  const normalizedCycleLength = toPositiveInteger(cycleLength, 28);
  const dateObj = new Date(date);
  const cycleStartObj = new Date(cycleStartDate);

  if (Number.isNaN(dateObj.getTime()) || Number.isNaN(cycleStartObj.getTime())) return 1;

  const diffTime = dateObj.getTime() - cycleStartObj.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // 1-based

  if (diffDays <= 0) {
    const normalized = ((diffDays % normalizedCycleLength) + normalizedCycleLength) % normalizedCycleLength;
    return normalized === 0 ? normalizedCycleLength : normalized;
  }

  return ((diffDays - 1) % normalizedCycleLength) + 1;
}

export function analyzeMoodPatternsByPhase(logs = [], cycleSummary = {}) {
  const lastPeriodStart = cycleSummary?.lastPeriodStart;
  const averageCycleLength = toPositiveInteger(cycleSummary?.averageCycleLength, 28);
  const averagePeriodLength = toPositiveInteger(cycleSummary?.averagePeriodLength, 5);

  // Prepare containers
  const byPhase = PHASE_LIST.reduce((acc, phase) => {
    acc[phase] = {}; // mood -> count
    return acc;
  }, {});
  const topMoodByPhase = PHASE_LIST.reduce((acc, phase) => {
    acc[phase] = null;
    return acc;
  }, {});
  const summary = PHASE_LIST.reduce((acc, phase) => {
    acc[phase] = { total: 0, topMood: null, topCount: 0, topPercentage: 0, moodCounts: [] };
    return acc;
  }, {});

  if (!Array.isArray(logs) || logs.length === 0 || !lastPeriodStart) {
    return { byPhase, topMoodByPhase, summary, hasData: false };
  }

  // Tally per phase
  logs.forEach((log = {}) => {
    const moodKey = typeof log.mood === 'string' ? log.mood.toLowerCase() : null;
    if (!moodKey) return;

    const dayInCycle = calculateDayInCycle(log.date, lastPeriodStart, averageCycleLength);
    const phase = determineCyclePhase(dayInCycle, averageCycleLength, averagePeriodLength);
    const bucket = byPhase[phase];

    bucket[moodKey] = (bucket[moodKey] || 0) + 1;
  });

  // Build summaries
  let hasData = false;
  PHASE_LIST.forEach((phase) => {
    const moodCounts = byPhase[phase];
    const entries = Object.entries(moodCounts)
      .filter(([, count]) => count > 0)
      .sort((a, b) => (b[1] === a[1] ? a[0].localeCompare(b[0]) : b[1] - a[1]));

    const total = entries.reduce((s, [, c]) => s + c, 0);
    const topEntry = entries[0] || null;

    const detailedCounts = entries.map(([mood, count]) => ({
      mood,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));

    summary[phase] = {
      total,
      topMood: topEntry ? topEntry[0] : null,
      topCount: topEntry ? topEntry[1] : 0,
      topPercentage: topEntry && total > 0 ? Math.round((topEntry[1] / total) * 100) : 0,
      moodCounts: detailedCounts,
    };

    topMoodByPhase[phase] = summary[phase].topMood;
    if (total > 0) hasData = true;
  });

  return { byPhase, topMoodByPhase, summary, hasData };
}
