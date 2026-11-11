import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Award,
  Sparkles,
  BookOpen,
  Play,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  User,
} from 'lucide-react';

export const ScreenMissionBriefing: React.FC = () => {
  const {
    activeMissionId,
    missions,
    setCurrentScreen,
    currentUser,
    startExam,
  } = useApp();

  const mission = missions.find((m) => m.id === activeMissionId) || missions[1];
  const completion = currentUser?.completedMissions[mission.id];

  const handleStartMission = () => {
    if (mission.type === 'simulation' || mission.type === 'drag_drop') {
      setCurrentScreen('simulation');
    } else if (mission.type === 'quiz') {
      startExam('mission_quiz', mission.id);
    } else if (mission.type === 'pre_test' || mission.type === 'post_test') {
      startExam(mission.type, mission.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back link */}
        <button
          onClick={() => setCurrentScreen('mission_map')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Peta Misi</span>
        </button>

        {/* Main Briefing Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Header banner */}
          <div className="bg-gradient-to-r from-slate-900 to-teal-950 text-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full">
                {mission.id} · Tingkat {mission.levelLabel}
              </span>
              {completion && (
                <span className="text-xs text-amber-300 font-semibold bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                  Pernah Selesai: Skor {completion.score} ({completion.stars}★)
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {mission.title}
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl">
              {mission.subtitle}
            </p>

            {/* Quick KPI stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800 text-xs">
              <div>
                <p className="text-slate-400">Target Waktu Misi</p>
                <p className="font-bold text-white text-sm flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-4 h-4 text-teal-400" />
                  <span>{Math.round(mission.targetTimeSeconds / 60)} Menit</span>
                </p>
              </div>
              <div>
                <p className="text-slate-400">Total XP Maksimum</p>
                <p className="font-bold text-white text-sm flex items-center gap-1.5 mt-0.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{mission.maxXP} XP</span>
                </p>
              </div>
              <div>
                <p className="text-slate-400">Format Evaluasi</p>
                <p className="font-bold text-white text-sm capitalize mt-0.5">
                  {mission.type === 'simulation'
                    ? 'Simulasi Dinamis'
                    : mission.type === 'drag_drop'
                    ? 'Seret-Lepas Rakit'
                    : 'Kuis Interaktif'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Guide Narrative - Pak Joko */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                <User className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">Pak Joko</span>
                  <span className="text-[11px] text-amber-900 font-medium bg-amber-100 px-2 py-0.5 rounded">
                    Operator Senior Sanitasi UPTD
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{mission.briefing.guideNarrative}"
                </p>
              </div>
            </div>

            {/* Objective & Context */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  Tujuan Utama Misi
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {mission.briefing.objective}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Latar Belakang Lapangan
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {mission.briefing.background}
                </p>
              </div>
            </div>

            {/* Scoring & Rules Summary according to PRD Bagian 4 & 6.4 */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
              <span className="font-bold text-slate-900 block">Aturan Penilaian & Bonus XP:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                <li>Skor akhir (0–100): Kuis = % Benar; Simulasi = 40% Ketepatan Aksi + 30% Waktu Respons + 30% Kualitas Efluen - Penalti.</li>
                <li>Bintang: 1★ (60–74), 2★ (75–89), 3★ (≥90). Jika &lt;60 misi belum lulus dan boleh diulang bebas.</li>
                <li>Bonus XP hingga +20%: Tambahan +10% jika menyelesaikan tanpa membuka petunjuk bantuan, dan +10% jika selesai di bawah target waktu.</li>
                <li>Membuka info narasi objek pada simulasi tidak mengurangi poin skor.</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentScreen('module_learning')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <BookOpen className="w-4 h-4 text-teal-600" />
                <span>Pelajari Modul Teori Dahulu</span>
              </button>

              <button
                onClick={handleStartMission}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Mulai Misi Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
