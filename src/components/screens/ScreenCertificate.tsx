import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  Printer,
  Download,
  Share2,
  ShieldCheck,
  ArrowLeft,
  QrCode,
  Droplets,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export const ScreenCertificate: React.FC = () => {
  const {
    currentUser,
    currentOperator,
    certificates,
    setCurrentScreen,
    setVerifyingCertCode,
    issueCertificate,
  } = useApp();

  // Find certificate for currentUser or issue if eligible
  let cert = certificates.find((c) => c.userId === currentUser?.id);

  if (!cert && currentUser) {
    cert = certificates[0]; // fallback demo certificate (Budi Setiawan)
  }

  const handlePrint = () => {
    window.print();
  };

  const handleOpenVerification = () => {
    if (cert) {
      setVerifyingCertCode(cert.verificationCode);
      setCurrentScreen('public_verification');
    }
  };

  if (!cert) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <Award className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Piagam Belum Diterbitkan</h2>
          <p className="text-xs text-slate-500">
            Anda belum memenuhi seluruh kriteria kelulusan (semua misi minimal 1★ dan Post-Test ≥ 75).
          </p>
          <button
            onClick={() => setCurrentScreen('mission_map')}
            className="px-5 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Lanjutkan Misi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => setCurrentScreen('student_dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenVerification}
              className="px-3.5 py-2 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Cek Verifikasi Publik</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Unduh PDF</span>
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas (A4 Landscape Form Factor) */}
        <div className="bg-white rounded-3xl p-8 sm:p-14 border-8 border-double border-teal-900/40 shadow-xl relative overflow-hidden text-slate-800">
          {/* Subtle Watermark BG */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Droplets className="w-[500px] h-[500px] text-teal-950" />
          </div>

          {/* Certificate Header with Dual Logos */}
          <div className="flex items-center justify-between border-b-2 border-slate-800/20 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center shadow-md">
                <Droplets className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-extrabold text-base tracking-tight text-slate-900 uppercase">
                  SiLimbah
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">
                  Sistem Pembelajaran Sanitasi Terintegrasi
                </p>
              </div>
            </div>

            <div className="text-center">
              <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase">
                LEMBAR SERTIFIKASI RESMI
              </span>
              <p className="text-xs font-mono font-bold text-teal-800 mt-0.5">
                No: {cert.certificateNumber}
              </p>
            </div>

            <div className="flex items-center gap-3 text-right">
              <div>
                <h3 className="font-bold text-xs text-slate-900 uppercase">
                  {cert.operatorName}
                </h3>
                <p className="text-[10px] text-slate-500">
                  Unit Pelaksana Teknis Daerah
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                <Building2 className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="text-center my-6 space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Piagam Kelulusan Pelatihan
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-wide text-slate-900 uppercase pt-2">
              Pengelolaan Air Limbah Domestik
            </h1>
            <p className="text-xs text-slate-600 max-w-lg mx-auto">
              Diberikan sebagai pengakuan resmi atas keberhasilan menyelesaikan seluruh modul pembelajaran, simulasi interaktif unit pengolahan, dan ujian kompetensi akhir.
            </p>
          </div>

          {/* Recipient Details */}
          <div className="text-center my-8 space-y-2">
            <p className="text-xs uppercase tracking-wider text-slate-500">Diberikan Kepada:</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-teal-950 underline decoration-teal-600 decoration-2 underline-offset-8">
              {cert.userName}
            </h2>
            <p className="text-xs font-medium text-slate-600 pt-2">
              Operator Bertugas pada: <strong className="text-slate-900">{cert.operatorName}</strong>
            </p>
          </div>

          {/* Course Details & Predicate */}
          <div className="grid grid-cols-3 gap-4 my-8 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Jalur Spesialisasi:</span>
              <strong className="text-slate-900 uppercase text-xs">
                {cert.track === 'lengkap'
                  ? 'Lengkap (Black & Grey Water)'
                  : cert.track === 'black_water'
                  ? 'Black Water (Tinja & IPLT)'
                  : 'Grey Water (Non-Kakus)'}
              </strong>
            </div>

            <div>
              <span className="text-slate-400 text-[11px] block">Nilai Akhir & Predikat:</span>
              <p className="font-mono font-bold text-teal-800 text-sm">
                {cert.finalScore} · <span className="font-sans">{cert.predicate}</span>
              </p>
            </div>

            <div>
              <span className="text-slate-400 text-[11px] block">Tanggal Penerbitan:</span>
              <strong className="text-slate-900 text-xs">{cert.issueDate}</strong>
            </div>
          </div>

          {/* Signatures & QR Code */}
          <div className="grid grid-cols-3 gap-6 items-end mt-12 pt-6 border-t border-slate-200">
            {/* Instructor Signature */}
            <div className="text-center space-y-1">
              <div className="h-16 flex items-center justify-center">
                <span className="font-serif italic text-base text-slate-500 select-none">
                  [Tanda Tangan Digital Terverifikasi]
                </span>
              </div>
              <p className="font-bold text-xs text-slate-900 underline">
                {cert.instructorName}
              </p>
              <p className="text-[10px] text-slate-500">Fasilitator Sanitasi / Instruktur</p>
            </div>

            {/* Verification QR Code Node */}
            <div className="text-center flex flex-col items-center">
              <div
                onClick={handleOpenVerification}
                className="p-2 bg-white rounded-xl border border-slate-300 shadow-xs cursor-pointer hover:border-teal-500 transition-colors"
                title="Klik untuk simulasi scan QR verifikasi"
              >
                <QrCode className="w-16 h-16 text-slate-900" />
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1">
                Kode: {cert.verificationCode}
              </span>
            </div>

            {/* Director Signature & Stamp */}
            <div className="text-center space-y-1">
              <div className="h-16 flex items-center justify-center">
                <span className="font-serif italic text-base text-slate-500 select-none">
                  [Tanda Tangan Digital Pimpinan]
                </span>
              </div>
              <p className="font-bold text-xs text-slate-900 underline">
                {cert.directorName}
              </p>
              <p className="text-[10px] text-slate-500">Kepala UPTD Pengelolaan Air Limbah</p>
            </div>
          </div>

          {/* Mandatory Disclaimer Footnote (PRD Bagian 7.4) */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 italic">
              "Piagam ini bukan sertifikasi kompetensi resmi (seperti BNSP/LSP); piagam ini berfungsi sebagai bukti kelulusan internal pelatihan terintegrasi SiLimbah."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
