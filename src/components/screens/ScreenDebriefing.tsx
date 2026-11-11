import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Star,
  Award,
  Sparkles,
  RotateCcw,
  ArrowRight,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  XCircle,
  Trophy,
} from 'lucide-react';

export const ScreenDebriefing: React.FC = () => {
  const {
    lastDebriefResult,
    missions,
    setCurrentScreen,
    selectMission,
    currentUser,
  } = useApp();

  const result = lastDebriefResult || {
    missionId: 'BW-3',
    score: 92,
    stars: 3,
    baseXP: 184,
    bonusXP: 36,
    totalXP: 220,
    hintsUsed: 0,
    elapsedSeconds: 240,
    unlockedBadgeIds: ['badge_penyedot'],
    mistakes: [],
    recommendedReview: 'Pertahankan waktu tanggap alert dan pemantauan parameter lumpur!',
  };

  const mission = missions.find((m) => m.id === result.missionId) || missions[3];
  const isPassed = result.stars >= 1;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-center">
          {/* Header Banner */}
          <div
            className={`p-8 text-white ${
              isPassed
                ? 'bg-gradient-to-b from-teal-900 to-slate-900'
                : 'bg-gradient-to-b from-rose-950 to-slate-900'
            }`}
          >
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 mb-3">
              {isPassed ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Misi Berhasil Dituntaskan!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Skor Belum Mencapai Batas Kelulusan (&lt;60)</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Debriefing: {mission.title}
            </h1>
            <p className="mt-1 text-xs text-slate-300">
              Evaluasi Kinerja & Kompetensi Operator Air Limbah
            </p>

            {/* Stars Showcase */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {[1, 2, 3].map((starIdx) => {
                const effectiveStars = Math.max(
                  result.stars,
                  result.score >= 90 ? 3 : result.score >= 75 ? 2 : result.score >= 60 ? 1 : 0
                );
                return (
                  <Star
                    key={starIdx}
                    className={`w-10 h-10 transition-transform ${
                      starIdx <= effectiveStars
                        ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-md'
                        : 'text-slate-600'
                    }`}
                  />
                );
              })}
            </div>

            {/* Score & XP Big Numbers */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800 text-center">
              <div>
                <p className="text-xs text-slate-400">Skor Akhir</p>
                <p className="text-3xl font-extrabold font-mono text-white mt-1">
                  {result.score}
                  <span className="text-xs text-slate-400 font-sans font-normal"> / 100</span>
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Total XP Diraih</p>
                <p className="text-3xl font-extrabold font-mono text-teal-400 mt-1">
                  +{result.totalXP}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Durasi Selesai</p>
                <p className="text-3xl font-extrabold font-mono text-white mt-1">
                  {Math.floor(result.elapsedSeconds / 60)}:
                  {(result.elapsedSeconds % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6 text-left text-xs">
            {/* XP Bonus Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">Rincian Perhitungan XP (PRD Bagian 4):</span>
              <div className="flex justify-between text-slate-600 py-1 border-b border-slate-100">
                <span>XP Dasar (Skor ÷ 100 × XP Maksimum):</span>
                <span className="font-mono font-bold text-slate-800">{result.baseXP} XP</span>
              </div>
              <div className="flex justify-between text-slate-600 py-1 border-b border-slate-100">
                <span>Bonus Kecepatan & Tanpa Petunjuk (Maks +20%):</span>
                <span className="font-mono font-bold text-emerald-600">+{result.bonusXP} XP</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold pt-1">
                <span>Total XP Dikreditkan ke Profil:</span>
                <span className="font-mono text-teal-700 font-extrabold">+{result.totalXP} XP</span>
              </div>
            </div>

            {/* Badges Unlocked */}
            {result.unlockedBadgeIds.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                    Lencana Baru Terbuka!
                  </span>
                  <p className="font-bold text-slate-900 text-sm">
                    {result.unlockedBadgeIds.join(', ')}
                  </p>
                </div>
              </div>
            )}

            {/* Error Analysis & Recommendations */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Analisis Kinerja & Saran Perbaikan
              </h4>

              {result.mistakes.length > 0 ? (
                <div className="space-y-2">
                  {result.mistakes.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-900 text-xs flex items-start gap-2"
                    >
                      <XCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tidak ada kesalahan signifikan yang dicatat pada misi ini. Sangat baik!</span>
                </div>
              )}

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <span className="font-semibold text-slate-900 block mb-1">Rekomendasi Ahli Materi:</span>
                <p className="leading-relaxed">{result.recommendedReview}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-100">
              <button
                onClick={() => selectMission(mission.id)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Misi Ini (Bebas)</span>
              </button>

              <button
                onClick={() => setCurrentScreen('mission_map')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Kembali ke Peta Misi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
