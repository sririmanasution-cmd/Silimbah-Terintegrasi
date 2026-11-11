import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Role, LearningTrack } from '../../types';
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  Trash2,
  Edit2,
  Building2,
  Search,
} from 'lucide-react';

export const ScreenAccountManagement: React.FC = () => {
  const { users, currentOperator, addUser, updateUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvText, setCsvText] = useState(
    'nama,email,username,role,jalur,angkatan\n"Rian Hidayat","rian@sukamaju.go.id","peserta.rian","peserta","lengkap","Angkatan 1 (2026)"\n"Siti Aminah","siti.a@sukamaju.go.id","peserta.siti","peserta","grey_water","Angkatan 1 (2026)"'
  );

  // Form State for Add User
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formRole, setFormRole] = useState<Role>('peserta');
  const [formTrack, setFormTrack] = useState<LearningTrack>('lengkap');
  const [formCohort, setFormCohort] = useState('Angkatan 1 (2026)');

  const operatorUsers = users.filter(
    (u) => !currentOperator || u.operatorId === currentOperator.id
  );

  const filteredUsers = operatorUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formUsername.trim()) return;

    addUser({
      name: formName,
      email: formEmail || `${formUsername}@operator.id`,
      username: formUsername.toLowerCase().trim(),
      role: formRole,
      track: formTrack,
      classCohort: formCohort,
      operatorId: currentOperator?.id || 'uptd_sukamaju',
    });

    setFormName('');
    setFormEmail('');
    setFormUsername('');
    setShowAddModal(false);
  };

  const handleCsvImport = () => {
    const lines = csvText.trim().split('\n');
    if (lines.length <= 1) return;

    // Skip header line
    lines.slice(1).forEach((line) => {
      const parts = line.split(',').map((p) => p.replace(/"/g, '').trim());
      if (parts.length >= 3) {
        addUser({
          name: parts[0],
          email: parts[1],
          username: parts[2].toLowerCase(),
          role: (parts[3] as Role) || 'peserta',
          track: (parts[4] as LearningTrack) || 'lengkap',
          classCohort: parts[5] || 'Angkatan 1 (2026)',
          operatorId: currentOperator?.id || 'uptd_sukamaju',
        });
      }
    });

    setShowCsvModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                Layar 13 · Kelola Akun & Kelas (Admin Operator)
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Manajemen Pengguna & Penetapan Jalur
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola akun peserta pelatihan, instruktur, pimpinan, dan penetapan jalur belajar.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCsvModal(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Impor CSV (FR-04)</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Akun Baru</span>
            </button>
          </div>
        </div>

        {/* Toolbar & Search */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, username, atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <span className="text-xs text-slate-400 font-mono">
            Total {filteredUsers.length} Akun Terdaftar
          </span>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 uppercase text-[11px] font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Nama & Username</th>
                  <th className="px-5 py-3.5">Peran (Role)</th>
                  <th className="px-5 py-3.5">Jalur Belajar (FR-05)</th>
                  <th className="px-5 py-3.5">Angkatan / Kelas</th>
                  <th className="px-5 py-3.5">Level & XP</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        @{u.username} · {u.email}
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="capitalize px-2 py-0.5 rounded font-medium text-slate-800 bg-slate-100">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      {u.role === 'peserta' ? (
                        <select
                          value={u.track || 'lengkap'}
                          onChange={(e) =>
                            updateUser(u.id, {
                              track: e.target.value as LearningTrack,
                            })
                          }
                          className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-teal-800 cursor-pointer"
                        >
                          <option value="black_water">Black Water</option>
                          <option value="grey_water">Grey Water</option>
                          <option value="lengkap">Lengkap</option>
                        </select>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-slate-600">
                      {u.classCohort || '—'}
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-slate-800">{u.levelTitle}</span>
                      <div className="text-[11px] text-teal-700 font-mono font-bold">
                        {u.xp} XP
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => {
                          const newName = prompt('Ubah nama lengkap:', u.name);
                          if (newName && newName.trim()) {
                            updateUser(u.id, { name: newName.trim() });
                          }
                        }}
                        className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal (FR-04) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Tambah Pengguna / Peserta Baru
            </h3>
            <p className="text-slate-500 mb-4">
              Pendaftaran akun staf operator {currentOperator?.name}. Kata sandi awal default: <code className="bg-slate-100 px-1 py-0.5 rounded text-teal-700 font-mono">SiLimbah#2026</code>.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap & Gelar
                </label>
                <input
                  type="text"
                  required
                  placeholder="misal: Wahyu Hidayat, A.Md"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="wahyu.hidayat"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Peran (Role)
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as Role)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="peserta">Peserta Operator</option>
                    <option value="instruktur">Instruktur</option>
                    <option value="admin_operator">Admin Operator</option>
                    <option value="pimpinan_operator">Pimpinan Operator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jalur Belajar (FR-05)
                  </label>
                  <select
                    value={formTrack}
                    onChange={(e) => setFormTrack(e.target.value as LearningTrack)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="lengkap">Jalur Lengkap</option>
                    <option value="black_water">Black Water</option>
                    <option value="grey_water">Grey Water</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Angkatan / Kelas
                  </label>
                  <input
                    type="text"
                    value={formCohort}
                    onChange={(e) => setFormCohort(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-100">
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
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal (FR-04) */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Upload className="w-5 h-5 text-teal-600" />
              Impor Akun Massal lewat CSV (FR-04)
            </h3>
            <p className="text-slate-500 mb-3">
              Tempelkan teks format CSV di bawah atau unggah berkas daftar peserta. Kolom wajib: <code>nama, email, username, role, jalur, angkatan</code>.
            </p>

            <textarea
              rows={6}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full p-3 font-mono text-[11px] bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-teal-500 mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setShowCsvModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleCsvImport}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl cursor-pointer"
              >
                Proses Impor CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
