import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_BADGES } from '../../data/mockData';
import {
  Trophy,
  Award,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  Users,
  Eye,
  EyeOff,
  Download,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const ScreenStudentDashboard: React.FC = () => {
  const {
    currentUser,
    currentOperator,
    users,
    missions,
    setCurrentScreen,
    getStudentFinalGrade,
    getTrackMaxXP,
    getLevelInfo,
    kkmThreshold,
    updateUser,
  } = useApp();

  const user = currentUser!;
  const track = user.track || 'lengkap';
  const maxXP = getTrackMaxXP(track);
  const { level, title, progressPercent } = getLevelInfo(user.xp, track);
  const gradeInfo = getStudentFinalGrade(user);

  const [isAnonymous, setIsAnonymous] = useState(user.isAnonymousInLeaderboard || false);

  const handleToggleAnonymous = () => {
    const nextVal = !isAnonymous;
    setIsAnonymous(nextVal);
    updateUser(user.id, { isAnonymousInLeaderboard: nextVal });
  };

  // Class leaderboard (same operator and cohort)
  const cohortUsers = users
    .filter((u) => u.role === 'peserta' && u.operatorId === user.operatorId)
    .sort((a, b) => b.xp - a.xp);

  // Simulation stats aggregation
  const completedMissionsList = Object.entries(user.completedMissions);
  const totalMissionsDone = completedMissionsList.length;
  const avgScore = gradeInfo.avgMissionScore;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Card & Level/Title (Bagian 7.1) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{user.name}</h1>
                <span className="text-xs uppercase font-bold tracking-wide text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {track.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentOperator?.name} · {user.classCohort || 'Angkatan 1 (2026)'}
              </p>
              <p className="text-xs font-semibold text-amber-600 mt-1 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                Level {level}: {title}
              </p>
            </div>
          </div>

          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Progres Penguasaan Jalur:</span>
              <span className="font-bold text-slate-800 font-mono">
                {user.xp} / {maxXP} XP
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(100, progressPercent)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 text-right">
              {100 - progressPercent}% menuju level berikutnya
            </p>
          </div>
        </div>

        {/* Graduation Status & Certificate Download Card */}
        <div
          className={`rounded-3xl p-6 sm:p-8 border transition-all ${
            gradeInfo.isEligible
              ? 'bg-gradient-to-br from-teal-900 to-slate-900 text-white shadow-lg border-teal-700'
              : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className={`w-6 h-6 ${gradeInfo.isEligible ? 'text-amber-400' : 'text-slate-400'}`} />
                <h3 className={`text-lg font-bold ${gradeInfo.isEligible ? 'text-white' : 'text-slate-900'}`}>
                  Status Kelulusan & Piagam Pelatihan
                </h3>
              </div>
              <p className={`text-xs ${gradeInfo.isEligible ? 'text-slate-300' : 'text-slate-500'} max-w-xl`}>
                Syarat Kelulusan: Menuntaskan seluruh misi pada jalur dengan minimal 1 Bintang, serta nilai Post-Test mencapai KKM ({kkmThreshold}).
              </p>

              <div className="flex flex-wrap gap-4 pt-2 text-xs">
                <div className="flex items-center gap-1.5">
                  {gradeInfo.isEligible ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500" />
                  )}
                  <span>Seluruh Misi Jalur Lulus (Min 1★)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(user.postTestScore ?? 0) >= kkmThreshold ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500" />
                  )}
                  <span>Post-Test: {user.postTestScore ?? 'Belum Ujian'} (KKM {kkmThreshold})</span>
                </div>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-2 w-full md:w-auto">
              <div className="text-xs">
                <span className={gradeInfo.isEligible ? 'text-slate-300' : 'text-slate-500'}>
                  Nilai Akhir Kelulusan:
                </span>
                <span className={`text-2xl font-extrabold font-mono ml-2 ${gradeInfo.isEligible ? 'text-amber-300' : 'text-slate-900'}`}>
                  {gradeInfo.finalScore}
                </span>
                <span className="block text-[11px] font-semibold text-teal-400">
                  Predikat: {gradeInfo.predicate}
                </span>
              </div>

              {gradeInfo.isEligible ? (
                <button
                  onClick={() => setCurrentScreen('certificate_view')}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <Award className="w-4 h-4" />
                  <span>Buka & Unduh Piagam Resmi</span>
                </button>
              ) : (
                <button
                  onClick={() => setCurrentScreen('mission_map')}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Lanjutkan Misi yang Belum Selesai
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2-Column Split: Pre vs Post Chart & Simulation Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pre-Test vs Post-Test Comparison Chart */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                Peningkatan Nilai (Pre-Test vs Post-Test)
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Batas KKM: {kkmThreshold}</span>
            </div>

            <div className="h-44 flex items-end justify-around gap-6 pt-6 px-4">
              {/* Pre-Test Bar */}
              <div className="flex flex-col items-center flex-1 max-w-[100px]">
                <span className="font-mono font-bold text-xs text-slate-700 mb-1">
                  {user.preTestScore ?? 0}
                </span>
                <div className="w-full bg-slate-100 rounded-t-xl h-36 flex items-end">
                  <div
                    className="w-full bg-slate-400 rounded-t-xl transition-all duration-500"
                    style={{ height: `${Math.min(100, user.preTestScore ?? 10)}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 mt-2">Pre-Test</span>
              </div>

              {/* KKM Line Marker */}
              <div className="flex flex-col items-center flex-1 max-w-[80px] opacity-75">
                <span className="font-mono font-semibold text-xs text-amber-600 mb-1">
                  {kkmThreshold}
                </span>
                <div className="w-full bg-amber-50 rounded-t-xl h-36 flex items-end border-t-2 border-dashed border-amber-500">
                  <div
                    className="w-full bg-amber-400/30 rounded-t-xl"
                    style={{ height: `${kkmThreshold}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-amber-700 mt-2">Garis KKM</span>
              </div>

              {/* Post-Test Bar */}
              <div className="flex flex-col items-center flex-1 max-w-[100px]">
                <span className="font-mono font-bold text-xs text-teal-700 mb-1">
                  {user.postTestScore ?? 0}
                </span>
                <div className="w-full bg-slate-100 rounded-t-xl h-36 flex items-end">
                  <div
                    className="w-full bg-teal-600 rounded-t-xl transition-all duration-500"
                    style={{ height: `${Math.min(100, user.postTestScore ?? 10)}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-teal-800 mt-2">Post-Test</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 flex justify-between">
              <span>Rata-rata Kenaikan Kompetensi:</span>
              <strong className="text-teal-700">
                +{user.postTestScore && user.preTestScore ? user.postTestScore - user.preTestScore : 0} Poin
              </strong>
            </div>
          </div>

          {/* Simulation Alert Stats */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                Statistik Ketangguhan Simulasi & Alert
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Rekap Log</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 text-[11px]">Misi Dituntaskan</span>
                <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                  {totalMissionsDone} Misi
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 text-[11px]">Rata-rata Skor Misi</span>
                <p className="text-xl font-bold font-mono text-teal-700 mt-0.5">
                  {avgScore} / 100
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 text-[11px]">Ketepatan Aksi Alert</span>
                <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                  92% Tepat
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 text-[11px]">Rata-rata Respons</span>
                <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                  18 Detik
                </p>
              </div>
            </div>

            <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200 text-[11px] text-teal-900">
              Operator menunjukkan respon cepat dalam menangani kenaikan lumpur tangki septik dan pembersihan grease trap dapur.
            </div>
          </div>
        </div>

        {/* Badges Showcase (Earned vs Locked) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Koleksi Lencana Keahlian (Badges)
            </h3>
            <span className="text-xs text-slate-500">
              {user.badges.length} dari {INITIAL_BADGES.length} Terbuka
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {INITIAL_BADGES.map((b) => {
              const isEarned = user.badges.includes(b.id);
              return (
                <div
                  key={b.id}
                  className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                    isEarned
                      ? 'bg-amber-50/50 border-amber-200 text-slate-800'
                      : 'bg-slate-50/70 border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isEarned ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-900">{b.name}</p>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{b.description}</p>
                    <p className="text-[10px] text-slate-400 italic mt-1">Syarat: {b.requirement}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Class Leaderboard with Privacy / Anonymous Switcher */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                Papan Peringkat Kelas ({user.classCohort || 'Angkatan 1'})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Peringkat XP dalam satu operator {currentOperator?.name}
              </p>
            </div>

            <button
              onClick={handleToggleAnonymous}
              className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs text-slate-700 font-medium flex items-center gap-1.5 cursor-pointer"
            >
              {isAnonymous ? <EyeOff className="w-3.5 h-3.5 text-teal-600" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isAnonymous ? 'Tampil Inisial (Anonim)' : 'Tampil Nama Lengkap'}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 uppercase text-[11px] font-semibold text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Peringkat</th>
                  <th className="px-4 py-3">Nama Peserta</th>
                  <th className="px-4 py-3">Jalur</th>
                  <th className="px-4 py-3">Level & Gelar</th>
                  <th className="px-4 py-3 text-right">Total XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cohortUsers.map((u, idx) => {
                  const isCurrent = u.id === user.id;
                  const displayName =
                    u.isAnonymousInLeaderboard || (isCurrent && isAnonymous)
                      ? `${u.name.split(' ').map((n) => n[0]).join('')}.`
                      : u.name;

                  return (
                    <tr
                      key={u.id}
                      className={isCurrent ? 'bg-teal-50/70 font-semibold text-teal-950' : 'hover:bg-slate-50'}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">
                        #{idx + 1}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-slate-900">{displayName}</span>
                        {isCurrent && (
                          <span className="ml-2 text-[10px] bg-teal-600 text-white px-1.5 py-0.2 rounded font-normal">
                            Anda
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 capitalize text-slate-600">
                        {u.track?.replace('_', ' ') || 'Lengkap'}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{u.levelTitle}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-teal-700">
                        {u.xp} XP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
