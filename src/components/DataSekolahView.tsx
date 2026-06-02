import React, { useState } from 'react';
import { Sekolah } from '../types';
import { Search, Plus, Edit2, Trash2, X, GraduationCap, MapPin, Loader2 } from 'lucide-react';

interface DataSekolahViewProps {
  sekolahList: Sekolah[];
  onAddSekolah: (sekolah: Sekolah) => void;
  onEditSekolah: (sekolah: Sekolah) => void;
  onDeleteSekolah: (id: string) => void;
}

export default function DataSekolahView({ 
  sekolahList, 
  onAddSekolah, 
  onEditSekolah, 
  onDeleteSekolah 
}: DataSekolahViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('Semua');

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'tambah' | 'edit'>('tambah');
  const [currentItem, setCurrentItem] = useState<Sekolah | null>(null);

  // Form states
  const [formNama, setFormNama] = useState('');
  const [formProvinsi, setFormProvinsi] = useState('DKI Jakarta');
  const [formKabupaten, setFormKabupaten] = useState('');
  const [formSiswa, setFormSiswa] = useState(100);

  // Filter list
  const filteredList = sekolahList.filter(item => {
    const matchesSearch = item.nama_sekolah.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.kabupaten.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvince = selectedProvince === 'Semua' || item.provinsi === selectedProvince;
    return matchesSearch && matchesProvince;
  });

  const uniqueProvinces = Array.from(new Set(sekolahList.map(s => s.provinsi)));

  const handleOpenAdd = () => {
    setModalMode('tambah');
    setFormNama('');
    setFormProvinsi('DKI Jakarta');
    setFormKabupaten('');
    setFormSiswa(150);
    setCurrentItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sekolah: Sekolah) => {
    setModalMode('edit');
    setCurrentItem(sekolah);
    setFormNama(sekolah.nama_sekolah);
    setFormProvinsi(sekolah.provinsi);
    setFormKabupaten(sekolah.kabupaten);
    setFormSiswa(sekolah.jumlah_siswa);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama || !formKabupaten) {
      alert('Mohon isi semua field nama sekolah dan kabupaten/kota!');
      return;
    }

    if (modalMode === 'tambah') {
      const newId = `SCH-${String(sekolahList.length + 1).padStart(3, '0')}`;
      const newSekolah: Sekolah = {
        id_sekolah: newId,
        nama_sekolah: formNama,
        provinsi: formProvinsi,
        kabupaten: formKabupaten,
        jumlah_siswa: formSiswa
      };
      onAddSekolah(newSekolah);
    } else if (modalMode === 'edit' && currentItem) {
      const updatedSekolah: Sekolah = {
        ...currentItem,
        nama_sekolah: formNama,
        provinsi: formProvinsi,
        kabupaten: formKabupaten,
        jumlah_siswa: formSiswa
      };
      onEditSekolah(updatedSekolah);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6" id="data-sekolah-view-root">
      
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-gray-900 flex items-center gap-2">
            <GraduationCap className="text-emerald-600" />
            Database Sekolah Terdaftar
          </h2>
          <p className="text-sm text-gray-500">
            Kelola data sekolah mitra penerima manfaat program Makan Bergizi Gratis (MBG) Nasional.
          </p>
        </div>

        <button 
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus size={18} /> Tambah Sekolah Baru
        </button>
      </div>

      {/* Searching and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
          <input
            type="text"
            placeholder="Cari nama sekolah, kabupaten..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Provinsi:</span>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 cursor-pointer"
          >
            <option value="Semua">Semua Provinsi</option>
            {uniqueProvinces.map(prov => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="py-3 px-4">ID Sekolah</th>
                <th className="py-3 px-4">Nama Sekolah</th>
                <th className="py-3 px-4">Provinsi</th>
                <th className="py-3 px-4">Kabupaten / Kota</th>
                <th className="py-3 px-4 text-right">Jumlah Siswa</th>
                <th className="py-3 px-4 text-center">Aksi Manajemen</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {filteredList.map((sch) => (
                <tr key={sch.id_sekolah} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-800 text-xs">
                    {sch.id_sekolah}
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    {sch.nama_sekolah}
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={13} className="text-slate-400" />
                      {sch.provinsi}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {sch.kabupaten}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-gray-900">
                    {sch.jumlah_siswa.toLocaleString('id-ID')} Siswa
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleOpenEdit(sch)}
                        title="Edit data sekolah"
                        className="p-1 px-2.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-emerald-700 transition-colors border border-transparent hover:border-gray-100"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`Apakah Anda yakin ingin menghapus ${sch.nama_sekolah}? Semua data distribusi terkait juga akan terhapus.`)) {
                            onDeleteSekolah(sch.id_sekolah);
                          }
                        }}
                        title="Hapus data sekolah"
                        className="p-1 px-2.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors border border-transparent hover:border-rose-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    Tidak ditemukan data sekolah yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table summary stats */}
        <div className="bg-gray-50/50 p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            Menampilkan <strong>{filteredList.length}</strong> dari total <strong>{sekolahList.length}</strong> sekolah mitra.
          </div>
          <div>
            Rata-rata siswa per sekolah: <strong>{Math.round(sekolahList.reduce((acc,s)=>acc+s.jumlah_siswa,0)/sekolahList.length)} Siswa</strong>
          </div>
        </div>
      </div>

      {/* CRUD Add/Edit Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-base text-gray-900 font-display">
                {modalMode === 'tambah' ? 'Tambah Sekolah Penerima MBG Baru' : 'Perbarui Informasi Sekolah'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-5 space-y-4">
              
              {/* Nama Sekolah */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">Nama Institusi Sekolah</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. SDN 01 Keputran"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Grid: Provinsi & Kabupaten */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">Provinsi</label>
                  <select 
                    value={formProvinsi}
                    onChange={(e) => setFormProvinsi(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="DKI Jakarta">DKI Jakarta</option>
                    <option value="Jawa Barat">Jawa Barat</option>
                    <option value="Jawa Tengah">Jawa Tengah</option>
                    <option value="Jawa Timur">Jawa Timur</option>
                    <option value="Bali">Bali</option>
                    <option value="Sulawesi Selatan">Sulawesi Selatan</option>
                    <option value="Papua">Papua</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">Kabupaten / Kota</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Bandung"
                    value={formKabupaten}
                    onChange={(e) => setFormKabupaten(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Jumlah Siswa */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">Jumlah Siswa Terdaftar</label>
                <input 
                  type="number"
                  required
                  min={10}
                  max={5000}
                  placeholder="e.g. 350"
                  value={formSiswa}
                  onChange={(e) => setFormSiswa(Number(e.target.value))}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-slate-50 rounded-lg border border-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                >
                  {modalMode === 'tambah' ? 'Simpan Sekolah' : 'Simpan Perubahan'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
