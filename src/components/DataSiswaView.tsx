import React, { useState } from 'react';
import { Sekolah } from '../types';
import { Search, Check, AlertCircle, RefreshCw, Filter, Users } from 'lucide-react';

interface DataSiswaViewProps {
  sekolahList: Sekolah[];
}

interface StudentRecord {
  id_siswa: string;
  nama: string;
  kelas: string;
  id_sekolah: string;
  nama_sekolah: string;
  tingkat: 'SD' | 'SMP' | 'SMA';
  sudah_menerima: boolean;
  status_gizi: 'Sesuai' | 'Kurang' | 'Lebih';
  alergi: string;
}

export default function DataSiswaView({ sekolahList }: DataSiswaViewProps) {
  // Let's seed some realistic student records for the selected schools
  const [students, setStudents] = useState<StudentRecord[]>([
    { id_siswa: 'SIS-001', nama: 'Andi Pratama', kelas: '1-A', id_sekolah: 'SCH-001', nama_sekolah: 'SDN 01 Menteng', tingkat: 'SD', sudah_menerima: true, status_gizi: 'Sesuai', alergi: 'Tidak Ada' },
    { id_siswa: 'SIS-002', nama: 'Budi Santoso', kelas: '1-A', id_sekolah: 'SCH-001', nama_sekolah: 'SDN 01 Menteng', tingkat: 'SD', sudah_menerima: true, status_gizi: 'Kurang', alergi: 'Kacang' },
    { id_siswa: 'SIS-003', nama: 'Citra Amelia', kelas: '2-B', id_sekolah: 'SCH-001', nama_sekolah: 'SDN 01 Menteng', tingkat: 'SD', sudah_menerima: false, status_gizi: 'Sesuai', alergi: 'Seafood' },
    { id_siswa: 'SIS-004', nama: 'Dewi Lestari', kelas: '3-A', id_sekolah: 'SCH-001', nama_sekolah: 'SDN 01 Menteng', tingkat: 'SD', sudah_menerima: true, status_gizi: 'Lebih', alergi: 'Tidak Ada' },
    { id_siswa: 'SIS-005', nama: 'Eko Prasetyo', kelas: '7-C', id_sekolah: 'SCH-002', nama_sekolah: 'SMPN 115 Jakarta', tingkat: 'SMP', sudah_menerima: true, status_gizi: 'Sesuai', alergi: 'Susu Sapi' },
    { id_siswa: 'SIS-006', nama: 'Fajar Nugraha', kelas: '8-A', id_sekolah: 'SCH-002', nama_sekolah: 'SMPN 115 Jakarta', tingkat: 'SMP', sudah_menerima: false, status_gizi: 'Sesuai', alergi: 'Tidak Ada' },
    { id_siswa: 'SIS-007', nama: 'Gita Savitri', kelas: '9-B', id_sekolah: 'SCH-002', nama_sekolah: 'SMPN 115 Jakarta', tingkat: 'SMP', sudah_menerima: true, status_gizi: 'Lebih', alergi: 'Tidak Ada' },
    { id_siswa: 'SIS-008', nama: 'Hendra Wijaya', kelas: '4-A', id_sekolah: 'SCH-003', nama_sekolah: 'SD Negeri Siliwangi', tingkat: 'SD', sudah_menerima: false, status_gizi: 'Kurang', alergi: 'Tidak Ada' },
    { id_siswa: 'SIS-009', nama: 'Indah Permata', kelas: '5-B', id_sekolah: 'SCH-003', nama_sekolah: 'SD Negeri Siliwangi', tingkat: 'SD', sudah_menerima: true, status_gizi: 'Sesuai', alergi: 'Kacang' },
    { id_siswa: 'SIS-010', nama: 'Joko Widodo', kelas: '9-A', id_sekolah: 'SCH-004', nama_sekolah: 'SMPN 1 Bandung', tingkat: 'SMP', sudah_menerima: true, status_gizi: 'Sesuai', alergi: 'Tidak Ada' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState('Semua');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('Semua');

  // Interactive toggle check callback
  const handleToggleReceipt = (idSiswa: string) => {
    setStudents(prev => prev.map(student => {
      if (student.id_siswa === idSiswa) {
        return { ...student, sudah_menerima: !student.sudah_menerima };
      }
      return student;
    }));
  };

  // Quick action: mark all as received or reset
  const handleMarkAll = (status: boolean) => {
    setStudents(prev => prev.map(student => {
      // Apply filter matching conditions
      const matchesSchool = selectedSchoolFilter === 'Semua' || student.id_sekolah === selectedSchoolFilter;
      if (matchesSchool) {
        return { ...student, sudah_menerima: status };
      }
      return student;
    }));
  };

  // Filters logic
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.alergi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.kelas.includes(searchQuery);
    const matchesSchool = selectedSchoolFilter === 'Semua' || student.id_sekolah === selectedSchoolFilter;
    const matchesStatus = selectedStatusFilter === 'Semua' || 
                          (selectedStatusFilter === 'Sudah' && student.sudah_menerima) || 
                          (selectedStatusFilter === 'Belum' && !student.sudah_menerima);

    return matchesSearch && matchesSchool && matchesStatus;
  });

  // Calculate stats
  const totalInFilter = filteredStudents.length;
  const totalSudah = filteredStudents.filter(s => s.sudah_menerima).length;
  const totalBelum = totalInFilter - totalSudah;
  const progressRatio = totalInFilter > 0 ? Math.round((totalSudah / totalInFilter) * 100) : 0;

  return (
    <div className="space-y-6" id="data-siswa-view-root">
      
      {/* Header section */}
      <div>
        <h2 className="text-xl font-bold font-display text-gray-900 flex items-center gap-2">
          <Users className="text-emerald-600" />
          Absensi & Penyaluran Porsi Siswa
        </h2>
        <p className="text-sm text-gray-500">
          Simulasi verifikasi & penyerahan porsi makan siang bergizi langsung di tingkat kelas (Absensi Guru Kelas).
        </p>
      </div>

      {/* Progress Card */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Hasil Penyaluran Hari Ini
          </span>
          <h3 className="text-2xl font-bold font-display mt-2">
            Proses Checkout Porsi Siswa
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Persentase porsi yang telah diserahkan di tangan siswa dari absensi terdaftar.
          </p>
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto">
          {/* Circular progress loader */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="26" stroke="#1e293b" strokeWidth="4" fill="transparent" />
                <circle cx="32" cy="32" r="26" stroke="#10b981" strokeWidth="5" fill="transparent" 
                  strokeDasharray={163.3}
                  strokeDashoffset={163.3 - (163.3 * progressRatio) / 100}
                />
              </svg>
              <span className="absolute text-xs font-bold font-display">{progressRatio}%</span>
            </div>
            <div>
              <p className="text-lg font-bold font-display text-white">{totalSudah} <span className="text-xs text-slate-400">/ {totalInFilter} Siswa</span></p>
              <p className="text-[11px] text-slate-400">Porsi sudah checkout</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 justify-end">
            <button 
              onClick={() => handleMarkAll(true)}
              className="px-3 py-1 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold rounded-md hover:bg-emerald-600/30 transition-all"
            >
              Check All Sudah
            </button>
            <button 
              onClick={() => handleMarkAll(false)}
              className="px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-bold rounded-md hover:bg-slate-700 transition-all"
            >
              Reset Semua Absen
            </button>
          </div>
        </div>
      </div>

      {/* Control panel & Sorting */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Cari siswa, kelas, alergi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filters Selects */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto md:justify-end text-xs">
          {/* School filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-bold block">Sekolah:</span>
            <select
              value={selectedSchoolFilter}
              onChange={(e) => setSelectedSchoolFilter(e.target.value)}
              className="border border-gray-200 bg-gray-50 rounded-lg px-2.5 py-1.5 focus:outline-none text-xs font-semibold cursor-pointer"
            >
              <option value="Semua">Semua Sekolah</option>
              {sekolahList.map(s => (
                <option key={s.id_sekolah} value={s.id_sekolah}>{s.nama_sekolah}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-bold block">Status Makan:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="border border-gray-200 bg-gray-50 rounded-lg px-2.5 py-1.5 focus:outline-none text-xs font-semibold cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="Sudah">Sudah Mengambil</option>
              <option value="Belum">Belum Mengambil</option>
            </select>
          </div>
        </div>
      </div>

      {/* Checklist Grid cards (Optimized for desktop presentation + quick touch) */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredStudents.map(student => (
            <div 
              key={student.id_siswa}
              onClick={() => handleToggleReceipt(student.id_siswa)}
              className={`border rounded-xl p-3.5 cursor-pointer flex items-center justify-between gap-4 transition-all duration-200 select-none ${
                student.sudah_menerima 
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950 shadow-[0_2px_10px_rgba(16,185,129,0.05)]' 
                  : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-xs text-gray-900'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded ${
                    student.tingkat === 'SD' ? 'bg-rose-100 text-rose-800' :
                    student.tingkat === 'SMP' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    Kelas {student.kelas}
                  </span>
                  
                  <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded ${
                    student.status_gizi === 'Sesuai' ? 'bg-emerald-100 text-emerald-800' :
                    student.status_gizi === 'Kurang' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-[#7f1d1d]'
                  }`}>
                    Gizi: {student.status_gizi}
                  </span>
                </div>

                <h4 className="font-bold text-sm mt-1.5 truncate">{student.nama}</h4>
                <p className="text-[11px] text-gray-500 truncate mt-0.5">{student.nama_sekolah}</p>
                
                {student.alergi !== 'Tidak Ada' && (
                  <p className="text-[10px] text-red-600 mt-1 font-medium flex items-center gap-0.5">
                    <AlertCircle size={10} /> Alergi: <strong>{student.alergi}</strong>
                  </p>
                )}
              </div>

              {/* Status Indicator Button */}
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  student.sudah_menerima 
                    ? 'bg-emerald-500 text-white shadow-emerald-200 glow-emerald scale-110' 
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}
              >
                {student.sudah_menerima ? <Check size={18} strokeWidth={3} /> : <span className="w-2 h-2 rounded-full bg-gray-300"></span>}
              </div>
            </div>
          ))}

          {filteredStudents.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400">
              Tidak ada data siswa terdaftar yang cocok dengan filter yang ditentukan.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
