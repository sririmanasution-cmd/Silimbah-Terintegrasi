import React from 'react';
import { useApp } from '../../context/AppContext';
import { LearningTrack } from '../../types';
import { Droplets, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const ScreenTrackSelect: React.FC = () => {
  const { currentUser, setUserTrack, setCurrentScreen } = useApp();

  const handleSelect = (track: LearningTrack) => {
    if (currentUser) {
      setUserTrack(currentUser.id, track);
    }
  };

  const currentTrack = currentUser?.track;

  const tracks: {
    id: LearningTrack;
    title: string;
    subtitle: string;
    xpMax: string;
    missionsCount: string;
    targetAudience: string;
    color: string;
    features: string[];
  }[] = [
    {
      id: 'black_water',
      title: 'Jalur Black Water',
      subtitle: 'Pengelolaan Air Limbah Kakus & Lumpur Tinja',
      xpMax: '1.500 XP',
      missionsCount: 'Pre-Test + 5 Misi BW + Post-Test',
      targetAudience: 'Operator IPLT, staf armada truk penyedotan lumpur tinja, teknisi tangki septik',
      color: 'amber',
      features: [
        'Karakteristik biologis tinja & bakteri Coliform',
        'Perakitan tangki septik kedap air (SNI 2398:2017)',
        'Sistem Layanan Lumpur Tinja Terjadwal (L2T2)',
        'Pengoperasian SSC, Kolam Anaerobik & Sludge Drying Bed',
        'Penanganan krisis lonjakan & ambang BOD efluen',
      ],
    },
    {
      id: 'grey_water',
      title: 'Jalur Grey Water',
      subtitle: 'Pengolahan Air Limbah Non-Kakus & Daur Ulang',
      xpMax: '1.500 XP',
      missionsCount: 'Pre-Test + 5 Misi GW + Post-Test',
      targetAudience: 'Operator IPAL komunal permukiman, pengelola grease trap restoran, fasilitator sanitasi',
      color: 'teal',
      features: [
        'Karakteristik limbah dapur, deterjen fosfat & mandi',
        'Operasi & perawatan bak penangkap lemak (grease trap)',
        'Biofilter anaerob-aerobik dengan media sarang tawon',
        'Fitoremediasi Subsurface Flow Constructed Wetland',
        'Klorinasi aman pemanfaatan ulang untuk penyiraman taman',
      ],
    },
    {
      id: 'lengkap',
      title: 'Jalur Lengkap (Black & Grey)',
      subtitle: 'Kurikulum Menyeluruh Terpadu (Direkomendasikan)',
      xpMax: '3.150 XP',
      missionsCount: 'Pre-Test + 10 Misi (BW & GW) + Misi Final INT-1 + Post-Test',
      targetAudience: 'Operator UPTD PALD, staf teknis dinas PUPR/DLH, koordinator IPAL kawasan campuran',
      color: 'emerald',
      features: [
        'Menguasai seluruh 5 tingkatan Black Water & 5 tingkatan Grey Water',
        'Urutan belajar fleksibel antar modul BW dan GW',
        'Akses eksklusif Misi Final: INT-1 IPAL Komunal Kawasan Terpadu',
        'Peluang perolehan XP tertinggi (hingga 3.150 XP) & Gelar Ahli Sanitasi',
        'Piagam Lengkap Terpadu bernilai kompetensi menyeluruh',
      ],
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full mb-3 border border-teal-200">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Layar 2: Pemilihan Jalur Belajar
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Tentukan Jalur Pembelajaran Anda
          </h1>
          <p className="mt-2 text-base text-slate-600 max-w-2xl mx-auto">
            Pilih jalur spesialisasi sesuai tanggung jawab operasional Anda di lapangan.
            Progres misi yang sudah Anda kerjakan akan tetap tersimpan aman bila berpindah jalur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tracks.map((t) => {
            const isSelected = currentTrack === t.id;
            return (
              <div
                key={t.id}
                className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                  isSelected
                    ? 'border-teal-600 ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-6">
                  {t.id === 'lengkap' && (
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded mb-3 inline-block">
                      Paling Populer & Komprehensif
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{t.title}</h3>
                  <p className="text-xs text-slate-500 mb-4">{t.subtitle}</p>

                  <div className="bg-slate-50 rounded-xl p-3 mb-5 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Maksimum XP:</span>
                      <span className="font-bold text-teal-700">{t.xpMax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Struktur:</span>
                      <span className="font-medium text-slate-800">{t.missionsCount}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                      Cocok Untuk:
                    </p>
                    <p className="text-xs text-slate-700 leading-relaxed">{t.targetAudience}</p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
                      Materi Inti:
                    </p>
                    <ul className="space-y-2 text-xs text-slate-600">
                      {t.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  <button
                    onClick={() => handleSelect(t.id)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <span>{isSelected ? 'Jalur Terpilih (Lanjutkan)' : 'Pilih Jalur Ini'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {currentTrack && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setCurrentScreen('mission_map')}
              className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              Kembali ke Peta Misi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
