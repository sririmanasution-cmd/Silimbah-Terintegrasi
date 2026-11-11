import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  Award,
  Building2,
  ArrowLeft,
  Calendar,
  Lock,
} from 'lucide-react';

export const ScreenPublicVerification: React.FC = () => {
  const { certificates, verifyingCertCode, setVerifyingCertCode, setCurrentScreen } = useApp();

  const [inputCode, setInputCode] = useState(verifyingCertCode || 'VRF-SLB-883921');
  const [searchedCode, setSearchedCode] = useState(verifyingCertCode || 'VRF-SLB-883921');

  // Search by verification code or certificate number
  const matchedCert = certificates.find(
    (c) =>
      c.verificationCode.toLowerCase() === searchedCode.trim().toLowerCase() ||
      c.certificateNumber.toLowerCase() === searchedCode.trim().toLowerCase()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedCode(inputCode.trim());
    setVerifyingCertCode(inputCode.trim());
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-xl mx-auto w-full space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentScreen('login')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Halaman Utama</span>
          </button>
          <span className="text-[11px] font-mono text-slate-400">
            Portal Verifikasi Publik Terenkripsi
          </span>
        </div>

        {/* Verification Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Verifikasi Keaslian Piagam SiLimbah
            </h1>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Layanan publik mandiri tanpa login bagi pimpinan/atasan untuk memastikan keaslian dokumen kelulusan diklat sanitasi.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="Masukkan Nomor Piagam atau Kode QR (misal: VRF-SLB-883921)"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full pl-10 pr-28 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Cek Data
              </button>
            </div>
          </form>

          {/* Verification Result Card */}
          {matchedCert ? (
            <div className="space-y-4 pt-2">
              <div
                className={`p-4 rounded-2xl border flex items-center gap-3 ${
                  matchedCert.status === 'berlaku'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                {matchedCert.status === 'berlaku' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                )}
                <div>
                  <h4 className="font-bold text-sm">
                    {matchedCert.status === 'berlaku'
                      ? 'Dokumen Sah & Berlaku Resmi'
                      : 'Piagam Telah Dicabut (Tidak Berlaku)'}
                  </h4>
                  <p className="text-[11px] opacity-80">
                    Tercatat resmi dalam pangkalan data terintegrasi SiLimbah Indonesia.
                  </p>
                </div>
              </div>

              {/* Data Display according to PRD Bagian 7.4 (Nama, Operator, Jalur, Tanggal Lulus, Status TANPA menampilkan nilai rinci) */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Nomor Registrasi Piagam:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {matchedCert.certificateNumber}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Nama Lengkap Peserta:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {matchedCert.userName}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Operator Tempat Bertugas:</span>
                  <span className="font-semibold text-slate-800 text-right">
                    {matchedCert.operatorName}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Jalur Spesialisasi:</span>
                  <span className="font-semibold text-teal-800 uppercase">
                    {matchedCert.track === 'lengkap'
                      ? 'Lengkap (Black & Grey Water)'
                      : matchedCert.track === 'black_water'
                      ? 'Black Water (Tinja/IPLT)'
                      : 'Grey Water (Non-Kakus)'}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Tanggal Kelulusan:</span>
                  <span className="font-medium text-slate-800">
                    {matchedCert.issueDate}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Status Validasi:</span>
                  <span
                    className={`font-bold uppercase text-[11px] px-2 py-0.5 rounded ${
                      matchedCert.status === 'berlaku'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {matchedCert.status}
                  </span>
                </div>

                {matchedCert.status === 'dicabut' && matchedCert.revocationReason && (
                  <div className="p-3 bg-rose-100/60 rounded-xl border border-rose-200 text-rose-900 text-[11px]">
                    <strong>Alasan Pencabutan:</strong> {matchedCert.revocationReason}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
              <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto" />
              <h4 className="text-xs font-bold text-slate-800">
                Data Piagam Tidak Ditemukan
              </h4>
              <p className="text-[11px] text-slate-500">
                Pastikan nomor registrasi piagam atau kode verifikasi telah diketik dengan benar sesuai yang tertera pada lembar fisik atau hasil scan QR.
              </p>
            </div>
          )}

          {/* Legal Footnote Notice (PRD Bagian 7.4) */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 italic">
              "Piagam ini bukan sertifikat kompetensi resmi (seperti BNSP/LSP). Piagam berfungsi sebagai bukti sah penyelesaian pelatihan internal pada platform SiLimbah."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
