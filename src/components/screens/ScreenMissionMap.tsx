import React from 'react';
import { useApp } from '../../context/AppContext';
import { Mission } from '../../types';
import {
  Lock,
  Star,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Trophy,
  Award,
  Layers,
  ChevronRight,
  Compass,
} from 'lucide-react';

export const ScreenMissionMap: React.FC = () => {
  const {
    currentUser,
    currentOperator,
    missions,
    selectMission,
    setCurrentScreen,
    getTrackMaxXP,
    getLevelInfo,
  } = useApp();

  const track = currentUser?.track || 'lengkap';
  const completedMissions = currentUser?.completedMissions || {};
  const currentXP = currentUser?.xp || 0;
  const maxXP = getTrackMaxXP(track);
  const { level, title, progressPercent } = getLevelInfo(currentXP, track);

  // Check mission unlock status
  // Pre-test M-0 is always unlocked.
  // For BW:
  // BW-1 unlocks if M-0 is done (or default available)
  // BW-2 unlocks if BW-1 has >= 1 star
  // BW-3 unlocks if BW-2 has >= 1 star
  // BW-4 unlocks if BW-3 has >= 1 star
  // BW-5 unlocks if BW-4 has >= 1 star
  //
  // For GW:
  // GW-1 unlocks if M-0 is done
  // GW-2 unlocks if GW-1 has >= 1 star
  // GW-3 unlocks if GW-2 has >= 1 star
  // GW-4 unlocks if GW-3 has >= 1 star
  // GW-5 unlocks if GW-4 has >= 1 star
  //
  // For INT-1 (Lengkap only):
  // Unlocks if ALL BW-1 to BW-5 AND GW-1 to GW-5 have >= 1 star
  //
  // For M-X (Post-test):
  // If track is BW: BW-1 to BW-5 done >= 1 star
  // If track is GW: GW-1 to GW-5 done >= 1 star
  // If track is Lengkap: BW-1..5, GW-1..5, and INT-1 done >= 1 star
  const isMissionUnlocked = (missionId: string): boolean => {
    if (missionId === 'M-0') return true;

    // Has user done Pre-test M-0?
    const hasPreTest = !!completedMissions['M-0'];

    if (missionId === 'BW-1' || missionId === 'GW-1') {
      return hasPreTest;
    }
    if (missionId === 'BW-2') return (completedMissions['BW-1']?.stars || 0) >= 1;
    if (missionId === 'BW-3') return (completedMissions['BW-2']?.stars || 0) >= 1;
    if (missionId === 'BW-4') return (completedMissions['BW-3']?.stars || 0) >= 1;
    if (missionId === 'BW-5') return (completedMissions['BW-4']?.stars || 0) >= 1;

    if (missionId === 'GW-2') return (completedMissions['GW-1']?.stars || 0) >= 1;
    if (missionId === 'GW-3') return (completedMissions['GW-2']?.stars || 0) >= 1;
    if (missionId === 'GW-4') return (completedMissions['GW-3']?.stars || 0) >= 1;
    if (missionId === 'GW-5') return (completedMissions['GW-4']?.stars || 0) >= 1;

    if (missionId === 'INT-1') {
      const allBW = ['BW-1', 'BW-2', 'BW-3', 'BW-4', 'BW-5'].every(
        (id) => (completedMissions[id]?.stars || 0) >= 1
      );
      const allGW = ['GW-1', 'GW-2', 'GW-3', 'GW-4', 'GW-5'].every(
        (id) => (completedMissions[id]?.stars || 0) >= 1
      );
      return allBW && allGW;
    }

    if (missionId === 'M-X') {
      if (track === 'black_water') {
        return ['BW-1', 'BW-2', 'BW-3', 'BW-4', 'BW-5'].every(
          (id) => (completedMissions[id]?.stars || 0) >= 1
        );
      }
      if (track === 'grey_water') {
        return ['GW-1', 'GW-2', 'GW-3', 'GW-4', 'GW-5'].every(
          (id) => (completedMissions[id]?.stars || 0) >= 1
        );
      }
      // lengkap
      const allBW = ['BW-1', 'BW-2', 'BW-3', 'BW-4', 'BW-5'].every(
        (id) => (completedMissions[id]?.stars || 0) >= 1
      );
      const allGW = ['GW-1', 'GW-2', 'GW-3', 'GW-4', 'GW-5'].every(
        (id) => (completedMissions[id]?.stars || 0) >= 1
      );
      const int1 = (completedMissions['INT-1']?.stars || 0) >= 1;
      return allBW && allGW && int1;
    }

    return false;
  };

  const bwMissions = missions.filter((m) => m.track === 'black_water');
  const gwMissions = missions.filter((m) => m.track === 'grey_water');
  const preTest = missions.find((m) => m.id === 'M-0')!;
  const int1Mission = missions.find((m) => m.id === 'INT-1')!;
  const postTest = missions.find((m) => m.id === 'M-X')!;

  const renderMissionCard = (m: Mission) => {
    const unlocked = isMissionUnlocked(m.id);
    const completion = completedMissions[m.id];
    const isCompleted = !!completion && completion.stars >= 1;

    return (
      <div
        key={m.id}
        className={`relative rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
          !unlocked
            ? 'bg-slate-100/80 border-slate-200 text-slate-400 opacity-75'
            : isCompleted
            ? 'bg-white border-teal-200 shadow-xs hover:shadow-md hover:border-teal-300'
            : 'bg-white border-amber-300 ring-2 ring-amber-400/20 shadow-sm hover:shadow-md'
        }`}
      >
        <div className="p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                !unlocked
                  ? 'bg-slate-200 text-slate-500'
                  : isCompleted
                  ? 'bg-teal-50 text-teal-800'
                  : 'bg-amber-100 text-amber-900'
              }`}
            >
              {m.id} · {m.levelLabel}
            </span>

            {/* Stars or Lock indicator */}
            {!unlocked ? (
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <Lock className="w-3.5 h-3.5" />
                <span>Terkunci</span>
              </div>
            ) : isCompleted ? (
              <div className="flex items-center gap-0.5 text-amber-500">
                {[1, 2, 3].map((starIdx) => {
                  const effectiveStars = Math.max(
                    completion.stars,
                    completion.score >= 90 ? 3 : completion.score >= 75 ? 2 : completion.score >= 60 ? 1 : 0
                  );
                  return (
                    <Star
                      key={starIdx}
                      className={`w-4 h-4 ${
                        starIdx <= effectiveStars
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  );
                })}
              </div>
            ) : (
              <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                Tersedia Sekarang
              </span>
            )}
          </div>

          <h3
            className={`text-base font-bold mb-1 leading-snug ${
              !unlocked ? 'text-slate-500' : 'text-slate-900'
            }`}
          >
            {m.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mb-4">{m.subtitle}</p>

          <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
            <span className="text-slate-400 font-medium">Maks: {m.maxXP} XP</span>
            {isCompleted && (
              <span className="font-semibold text-teal-700">
                Skor: {completion.score} · +{completion.xpEarned} XP
              </span>
            )}
          </div>
        </div>

        <div className="p-4 pt-0">
          {unlocked ? (
            <button
              onClick={() => selectMission(m.id)}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                isCompleted
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
              }`}
            >
              {isCompleted ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ulangi Misi</span>
                </>
              ) : (
                <>
                  <span>Mulai Misi Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          ) : (
            <button
              disabled
              className="w-full py-2.5 px-3 rounded-xl text-xs font-medium bg-slate-200/60 text-slate-400 cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Selesaikan misi sebelumnya</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Participant Progress Header Bar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {track === 'lengkap'
                  ? 'Jalur Lengkap (Black & Grey)'
                  : track === 'black_water'
                  ? 'Jalur Black Water'
                  : 'Jalur Grey Water'}
              </span>
              <button
                onClick={() => setCurrentScreen('track_select')}
                className="text-xs text-slate-500 hover:text-teal-700 underline cursor-pointer"
              >
                Ganti Jalur
              </button>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Peta Pembelajaran Sanitasi Berjenjang
            </h1>
            <p className="text-xs text-slate-500">
              {currentUser?.name} · {currentOperator?.name}
            </p>
          </div>

          {/* Gamification Stats */}
          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end text-xs font-bold text-slate-900">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Level {level} — {title}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                <strong className="text-teal-700 font-semibold">{currentXP}</strong> / {maxXP} XP
                ({progressPercent}%)
              </p>
              <div className="w-48 h-2 bg-slate-100 rounded-full mt-1.5 overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, progressPercent)}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen('student_dashboard')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Lihat Rapor</span>
            </button>
          </div>
        </div>

        {/* Section 1: Pre-test (M-0) Header node */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md">
            {renderMissionCard(preTest)}
          </div>
          <div className="w-0.5 h-8 bg-slate-300 my-1" />
        </div>

        {/* Section 2: Columns of missions */}
        {track === 'lengkap' ? (
          <div>
            <div className="text-center mb-4">
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                Tingkat 1 s.d. 5: Anda dapat mengerjakan kolom Black Water dan Grey Water secara bebas bergantian
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              {/* Black Water Column */}
              <div className="space-y-4">
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                    Kolom Black Water (Tinja & IPLT)
                  </span>
                  <span className="text-[11px] text-amber-800 font-semibold">Tingkat 1 → 5</span>
                </div>
                {bwMissions.map((m) => renderMissionCard(m))}
              </div>

              {/* Grey Water Column */}
              <div className="space-y-4">
                <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-900 uppercase tracking-wide">
                    Kolom Grey Water (Dapur & Biofilter)
                  </span>
                  <span className="text-[11px] text-teal-800 font-semibold">Tingkat 1 → 5</span>
                </div>
                {gwMissions.map((m) => renderMissionCard(m))}
              </div>
            </div>

            {/* INT-1 Final Mission Node for Track Lengkap */}
            <div className="flex flex-col items-center mt-8">
              <div className="w-0.5 h-8 bg-slate-300 my-1" />
              <div className="w-full max-w-lg">
                <div className="text-center mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    Khusus Jalur Lengkap: Misi Integrasi Terpadu
                  </span>
                </div>
                {renderMissionCard(int1Mission)}
              </div>
            </div>
          </div>
        ) : track === 'black_water' ? (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Kolom Misi Black Water (Kakus, Tangki Septik & IPLT)
              </span>
              <span className="text-[11px] text-amber-800 font-semibold">Tingkat 1 → 5</span>
            </div>
            {bwMissions.map((m) => renderMissionCard(m))}
          </div>
        ) : (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs font-bold text-teal-900 uppercase tracking-wide">
                Kolom Misi Grey Water (Grease Trap, Biofilter & Wetland)
              </span>
              <span className="text-[11px] text-teal-800 font-semibold">Tingkat 1 → 5</span>
            </div>
            {gwMissions.map((m) => renderMissionCard(m))}
          </div>
        )}

        {/* Section 3: Final Post-Test and Certificate Node */}
        <div className="flex flex-col items-center pt-4">
          <div className="w-0.5 h-8 bg-slate-300 my-1" />
          <div className="w-full max-w-md">
            {renderMissionCard(postTest)}
          </div>

          {/* Certificate milestone badge */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-200 text-center max-w-md w-full">
            <Award className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-900">
              Piagam Kelulusan Resmi Terverifikasi
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Syarat: Seluruh misi minimal 1 Bintang dan Nilai Post-Test ≥ 75 (KKM).
            </p>
            {currentUser?.certificateIssued ? (
              <button
                onClick={() => setCurrentScreen('certificate_view')}
                className="mt-3 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>Buka & Unduh Piagam Anda</span>
              </button>
            ) : (
              <p className="mt-2 text-[11px] text-slate-400 font-medium">
                Belum memenuhi syarat kelulusan
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
