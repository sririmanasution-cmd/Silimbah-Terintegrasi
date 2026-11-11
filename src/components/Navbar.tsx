import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Droplets,
  ShieldCheck,
  Award,
  Users,
  Compass,
  FileText,
  Building2,
  ChevronDown,
  LogOut,
  RotateCcw,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentOperator,
    activeScreen,
    setCurrentScreen,
    logout,
    resetAllDemoData,
    switchUser,
    users,
  } = useApp();

  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  if (activeScreen === 'login') return null;

  const role = currentUser?.role || 'peserta';

  return (
    <>
      {/* Top Demo Helper Bar for Seamless Examiner Review */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          <span className="text-teal-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Akun Aktif:
          </span>
          <span className="text-white font-medium">{currentUser?.name}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-300 capitalize">
            {role.replace('_', ' ')}
            {currentUser?.track ? ` (${currentUser.track.replace('_', ' ')})` : ''}
          </span>
          {currentOperator && (
            <>
              <span className="text-slate-400">·</span>
              <span className="text-emerald-400">{currentOperator.name}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('app_narrative')}
            className={`text-xs font-semibold flex items-center gap-1.5 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
              activeScreen === 'app_narrative'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-teal-300 hover:text-teal-100 bg-teal-950/80 border border-teal-500/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-400" />
            Dokumen Narasi & Panduan
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => setIsDemoMenuOpen(true)}
            className="text-xs font-medium text-amber-300 hover:text-amber-200 flex items-center gap-1 transition-colors underline cursor-pointer"
          >
            Pilih dari 10 Akun Demo PRD
            <ChevronDown className="w-3 h-3" />
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => {
              if (window.confirm('Reset semua data demo ke kondisi awal sesuai PRD?')) {
                resetAllDemoData();
              }
            }}
            title="Kembalikan semua nilai, progres, dan alert ke awal PRD"
            className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Demo
          </button>
        </div>
      </div>

      {/* Main Top Bar adhering to Top Bar Contract: Brand zone - Nav links zone - Primary action zone */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand title, one line wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (role === 'peserta') setCurrentScreen('mission_map');
                else if (role === 'superadmin') setCurrentScreen('superadmin');
                else setCurrentScreen('operator_dashboard');
              }}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  SiLimbah
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs text-slate-500 font-medium">
                  Air Limbah Domestik
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 single-line clean text nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {role === 'peserta' && (
              <>
                <button
                  onClick={() => setCurrentScreen('mission_map')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
                    activeScreen === 'mission_map' ? 'text-teal-700 font-semibold' : ''
                  }`}
                >
                  Peta Misi
                </button>
                <button
                  onClick={() => setCurrentScreen('module_learning')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
                    activeScreen === 'module_learning' ? 'text-teal-700 font-semibold' : ''
                  }`}
                >
                  Modul Teori
                </button>
                <button
                  onClick={() => setCurrentScreen('simulation')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
                    activeScreen === 'simulation' ? 'text-teal-700 font-semibold' : ''
                  }`}
                >
                  Simulasi Instalasi
                </button>
                <button
                  onClick={() => setCurrentScreen('student_dashboard')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
                    activeScreen === 'student_dashboard' ? 'text-teal-700 font-semibold' : ''
                  }`}
                >
                  Pencapaian & Skor
                </button>
                <button
                  onClick={() => setCurrentScreen('certificate_view')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
                    activeScreen === 'certificate_view' ? 'text-teal-700 font-semibold' : ''
                  }`}
                >
                  Piagam
                </button>
                <button
                  onClick={() => setCurrentScreen('app_narrative')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                    activeScreen === 'app_narrative' ? 'text-teal-700 font-bold' : ''
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                  Panduan Fitur
                </button>
              </>
            )}

            {(role === 'instruktur' || role === 'admin_operator' || role === 'pimpinan_operator') && (
              <>
                <button
                  onClick={() => setCurrentScreen('operator_dashboard')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
                    activeScreen === 'operator_dashboard' ? 'text-teal-700 font-semibold' : ''
                  }`}
                >
                  Evaluasi Kelas
                </button>
                {role === 'admin_operator' && (
                  <button
                    onClick={() => setCurrentScreen('account_management')}
                    className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
                      activeScreen === 'account_management' ? 'text-teal-700 font-semibold' : ''
                    }`}
                  >
                    Kelola Akun & Kelas
                  </button>
                )}
                {role === 'instruktur' && (
                  <button
                    onClick={() => setCurrentScreen('content_management')}
                    className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
                      activeScreen === 'content_management' ? 'text-teal-700 font-semibold' : ''
                    }`}
                  >
                    Konten & Bank Soal
                  </button>
                )}
                <button
                  onClick={() => setCurrentScreen('field_data')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
                    activeScreen === 'field_data' ? 'text-teal-700 font-semibold' : ''
                  }`}
                >
                  Data IPAL/IPLT
                </button>
                <button
                  onClick={() => setCurrentScreen('public_verification')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
                    activeScreen === 'public_verification' ? 'text-teal-700 font-semibold' : ''
                  }`}
                >
                  Cek Piagam
                </button>
                <button
                  onClick={() => setCurrentScreen('app_narrative')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                    activeScreen === 'app_narrative' ? 'text-teal-700 font-bold' : ''
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                  Panduan Fitur
                </button>
              </>
            )}

            {role === 'superadmin' && (
              <>
                <button
                  onClick={() => setCurrentScreen('superadmin')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
                    activeScreen === 'superadmin' ? 'text-teal-700 font-semibold' : ''
                  }`}
                >
                  Operator & Lisensi
                </button>
                <button
                  onClick={() => setCurrentScreen('content_management')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
                    activeScreen === 'content_management' ? 'text-teal-700 font-semibold' : ''
                  }`}
                >
                  Konten Misi Induk
                </button>
                <button
                  onClick={() => setCurrentScreen('public_verification')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer ${
                    activeScreen === 'public_verification' ? 'text-teal-700 font-semibold' : ''
                  }`}
                >
                  Verifikasi Piagam
                </button>
                <button
                  onClick={() => setCurrentScreen('app_narrative')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                    activeScreen === 'app_narrative' ? 'text-teal-700 font-bold' : ''
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                  Panduan Fitur
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: 1 primary action or profile menu */}
          <div className="flex items-center gap-3 shrink-0 relative">
            <button
              onClick={() => setCurrentScreen('app_narrative')}
              title="Buka Dokumen Narasi Fitur & SOP Pengoperasian"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeScreen === 'app_narrative'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              <span>Narasi Fitur</span>
            </button>

            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center border border-teal-200">
                {currentUser?.name.charAt(0) || 'U'}
              </div>
              <div className="hidden lg:block text-xs">
                <p className="font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                  {currentUser?.name}
                </p>
                <p className="text-slate-500 text-[11px] leading-tight">
                  {currentUser?.levelTitle}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-12 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="font-medium text-slate-900">{currentUser?.name}</p>
                  <p className="text-slate-500">{currentUser?.email}</p>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-600">
                    <span>Level {currentUser?.level}</span>
                    <span className="font-semibold text-teal-700">{currentUser?.xp} XP</span>
                  </div>
                </div>

                {role === 'peserta' && (
                  <button
                    onClick={() => {
                      setCurrentScreen('student_dashboard');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    Profil & Pencapaian
                  </button>
                )}

                <button
                  onClick={() => {
                    setCurrentScreen('app_narrative');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-teal-800 font-medium cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                  Dokumen Narasi Fitur
                </button>

                <button
                  onClick={() => {
                    setCurrentScreen('public_verification');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Halaman Verifikasi Publik
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Keluar Akun
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Demo Switcher Modal (10 Akun PRD Hal 20) */}
      {isDemoMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Pilih Akun Demo Prototipe (PRD Hal 20)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  10 akun resmi yang mewakili setiap aktor dalam skenario pengujian SiLimbah.
                  Semua password default: <code className="bg-slate-100 px-1 py-0.5 rounded text-teal-700 font-mono">SiLimbah#2026</code>
                </p>
              </div>
              <button
                onClick={() => setIsDemoMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              {users.slice(0, 10).map((u) => {
                const isSelected = u.id === currentUser?.id;
                let statusBadge = '';
                if (u.username === 'peserta.lengkap') statusBadge = 'Sedang di BW-4 (Ada Alert Aktif)';
                else if (u.username === 'peserta.lulus') statusBadge = 'Lulus 100% · Siap Unduh Piagam';
                else if (u.username === 'peserta.bw') statusBadge = 'Jalur Black Water · Baru selesai BW-1';
                else if (u.username === 'peserta.gw') statusBadge = 'Jalur Grey Water · Sedang di GW-3';
                else if (u.username === 'iplt_tirta' || u.operatorId === 'iplt_tirta') statusBadge = 'IPLT Tirta · Lisensi Hampir Habis';

                return (
                  <div
                    key={u.id}
                    onClick={() => {
                      switchUser(u.username);
                      setIsDemoMenuOpen(false);
                    }}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{u.name}</span>
                        {isSelected && (
                          <span className="text-[10px] bg-teal-600 text-white px-1.5 py-0.5 rounded font-medium">
                            Aktif
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-slate-500">@{u.username}</span>
                    </div>

                    <p className="text-xs text-slate-600 mb-2">
                      <span className="font-medium text-slate-800 capitalize">
                        {u.role.replace('_', ' ')}
                      </span>
                      {u.classCohort ? ` · ${u.classCohort}` : ''}
                    </p>

                    {statusBadge && (
                      <p className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50 mb-2 font-medium">
                        {statusBadge}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <span>{u.levelTitle}</span>
                      <span className="font-semibold text-slate-700">{u.xp} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Skenario cepat: Login sebagai <strong>peserta.lengkap</strong> untuk simulasi alert, atau <strong>peserta.lulus</strong> untuk cek piagam.</span>
              <button
                onClick={() => setIsDemoMenuOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
