import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Droplets, ShieldCheck, ArrowRight, KeyRound, UserCheck, AlertCircle } from 'lucide-react';

export const ScreenLogin: React.FC = () => {
  const { login, users, switchUser, setCurrentScreen } = useApp();
  const [username, setUsername] = useState('peserta.lengkap');
  const [password, setPassword] = useState('SiLimbah#2026');
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim()) {
      setErrorMsg('Silakan masukkan username atau email');
      return;
    }

    const success = login(username.trim());
    if (!success) {
      setErrorMsg('Username tidak terdaftar. Pilih salah satu dari 10 akun demo di bawah.');
    }
  };

  const handleQuickDemoPick = (uname: string) => {
    setUsername(uname);
    setPassword('SiLimbah#2026');
    login(uname);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 shadow-xl mb-4">
          <Droplets className="w-9 h-9" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          SiLimbah
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Sistem Informasi Terintegrasi Media Pembelajaran Pengelolaan Air Limbah Domestik (Black Water & Grey Water)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-slate-700/80 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Username / Email Operator
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="misal: peserta.lengkap"
                className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-teal-400 hover:text-teal-300 cursor-pointer"
                >
                  Lupa sandi?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Kata sandi demo seragam: <code className="text-teal-400">SiLimbah#2026</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Masuk ke Sistem Pembelajaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/80 text-center">
            <button
              onClick={() => setCurrentScreen('public_verification')}
              className="text-xs text-slate-400 hover:text-teal-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Verifikasi Keaslian Piagam Kelulusan (Tanpa Login)
            </button>
          </div>
        </div>

        {/* 10 PRD Quick Switcher Cards */}
        <div className="mt-6 bg-slate-800/40 backdrop-blur-xs p-4 rounded-xl border border-slate-700/60">
          <p className="text-xs font-semibold text-teal-400 mb-2 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            1-Klik Masuk Sebagai Aktor Demo (PRD Hal 20):
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickDemoPick('peserta.lengkap')}
              className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-700/70 text-left border border-slate-700/50 cursor-pointer"
            >
              <div className="font-semibold text-white">peserta.lengkap</div>
              <div className="text-[11px] text-teal-300">Jalur Lengkap · Sedang di BW-4</div>
            </button>
            <button
              onClick={() => handleQuickDemoPick('peserta.lulus')}
              className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-700/70 text-left border border-slate-700/50 cursor-pointer"
            >
              <div className="font-semibold text-white">peserta.lulus</div>
              <div className="text-[11px] text-emerald-300">Lulus 100% · Unduh Piagam</div>
            </button>
            <button
              onClick={() => handleQuickDemoPick('instruktur.uptd')}
              className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-700/70 text-left border border-slate-700/50 cursor-pointer"
            >
              <div className="font-semibold text-white">instruktur.uptd</div>
              <div className="text-[11px] text-slate-300">Ibu Ratna · Evaluasi Kelas</div>
            </button>
            <button
              onClick={() => handleQuickDemoPick('pimpinan.uptd')}
              className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-700/70 text-left border border-slate-700/50 cursor-pointer"
            >
              <div className="font-semibold text-white">pimpinan.uptd</div>
              <div className="text-[11px] text-slate-300">Kepala UPTD (Hanya Baca)</div>
            </button>
            <button
              onClick={() => handleQuickDemoPick('admin.uptd')}
              className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-700/70 text-left border border-slate-700/50 cursor-pointer"
            >
              <div className="font-semibold text-white">admin.uptd</div>
              <div className="text-[11px] text-slate-300">Kelola Akun, Kelas & IPAL</div>
            </button>
            <button
              onClick={() => handleQuickDemoPick('superadmin')}
              className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-700/70 text-left border border-slate-700/50 cursor-pointer"
            >
              <div className="font-semibold text-white">superadmin</div>
              <div className="text-[11px] text-purple-300">Penyedia · Kelola Tenant</div>
            </button>
            <button
              onClick={() => handleQuickDemoPick('peserta.bw')}
              className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-700/70 text-left border border-slate-700/50 cursor-pointer"
            >
              <div className="font-semibold text-white">peserta.bw</div>
              <div className="text-[11px] text-slate-300">IPLT Tirta · Selesai BW-1</div>
            </button>
            <button
              onClick={() => handleQuickDemoPick('peserta.gw')}
              className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-700/70 text-left border border-slate-700/50 cursor-pointer"
            >
              <div className="font-semibold text-white">peserta.gw</div>
              <div className="text-[11px] text-slate-300">IPAL Mekarsari · Di GW-3</div>
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal (FR-07) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full text-slate-200">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-teal-400" />
              Reset Kata Sandi
            </h3>
            {forgotSubmitted ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">
                  Tautan pemulihan kata sandi telah dikirimkan ke <strong className="text-teal-300">{forgotEmail}</strong>. Silakan periksa kotak masuk atau spam email Anda.
                </p>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                  }}
                  className="w-full py-2 bg-teal-500 text-slate-950 font-semibold text-xs rounded-lg cursor-pointer"
                >
                  Kembali ke Login
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Masukkan email terdaftar operator Anda untuk menerima tautan pembuatan kata sandi baru.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="operator@sukamajukab.go.id"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (forgotEmail.trim()) setForgotSubmitted(true);
                    }}
                    className="flex-1 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
                  >
                    Kirim Tautan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
