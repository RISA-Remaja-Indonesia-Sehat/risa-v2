'use client';

import { useMemo } from 'react';
import { Calendar, Heart, Droplets, MessageCircle } from 'lucide-react';
import useSiklusStore from '../../store/useSiklusStore';

const FLOW_LABELS = {
  1: { label: 'Ringan', emoji: '💧' },
  2: { label: 'Sedang', emoji: '💧💧' },
  3: { label: 'Banyak', emoji: '💧💧💧' },
  4: { label: 'Sangat Banyak', emoji: '💧💧💧💧' },
};

const MOOD_LABELS = {
  senang: { label: 'Senang', emoji: '😊' },
  sedih: { label: 'Sedih', emoji: '😢' },
  kesal: { label: 'Kesal', emoji: '😠' },
  cemas: { label: 'Cemas', emoji: '😰' },
  normal: { label: 'Biasa aja', emoji: '😐' },
};

const SYMPTOM_LABELS = {
  cramps: { label: 'Kram perut', emoji: '😣' },
  headache: { label: 'Sakit kepala', emoji: '🤕' },
  bloating: { label: 'Perut kembung', emoji: '😮💨' },
  backache: { label: 'Sakit punggung', emoji: '😰' },
  fatigue: { label: 'Lelah', emoji: '😴' },
  acne: { label: 'Jerawatan', emoji: '😔' },
};

const toJakartaDate = (value) =>
  new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value));

export default function DailyLogsViewer() {
  const dailyNotes = useSiklusStore((state) => state.dailyNotes);

  const recentNotes = useMemo(() => (Array.isArray(dailyNotes) ? dailyNotes.slice(0, 7) : []), [dailyNotes]);

  if (!recentNotes.length) {
    return (
      <div className="rounded-3xl border border-pink-100 bg-white p-6 text-center shadow-sm">
        <Calendar className="mx-auto mb-3 h-12 w-12 text-pink-300" />
        <h3 className="mb-2 text-lg font-semibold text-slate-800">Belum Ada Jurnal</h3>
        <p className="text-sm text-slate-600">Mulai catat jurnal harianmu untuk melihat pola dan tren</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-pink-500" />
        <h3 className="text-lg font-semibold text-slate-800">Riwayat jurnal harianku</h3>
      </div>

      <div className="space-y-4">
        {recentNotes.map((note) => {
          const moodMeta = typeof note.mood === 'string' ? MOOD_LABELS[note.mood] : null;
          const flowMeta = note.flowLevel !== undefined && FLOW_LABELS[note.flowLevel] ? FLOW_LABELS[note.flowLevel] : null;

          return (
            <article key={`${note.date}-${note.mood || 'log'}`} className="rounded-2xl border border-pink-100 p-4">
              <header className="mb-3 flex items-center justify-between">
                <h4 className="font-medium text-slate-800">{toJakartaDate(note.date)}</h4>
                {moodMeta ? (
                  <span className="flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-sm font-medium text-pink-700">
                    <span>{moodMeta.emoji}</span>
                    <span>{moodMeta.label}</span>
                  </span>
                ) : null}
              </header>

              <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                {flowMeta ? (
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-pink-500" />
                    <span className="text-slate-600">
                      {flowMeta.emoji} {flowMeta.label}
                    </span>
                  </div>
                ) : null}

                {Array.isArray(note.symptoms) && note.symptoms.length > 0 ? (
                  <div className="flex items-start gap-2">
                    <Heart className="mt-0.5 h-4 w-4 text-pink-500" />
                    <div className="flex flex-wrap gap-1">
                      {note.symptoms.map((symptomId) => {
                        const symptom = SYMPTOM_LABELS[symptomId];
                        return symptom ? (
                          <span key={symptomId} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-slate-600">
                            <span>{symptom.emoji}</span>
                            <span>{symptom.label}</span>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                ) : null}
              </dl>

              {note.story ? (
                <div className="mt-3 border-t border-pink-100 pt-3">
                  <span className="flex items-start gap-2">
                    <MessageCircle className="mt-0.5 h-4 w-4 text-pink-500" />
                    <p className="text-sm italic text-slate-600">"{note.story}"</p>
                  </span>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      {dailyNotes.length > 7 ? (
        <footer className="mt-4 text-center">
          <p className="text-sm text-slate-500">Menampilkan 7 jurnal terakhir dari {dailyNotes.length} total jurnal</p>
        </footer>
      ) : null}
    </div>
  );
}
