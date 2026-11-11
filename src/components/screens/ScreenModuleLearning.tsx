import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BAKU_MUTU_REGULATION } from '../../data/mockData';
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Play,
  Film,
  Sparkles,
  Info,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';

export const ScreenModuleLearning: React.FC = () => {
  const { activeMissionId, missions, setCurrentScreen, startExam } = useApp();
  const [activeTab, setActiveTab] = useState<'teori' | 'studi_kasus' | 'baku_mutu' | 'video'>('teori');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const mission = missions.find((m) => m.id === activeMissionId) || missions[1];

  const handleProceedToChallenge = () => {
    if (mission.type === 'simulation' || mission.type === 'drag_drop') {
      setCurrentScreen('simulation');
    } else if (mission.type === 'quiz') {
      startExam('mission_quiz', mission.id);
    } else {
      startExam(mission.type, mission.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentScreen('mission_briefing')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Briefing ({mission.id})</span>
          </button>

          <span className="text-xs text-slate-400 font-mono">
            Modul Teori Sanitasi Terakreditasi
          </span>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                  {mission.id} · {mission.levelLabel}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {mission.track === 'black_water'
                    ? 'Black Water'
                    : mission.track === 'grey_water'
                    ? 'Grey Water'
                    : 'Kawasan Terpadu'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{mission.title}</h1>
              <p className="text-xs text-slate-500 mt-0.5">{mission.subtitle}</p>
            </div>

            <button
              onClick={handleProceedToChallenge}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
            >
              <span>Lanjut ke Praktik Misi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="bg-slate-50 px-6 py-2 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('teori')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'teori'
                  ? 'bg-white text-teal-800 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Prinsip & Teori Utama
            </button>
            <button
              onClick={() => setActiveTab('studi_kasus')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'studi_kasus'
                  ? 'bg-white text-teal-800 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Studi Kasus Lapangan
            </button>
            <button
              onClick={() => setActiveTab('baku_mutu')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'baku_mutu'
                  ? 'bg-white text-teal-800 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Baku Mutu (Permen LHK 68/2016)
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'video'
                  ? 'bg-white text-teal-800 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Video Simulasi Lapangan
            </button>
          </div>

          {/* Tab 1: Teori & Prinsip Utama */}
          {activeTab === 'teori' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="bg-teal-50/50 border border-teal-200/60 rounded-2xl p-5">
                <h3 className="text-base font-bold text-teal-950 mb-2">
                  {mission.theorySummary.mainConcept}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Penguasaan siklus air limbah domestik menuntut ketepatan identifikasi dari sumber buangan hingga unit pembuangan akhir untuk menjaga baku mutu lingkungan hidup.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3">
                  Poin Kunci & Prosedur Standar Operasional:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mission.theorySummary.keyPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Diagram Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
                    Diagram Alir Proses Pengolahan
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">Bagan Alir Teknis</span>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center text-xs py-4 px-2 bg-slate-950/70 rounded-xl border border-slate-800">
                  {mission.track === 'black_water' ? (
                    <>
                      <div className="p-3 bg-slate-800 rounded-lg flex-1">
                        <p className="font-bold text-amber-400">Sumber: Kloset</p>
                        <p className="text-[11px] text-slate-400">Tinja & Urin (BOD pekat)</p>
                      </div>
                      <span className="text-slate-500 font-bold hidden md:inline">➔</span>
                      <div className="p-3 bg-slate-800 rounded-lg flex-1">
                        <p className="font-bold text-teal-400">Tangki Septik SNI</p>
                        <p className="text-[11px] text-slate-400">Pemisahan Endap & Fermentasi</p>
                      </div>
                      <span className="text-slate-500 font-bold hidden md:inline">➔</span>
                      <div className="p-3 bg-slate-800 rounded-lg flex-1">
                        <p className="font-bold text-blue-400">Truk Sedot Vakum</p>
                        <p className="text-[11px] text-slate-400">Ritase Terjadwal L2T2</p>
                      </div>
                      <span className="text-slate-500 font-bold hidden md:inline">➔</span>
                      <div className="p-3 bg-slate-800 rounded-lg flex-1">
                        <p className="font-bold text-emerald-400">Instalasi IPLT</p>
                        <p className="text-[11px] text-slate-400">SSC, Kolam & Pengering Cake</p>
                      </div>
                    </>
                  ) : mission.track === 'grey_water' ? (
                    <>
                      <div className="p-3 bg-slate-800 rounded-lg flex-1">
                        <p className="font-bold text-teal-400">Dapur / Cuci Mandi</p>
                        <p className="text-[11px] text-slate-400">Minyak, Lemak & Surfaktan</p>
                      </div>
                      <span className="text-slate-500 font-bold hidden md:inline">➔</span>
                      <div className="p-3 bg-slate-800 rounded-lg flex-1">
                        <p className="font-bold text-amber-400">Grease Trap</p>
                        <p className="text-[11px] text-slate-400">Tangkap Lemak Bebas &lt;25%</p>
                      </div>
                      <span className="text-slate-500 font-bold hidden md:inline">➔</span>
                      <div className="p-3 bg-slate-800 rounded-lg flex-1">
                        <p className="font-bold text-blue-400">Biofilter / ABR</p>
                        <p className="text-[11px] text-slate-400">Media Lekat Sarang Tawon</p>
                      </div>
                      <span className="text-slate-500 font-bold hidden md:inline">➔</span>
                      <div className="p-3 bg-slate-800 rounded-lg flex-1">
                        <p className="font-bold text-emerald-400">Wetland & Reuse</p>
                        <p className="text-[11px] text-slate-400">Fitoremediasi & Desinfeksi</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-slate-800 rounded-lg flex-1">
                        <p className="font-bold text-amber-400">Black + Grey Water</p>
                        <p className="text-[11px] text-slate-400">Pemisahan di Sumber</p>
                      </div>
                      <span className="text-slate-500 font-bold hidden md:inline">➔</span>
                      <div className="p-3 bg-slate-800 rounded-lg flex-1">
                        <p className="font-bold text-teal-400">Jaringan SPALD-T</p>
                        <p className="text-[11px] text-slate-400">Kemiringan 1-2% Gravitasi</p>
                      </div>
                      <span className="text-slate-500 font-bold hidden md:inline">➔</span>
                      <div className="p-3 bg-slate-800 rounded-lg flex-1">
                        <p className="font-bold text-blue-400">Reaktor Biologis Komunal</p>
                        <p className="text-[11px] text-slate-400">ABR & Aerasi Terkendali</p>
                      </div>
                      <span className="text-slate-500 font-bold hidden md:inline">➔</span>
                      <div className="p-3 bg-slate-800 rounded-lg flex-1">
                        <p className="font-bold text-emerald-400">Bio-Indikator & Efluen</p>
                        <p className="text-[11px] text-slate-400">Kolam Ikan Sehat & Uji Lab</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Studi Kasus Lapangan */}
          {activeTab === 'studi_kasus' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Dokumentasi Lapangan
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2 mb-2">
                  {mission.theorySummary.caseStudyTitle}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {mission.theorySummary.caseStudyContent}
                </p>
              </div>

              {/* Real lesson learned from W3 references */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">
                  Pelajaran Manajerial dari Kasus Lapangan:
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Optimalisasi Kapasitas:</strong> Banyak IPLT di Indonesia hanya beroperasi 10-20% dari kapasitas desain karena tidak ada program penyedotan berkala (L2T2). Pembiasaan sistem digital mampu mendongkrak utilitas hingga 80%.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Pencegahan Kebocoran:</strong> Tangki septik yang tidak kedap mencemari air tanah dalam radius 10-15 meter, mengancam kualitas air minum sumur warga sekitar.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Integritas Baffle:</strong> Kegagalan membersihkan grease trap menyebabkan minyak membatu dan mematikan koloni mikroba di reaktor biologis lanjutan.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 3: Baku Mutu Permen LHK 68/2016 */}
          {activeTab === 'baku_mutu' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {BAKU_MUTU_REGULATION.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {BAKU_MUTU_REGULATION.subject}
                  </p>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-semibold">
                  Standar Wajib Nasional
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100/80 text-slate-800 uppercase font-semibold text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Parameter Kunci</th>
                      <th className="px-4 py-3">Batas Baku Mutu</th>
                      <th className="px-4 py-3">Satuan</th>
                      <th className="px-4 py-3">Keterangan Dampak Lingkungan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {BAKU_MUTU_REGULATION.parameters.map((param, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-900">{param.name}</td>
                        <td className="px-4 py-3 font-mono font-bold text-teal-700">{param.limit}</td>
                        <td className="px-4 py-3 text-slate-500">{param.unit}</td>
                        <td className="px-4 py-3 text-slate-500 text-[11px]">
                          {param.name.includes('BOD') && 'Menjamin pasokan oksigen biota sungai'}
                          {param.name.includes('pH') && 'Mencegah korosi & iritasi biota'}
                          {param.name.includes('COD') && 'Beban zat kimia oksidabel terlarut'}
                          {param.name.includes('TSS') && 'Kekeruhan dan endapan lumpur dasar'}
                          {param.name.includes('Minyak') && 'Mencegah lapisan minyak menghalangi udara'}
                          {param.name.includes('Coliform') && 'Pencegahan penyebaran wabah patogen tinja'}
                          {param.name.includes('Amoniak') && 'Toksisitas akut ikan dan bau busuk'}
                          {param.name.includes('Debit') && 'Kapasitas hidrolis saluran permukiman'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Video Simulasi Lapangan */}
          {activeTab === 'video' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 text-center relative aspect-video flex flex-col items-center justify-center p-6">
                {!isVideoPlaying ? (
                  <div className="space-y-4 max-w-md">
                    <div className="w-16 h-16 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg hover:scale-110 transition-transform cursor-pointer"
                      onClick={() => setIsVideoPlaying(true)}
                    >
                      <Play className="w-8 h-8 fill-slate-950 ml-1" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base">
                        SOP Lapangan: {mission.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Video instruksional animasi berdurasi 3:45 menit mengenai tata cara inspeksi, deteksi alert, dan respon unit pengolahan.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col justify-between p-4 text-left">
                    <div className="flex items-center justify-between text-xs text-teal-400 font-mono">
                      <span>▶ SEDANG MEMUTAR: DEMONSTRASI OPERASIONAL 1080P</span>
                      <button
                        onClick={() => setIsVideoPlaying(false)}
                        className="text-slate-400 hover:text-white cursor-pointer"
                      >
                        Tutup Pemutar
                      </button>
                    </div>
                    <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 max-w-lg">
                      <p className="text-white text-xs font-semibold">
                        Langkah 1: Periksa ketebalan lumpur di chamber utama.
                      </p>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Pastikan petugas menggunakan APD lengkap: sarung tangan nitril, masker respirator, dan rompi keselamatan.
                      </p>
                    </div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-teal-400 h-full w-2/3 animate-pulse" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Bar */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentScreen('mission_briefing')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Kembali ke Briefing
            </button>

            <button
              onClick={handleProceedToChallenge}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
            >
              <span>Lanjutkan ke Simulasi & Ujian</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
