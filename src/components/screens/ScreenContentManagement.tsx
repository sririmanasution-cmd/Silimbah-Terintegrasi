import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuizQuestion } from '../../types';
import {
  BookOpen,
  HelpCircle,
  Plus,
  Upload,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';

export const ScreenContentManagement: React.FC = () => {
  const { questions, missions, currentOperator } = useApp();
  const [activeTab, setActiveTab] = useState<'soal' | 'narasi_objek' | 'studi_kasus'>('soal');
  const [questionList, setQuestionList] = useState<QuizQuestion[]>(questions);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);

  // New Question Form
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptionA, setNewOptionA] = useState('');
  const [newOptionB, setNewOptionB] = useState('');
  const [newOptionC, setNewOptionC] = useState('');
  const [newOptionD, setNewOptionD] = useState('');
  const [newCorrectIndex, setNewCorrectIndex] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');
  const [newTrack, setNewTrack] = useState<'black_water' | 'grey_water' | 'lengkap' | 'all'>('all');

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !newOptionA.trim()) return;

    const newQ: QuizQuestion = {
      id: questionList.length + 1,
      track: newTrack,
      level: 1,
      question: newQuestionText,
      options: [newOptionA, newOptionB, newOptionC, newOptionD],
      correctIndex: newCorrectIndex,
      explanation: newExplanation || 'Kunci jawaban mengacu pada regulasi baku mutu nasional.',
    };

    setQuestionList([newQ, ...questionList]);
    setNewQuestionText('');
    setNewOptionA('');
    setNewOptionB('');
    setNewOptionC('');
    setNewOptionD('');
    setNewExplanation('');
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                Layar 14 · Kelola Konten & Bank Soal (Instruktur)
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Pusat Kurikulum & Bank Soal Sanitasi
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola materi, narasi objek instalasi, studi kasus lokal, dan bank soal evaluasi (FR-25, FR-31, FR-33).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExcelModal(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Impor Excel Soal (FR-33)</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Butir Soal</span>
            </button>
          </div>
        </div>

        {/* Tab selection */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex items-center gap-2">
          <button
            onClick={() => setActiveTab('soal')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              activeTab === 'soal'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bank Soal Evaluasi ({questionList.length})
          </button>
          <button
            onClick={() => setActiveTab('narasi_objek')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              activeTab === 'narasi_objek'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Narasi Objek Pop-up (FR-25)
          </button>
          <button
            onClick={() => setActiveTab('studi_kasus')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              activeTab === 'studi_kasus'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Studi Kasus & Data Lapangan Lokal
          </button>
        </div>

        {/* Tab 1: Bank Soal */}
        {activeTab === 'soal' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                Daftar Soal Pilihan Ganda Terdistribusi
              </span>
              <span className="text-slate-400 font-mono">
                Soal diacak otomatis saat ujian berlangsung (FR-31)
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {questionList.map((q, idx) => (
                <div key={q.id} className="p-5 hover:bg-slate-50/70 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                      <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500">
                        Jalur: {q.track}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert(`Pratinjau Kunci: Pilihan [${['A','B','C','D'][q.correctIndex]}] - ${q.explanation}`)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-[11px] font-medium cursor-pointer"
                      >
                        Lihat Kunci & Penjelasan
                      </button>
                    </div>
                  </div>

                  <p className="font-semibold text-slate-900 text-sm leading-relaxed">
                    {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                          optIdx === q.correctIndex
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="font-mono font-bold w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          {['A', 'B', 'C', 'D'][optIdx]}
                        </span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 italic pt-1">
                    Catatan Pembahasan: {q.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Narasi Objek */}
        {activeTab === 'narasi_objek' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Narasi Pop-up: Tangki Septik Kedap (SNI 2398:2017)
              </h3>
              <p className="text-xs text-slate-500">
                Dapat diedit oleh instruktur untuk menyelaraskan dengan konteks lokal daerah (FR-25).
              </p>
              <textarea
                rows={5}
                defaultValue="Tangki septik berfungsi mengendapkan padatan tinja secara anaerobik. Dinding wajib kedap air untuk mencegah pencemaran bakteri Coliform ke sumur warga."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
              />
              <button
                onClick={() => alert('Narasi objek berhasil diperbarui untuk operator Anda.')}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Simpan Narasi Tangki
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Narasi Pop-up: Grease Trap Dapur (Pemisah Minyak)
              </h3>
              <p className="text-xs text-slate-500">
                Peringatan wajib pembersihan saat lapisan minyak mencapai 25% kapasitas.
              </p>
              <textarea
                rows={5}
                defaultValue="Grease trap menahan lapisan minyak dan lemak agar tidak membeku di pipa pembuangan dan tidak menyumbat pori biofilter lekat."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
              />
              <button
                onClick={() => alert('Narasi grease trap berhasil disimpan.')}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Simpan Narasi Grease Trap
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Studi Kasus */}
        {activeTab === 'studi_kasus' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Studi Kasus Lapangan: IPLT Betoyoguci Gresik (Kapasitas 11%)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Data riil membuktikan bahwa tanpa integrasi penjadwalan penyedotan (L2T2), fasilitas pengolahan lumpur tinja yang bernilai miliaran rupiah seringkali mangkrak dan hanya beroperasi di bawah 15% dari kapasitas desain.
            </p>
            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-900">
              Instruktur dapat mengunggah lembar studi kasus lokal tambahan untuk memperkaya skenario misi BW-5 dan GW-5.
            </div>
          </div>
        )}
      </div>

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-xs max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Tambah Butir Soal Baru ke Bank Soal
            </h3>

            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pertanyaan:
                </label>
                <textarea
                  required
                  rows={3}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Tuliskan teks soal pilihan ganda..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Pilihan A:
                  </label>
                  <input
                    type="text"
                    required
                    value={newOptionA}
                    onChange={(e) => setNewOptionA(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Pilihan B:
                  </label>
                  <input
                    type="text"
                    required
                    value={newOptionB}
                    onChange={(e) => setNewOptionB(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Pilihan C:
                  </label>
                  <input
                    type="text"
                    required
                    value={newOptionC}
                    onChange={(e) => setNewOptionC(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Pilihan D:
                  </label>
                  <input
                    type="text"
                    required
                    value={newOptionD}
                    onChange={(e) => setNewOptionD(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Kunci Jawaban Benar:
                  </label>
                  <select
                    value={newCorrectIndex}
                    onChange={(e) => setNewCorrectIndex(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value={0}>Pilihan A</option>
                    <option value={1}>Pilihan B</option>
                    <option value={2}>Pilihan C</option>
                    <option value={3}>Pilihan D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Jalur Materi:
                  </label>
                  <select
                    value={newTrack}
                    onChange={(e) => setNewTrack(e.target.value as 'black_water' | 'grey_water' | 'all')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="all">Semua Jalur (Umum)</option>
                    <option value="black_water">Black Water (Tinja/IPLT)</option>
                    <option value="grey_water">Grey Water (Dapur/Biofilter)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Penjelasan / Pembahasan:
                </label>
                <input
                  type="text"
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="Rujukan regulasi Permen LHK 68/2016..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  Simpan Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Excel Import Simulation Modal (FR-33) */}
      {showExcelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              Impor Bank Soal dari Berkas Excel (FR-33)
            </h3>
            <p className="text-slate-500 mb-4">
              Instruktur dapat mengunggah berkas template Excel (.xlsx) dengan kolom: Soal, Opsi A, B, C, D, Kunci, dan Penjelasan.
            </p>

            <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl text-center bg-slate-50 hover:bg-slate-100 cursor-pointer mb-4">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-1" />
              <span className="font-semibold text-slate-700 block">
                Pilih berkas bank_soal_sanitasi.xlsx
              </span>
              <span className="text-[10px] text-slate-400">Ukuran maksimal 5MB</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowExcelModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  alert('Simulasi impor 5 butir soal baru dari Excel berhasil diproses!');
                  setShowExcelModal(false);
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer"
              >
                Mulai Impor Soal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
