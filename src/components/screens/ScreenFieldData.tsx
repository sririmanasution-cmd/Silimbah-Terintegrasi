import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FieldFacility } from '../../types';
import {
  Building2,
  Plus,
  Calendar,
  Truck,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Activity,
  Download,
} from 'lucide-react';

export const ScreenFieldData: React.FC = () => {
  const { facilities, addFacility, currentOperator } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  // New facility form
  const [name, setName] = useState('');
  const [type, setType] = useState<'IPAL Komunal' | 'IPLT' | 'Tangki Septik Bersama'>('IPAL Komunal');
  const [capacity, setCapacity] = useState('150 KK (20 m3/hari)');
  const [location, setLocation] = useState('Desa Sukatani');
  const [bod, setBod] = useState('24');
  const [tss, setTss] = useState('22');

  const operatorFacilities = facilities.filter(
    (f) => !currentOperator || f.operatorId === currentOperator.id
  );

  const handleCreateFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addFacility({
      operatorId: currentOperator?.id || 'uptd_sukamaju',
      name,
      type,
      capacity,
      location,
      operationalStatus: 'Optimal',
      lastInspection: new Date().toISOString().split('T')[0],
      latestEffluentBOD: Number(bod) || 20,
      latestEffluentTSS: Number(tss) || 18,
    });

    setName('');
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
                Layar 15 · Data Lapangan IPAL & IPLT (FR-50 & FR-51)
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Inventarisasi Unit Instalasi & Log Uji Efluen
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencatatan fasilitas fisik pengolahan, ritase armada truk lumpur tinja, dan hasil uji laboratorium efluen lingkungan.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Unit Pengolahan</span>
          </button>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {operatorFacilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-teal-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{fac.name}</h3>
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {fac.location}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    fac.operationalStatus === 'Optimal'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {fac.operationalStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 text-[11px] block">Tipe Instalasi:</span>
                  <strong className="text-slate-800">{fac.type}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Kapasitas Desain:</span>
                  <strong className="text-slate-800">{fac.capacity}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Inspeksi Terakhir:</span>
                  <span className="font-mono text-slate-700">{fac.lastInspection}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Jadwal Sedot:</span>
                  <span className="text-slate-700 font-mono">
                    {fac.lastDesludgeDate || 'Siklus 2 Tahun'}
                  </span>
                </div>
              </div>

              {/* Lab Effluent Test Metrics */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-teal-600" />
                    Hasil Uji Mutu Efluen Terakhir:
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Permen LHK 68/2016</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex justify-between items-center">
                    <span className="text-slate-600">BOD Efluen:</span>
                    <span
                      className={`font-mono font-bold ${
                        (fac.latestEffluentBOD ?? 20) <= 30
                          ? 'text-teal-700'
                          : 'text-rose-600'
                      }`}
                    >
                      {fac.latestEffluentBOD ?? '—'} mg/L (≤30)
                    </span>
                  </div>

                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex justify-between items-center">
                    <span className="text-slate-600">TSS Efluen:</span>
                    <span
                      className={`font-mono font-bold ${
                        (fac.latestEffluentTSS ?? 18) <= 30
                          ? 'text-teal-700'
                          : 'text-rose-600'
                      }`}
                    >
                      {fac.latestEffluentTSS ?? '—'} mg/L (≤30)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Facility Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Daftarkan Fasilitas IPAL / IPLT Baru
            </h3>
            <p className="text-slate-500 mb-4">
              Data instalasi nyata ini akan terintegrasi menjadi studi kasus simulasi bagi peserta.
            </p>

            <form onSubmit={handleCreateFacility} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Instalasi:
                </label>
                <input
                  type="text"
                  required
                  placeholder="misal: IPAL Komunal Tirta Mekar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Instalasi:
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="IPAL Komunal">IPAL Komunal</option>
                    <option value="IPLT">IPLT (Lumpur Tinja)</option>
                    <option value="Tangki Septik Bersama">Tangki Septik Bersama</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kapasitas Desain:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="misal: 30 m3/hari"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lokasi / Alamat:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Kecamatan Sukamaju Selatan"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Uji BOD Efluen (mg/L):
                  </label>
                  <input
                    type="number"
                    value={bod}
                    onChange={(e) => setBod(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Uji TSS Efluen (mg/L):
                  </label>
                  <input
                    type="number"
                    value={tss}
                    onChange={(e) => setTss(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
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
                  Simpan Data Fasilitas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
