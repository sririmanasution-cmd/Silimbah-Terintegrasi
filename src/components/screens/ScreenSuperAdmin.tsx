import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Operator, OperatorType } from '../../types';
import {
  Building2,
  Plus,
  Key,
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Search,
} from 'lucide-react';

export const ScreenSuperAdmin: React.FC = () => {
  const { operators, addOperator, renewOperatorLicense, users } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [renewingOp, setRenewingOp] = useState<Operator | null>(null);
  const [newExpiryDate, setNewExpiryDate] = useState('2028-12-31');

  // Form state
  const [opName, setOpName] = useState('');
  const [opType, setOpType] = useState<OperatorType>('UPTD PALD');
  const [opRegency, setOpRegency] = useState('');
  const [opQuota, setOpQuota] = useState('50');
  const [opExpiry, setOpExpiry] = useState('2027-12-31');
  const [opAddress, setOpAddress] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opName.trim() || !opRegency.trim()) return;

    addOperator({
      name: opName,
      type: opType,
      regency: opRegency,
      logoText: opName.toUpperCase().slice(0, 15),
      participantQuota: Number(opQuota) || 30,
      licenseExpiry: opExpiry,
      licenseStatus: 'active',
      address: opAddress || 'Komplek Perkantoran',
    });

    setOpName('');
    setOpRegency('');
    setShowAddModal(false);
  };

  const handleConfirmRenew = () => {
    if (renewingOp) {
      renewOperatorLicense(renewingOp.id, newExpiryDate);
      setRenewingOp(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-wider text-teal-300 bg-teal-500/20 px-2.5 py-0.5 rounded-full border border-teal-500/30">
                Portal Super Admin · Tim Penyedia SiLimbah
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Manajemen Multi-Tenant & Lisensi Operator (FR-03 & FR-42)
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Kelola tenant pelanggan (IPLT, IPAL Komunal, UPTD PALD), monitor utilisasi kuota peserta, dan perpanjang masa aktif lisensi.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Operator Baru</span>
          </button>
        </div>

        {/* Global Multi-Tenant Cross-Benchmark KPIs (PRD Bagian 7.3 & FR-42) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500">Total Operator Terlisensi</span>
            <p className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">
              {operators.length} Lembaga
            </p>
            <span className="text-[11px] text-teal-700 font-medium block mt-1">
              3 Jenis (UPTD PALD, IPLT, IPAL Komunal)
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500">Total Peserta Aktif Lintas Tenant</span>
            <p className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">
              {users.filter((u) => u.role === 'peserta').length} Operator Lapangan
            </p>
            <span className="text-[11px] text-slate-500 block mt-1">
              Dari kapasitas 90 kuota terdaftar
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500">Rata-rata Kenaikan Nilai Pelatihan</span>
            <p className="text-2xl font-extrabold text-emerald-600 font-mono mt-0.5">
              +29 Poin (Pre ➔ Post)
            </p>
            <span className="text-[11px] text-slate-500 block mt-1">
              Efektivitas pembelajaran bergamifikasi terbukti tinggi
            </span>
          </div>
        </div>

        {/* Operators List */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-700" />
            Daftar Operator Pelanggan & Status Lisensi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {operators.map((op) => {
              const opStudents = users.filter((u) => u.operatorId === op.id);
              const isExpiring = op.licenseStatus === 'expiring_soon';

              return (
                <div
                  key={op.id}
                  className={`bg-white rounded-3xl border p-6 flex flex-col justify-between shadow-xs transition-all ${
                    isExpiring ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {op.type}
                      </span>
                      {isExpiring ? (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Lisensi Hampir Habis
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Lisensi Aktif
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">{op.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{op.regency}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{op.address}</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Kuota Peserta:</span>
                        <strong className="text-slate-800 font-mono">
                          {opStudents.length} / {op.participantQuota}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Masa Berlaku:</span>
                        <strong className="font-mono text-slate-800">{op.licenseExpiry}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setRenewingOp(op)}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Key className="w-3.5 h-3.5 text-teal-400" />
                      <span>Perpanjang Lisensi</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Operator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Buat Operator Baru (Tenant SiLimbah)
            </h3>
            <p className="text-slate-500 mb-4">
              Daftarkan lembaga pengelola air limbah daerah untuk membuat ruang data terisolasi mandiri.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Resmi Operator:
                </label>
                <input
                  type="text"
                  required
                  placeholder="misal: UPTD PALD Kota Bandung"
                  value={opName}
                  onChange={(e) => setOpName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Lembaga:
                  </label>
                  <select
                    value={opType}
                    onChange={(e) => setOpType(e.target.value as OperatorType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="UPTD PALD">UPTD PALD</option>
                    <option value="IPLT">IPLT</option>
                    <option value="IPAL Komunal">IPAL Komunal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kabupaten / Kota:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Kota Bandung, Jabar"
                    value={opRegency}
                    onChange={(e) => setOpRegency(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kuota Akun Peserta:
                  </label>
                  <input
                    type="number"
                    value={opQuota}
                    onChange={(e) => setOpQuota(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Masa Berlaku Lisensi:
                  </label>
                  <input
                    type="date"
                    value={opExpiry}
                    onChange={(e) => setOpExpiry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Kantor:
                </label>
                <input
                  type="text"
                  placeholder="Jl. Raya No. 123"
                  value={opAddress}
                  onChange={(e) => setOpAddress(e.target.value)}
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
                  Simpan Operator Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Renew License Modal */}
      {renewingOp && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Key className="w-5 h-5 text-teal-600" />
              Perpanjang Lisensi Operator
            </h3>
            <p className="text-slate-500 mb-4">
              Perpanjangan lisensi untuk <strong>{renewingOp.name}</strong>.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Kadaluarsa Baru:
                </label>
                <input
                  type="date"
                  value={newExpiryDate}
                  onChange={(e) => setNewExpiryDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setRenewingOp(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmRenew}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl cursor-pointer"
              >
                Simpan Perpanjangan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
