import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Award,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  User,
  Star,
} from 'lucide-react';

export const ScreenStudentDetail: React.FC = () => {
  const {
    inspectedStudentId,
    users,
    currentOperator,
    setCurrentScreen,
    getStudentFinalGrade,
    resetMissionsForStudent,
    issueCertificate,
    revokeCertificate,
    certificates,
    alertLogs,
    kkmThreshold,
  } = useApp();

  const student = users.find((u) => u.id === inspectedStudentId) || users[4];
  const gradeInfo = getStudentFinalGrade(student);
  const cert = certificates.find((c) => c.userId === student.id);

  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [revokeReason, setRevokeReason] = useState('Kesalahan rekapitulasi data nilai lapangan');

  const studentAlertLogs = alertLogs.filter((l) => l.userId === student.id);

  const handleIssueCert = () => {
    issueCertificate(student.id);
  };

  const handleConfirmRevoke = () => {
    if (cert) {
      revokeCertificate(cert.id, revokeReason);
      setShowRevokeModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back navigation */}
        <button
          onClick={() => setCurrentScreen('operator_dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard Evaluasi Operator</span>
        </button>

        {/* Student Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-800 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{student.name}</h1>
                <span className="text-xs uppercase font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                  {student.track?.replace('_', ' ') || 'Lengkap'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {student.email} · {currentOperator?.name} · {student.classCohort}
              </p>
              <div className="flex items-center gap-3 text-xs mt-1">
                <span className="font-semibold text-slate-700">{student.levelTitle}</span>
                <span className="text-slate-300">·</span>
                <span className="font-mono font-bold text-teal-700">{student.xp} XP</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500">Terakhir aktif: {student.lastActive}</span>
              </div>
            </div>
          </div>

          {/* Instructor Actions */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => {
                if (window.confirm(`Yakin ingin mereset seluruh riwayat misi untuk ${student.name}?`)) {
                  resetMissionsForStudent(student.id);
                }
              }}
              className="px-3.5 py-2 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Progres Misi</span>
            </button>

            {cert ? (
              cert.status === 'berlaku' ? (
                <button
                  onClick={() => setShowRevokeModal(true)}
                  className="px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Cabut Piagam (FR-46)</span>
                </button>
              ) : (
                <span className="px-3 py-2 bg-slate-100 text-rose-600 font-bold text-xs rounded-xl">
                  Piagam Dicabut
                </span>
              )
            ) : gradeInfo.isEligible ? (
              <button
                onClick={handleIssueCert}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Terbitkan Piagam Sekarang</span>
              </button>
            ) : (
              <span className="px-3 py-2 bg-slate-100 text-slate-400 font-medium text-xs rounded-xl">
                Belum Memenuhi Syarat Lulus
              </span>
            )}
          </div>
        </div>

        {/* Grade Summary Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-teal-600" />
            Rekapitulasi Penilaian Kelulusan
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400">Rerata Skor Misi (40%)</span>
              <p className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                {gradeInfo.avgMissionScore}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400">Post-Test (60%)</span>
              <p className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                {student.postTestScore ?? '—'}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400">Nilai Akhir Terhitung</span>
              <p className="text-lg font-extrabold font-mono text-teal-800 mt-0.5">
                {gradeInfo.finalScore}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400">Predikat Kelulusan</span>
              <p className="text-xs font-bold text-amber-700 mt-1">
                {gradeInfo.predicate}
              </p>
            </div>
          </div>
        </div>

        {/* Mission History Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Riwayat Capaian Per Misi
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 uppercase text-[11px] font-semibold text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Kode & Judul Misi</th>
                  <th className="px-4 py-3 text-center">Bintang</th>
                  <th className="px-4 py-3 text-center">Skor Tertinggi</th>
                  <th className="px-4 py-3 text-center">XP Diperoleh</th>
                  <th className="px-4 py-3 text-center">Percobaan</th>
                  <th className="px-4 py-3 text-right">Tanggal Selesai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.entries(student.completedMissions).map(([mId, record]) => (
                  <tr key={mId} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">{mId}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-0.5 text-amber-500">
                        {[1, 2, 3].map((starIdx) => (
                          <Star
                            key={starIdx}
                            className={`w-3.5 h-3.5 ${
                              starIdx <= record.stars
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-slate-800">
                      {record.score}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-teal-700 font-bold">
                      +{record.xpEarned}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-slate-500">
                      {record.attempts}x
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500 font-mono">
                      {record.completedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alert & Action Audit Log Table (FR-24) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              Log Audit Alert & Tindakan Simulasi (FR-24)
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {studentAlertLogs.length} Entri Tercatat
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 uppercase text-[11px] font-semibold text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-2.5">Waktu</th>
                  <th className="px-4 py-2.5">Misi</th>
                  <th className="px-4 py-2.5">Kode Alert</th>
                  <th className="px-4 py-2.5">Aksi Yang Diambil Operator</th>
                  <th className="px-4 py-2.5 text-center">Ketepatan</th>
                  <th className="px-4 py-2.5 text-right">Waktu Respons</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentAlertLogs.length > 0 ? (
                  studentAlertLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-500 font-mono">{log.timestamp}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{log.missionId}</td>
                      <td className="px-4 py-3 font-mono font-bold text-teal-800">{log.alertCode}</td>
                      <td className="px-4 py-3 text-slate-700">{log.actionTaken}</td>
                      <td className="px-4 py-3 text-center">
                        {log.isCorrect ? (
                          <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                            Tepat
                          </span>
                        ) : (
                          <span className="text-[10px] text-rose-800 bg-rose-50 px-2 py-0.5 rounded font-bold">
                            Keliru / Penalti
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-slate-800">
                        {log.responseTimeSeconds}s
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                      Belum ada catatan alert simulasi untuk operator ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Revoke Certificate Modal (FR-46) */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-rose-900 mb-2 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              Pencabutan Piagam Kelulusan (FR-46)
            </h3>
            <p className="text-slate-600 mb-4">
              Instruktur berhak mencabut piagam yang terbit karena kekeliruan data atau pelanggaran integritas. Alasan pencabutan akan tercatat permanen pada sistem verifikasi publik.
            </p>

            <div className="space-y-2 mb-5">
              <label className="block text-xs font-semibold text-slate-700">
                Alasan Resmi Pencabutan:
              </label>
              <textarea
                rows={3}
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowRevokeModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmRevoke}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer"
              >
                Konfirmasi Cabut Piagam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
