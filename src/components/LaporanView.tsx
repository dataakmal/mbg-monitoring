import React, { useState } from 'react';
import { Sekolah, Distribusi } from '../types';
import { FileSpreadsheet, FileDown, Search, Filter, Printer, Download, Sparkles, Building, Calendar } from 'lucide-react';

interface LaporanViewProps {
  distribusiList: Distribusi[];
  sekolahList: Sekolah[];
}

export default function LaporanView({
  distribusiList,
  sekolahList
}: LaporanViewProps) {
  // Filtering inputs
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2026-06-02');
  const [selectedSchool, setSelectedSchool] = useState('Semua');
  const [selectedProvince, setSelectedProvince] = useState('Semua');
  const [inputKabupaten, setInputKabupaten] = useState('');
  const [inputKecamatan, setInputKecamatan] = useState('');

  // Process filters
  const filteredReport = distribusiList.filter(d => {
    // Date filter
    const matchesDate = d.tanggal >= startDate && d.tanggal <= endDate;
    
    // School
    const matchesSchool = selectedSchool === 'Semua' || d.id_sekolah === selectedSchool;

    // Search additional metadata
    const schoolMeta = sekolahList.find(s => s.id_sekolah === d.id_sekolah);
    const matchesProv = selectedProvince === 'Semua' || (schoolMeta && schoolMeta.provinsi === selectedProvince);
    const matchesKab = !inputKabupaten || (schoolMeta && schoolMeta.kabupaten.toLowerCase().includes(inputKabupaten.toLowerCase()));
    
    // Simulated Kecamatan fallback match
    const matchesKec = !inputKecamatan || d.nama_sekolah.toLowerCase().includes(inputKecamatan.toLowerCase());

    return matchesDate && matchesSchool && matchesProv && matchesKab && matchesKec;
  });

  // Calculate summaries
  const totalPorsiMatched = filteredReport.reduce((acc, curr) => acc + curr.jumlah_porsi, 0);
  const averagePricePerPortion = 14500;
  const totalAnggaranAbsorbed = totalPorsiMatched * averagePricePerPortion;

  const countSelesai = filteredReport.filter(r => r.status === 'selesai').length;
  const countPending = filteredReport.filter(r => r.status === 'proses').length;
  const countFailed = filteredReport.filter(r => r.status === 'terlambat').length;

  // Real client-side CSV hardware exporter
  const exportToCSV = () => {
    // Define headers
    const headers = ['ID Distribusi', 'Tanggal Penyaluran', 'Nama Sekolah', 'Wilayah Kabupaten/Provinsi', 'Jumlah Porsi', 'Status Pengiriman', 'Nilai Anggaran (Rp)'];
    
    // Rows
    const rows = filteredReport.map(r => [
      r.id_distribusi,
      r.tanggal,
      `"${r.nama_sekolah}"`,
      `"${r.sekolah_kabupaten_provinsi || ''}"`,
      r.jumlah_porsi,
      r.status.toUpperCase(),
      r.jumlah_porsi * averagePricePerPortion
    ]);

    // Join
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' // adding BOM marker for Excel Indonesian formatting
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_MBG_Nasional_${startDate}_ke_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Real Excel (TSV format compatible with Excel copy-paste directly)
  const exportToExcel = () => {
    let excelContent = 'ID Distribusi\tTanggal\tSekolah\tWilayah\tJumlah Porsi\tStatus\tAnggaran (Rupiah)\n';
    
    filteredReport.forEach(r => {
      excelContent += `${r.id_distribusi}\t${r.tanggal}\t${r.nama_sekolah}\t${r.sekolah_kabupaten_provinsi || ''}\t${r.jumlah_porsi}\t${r.status.toUpperCase()}\t${r.jumlah_porsi * averagePricePerPortion}\n`;
    });

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Audit_Laporan_MBG_${startDate}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Modern print handler for PDF conversion
  const exportToPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="laporan-view-root">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-bold font-display text-gray-900 flex items-center gap-2">
            <FileSpreadsheet className="text-emerald-600" />
            Pusat Laporan & Audit Anggaran
          </h2>
          <p className="text-sm text-gray-500">
            Ekspor audit manifes penyaluran sehat berkala dalam format CSV, Excel (Spreadsheet), atau cetakan resmi PDF.
          </p>
        </div>
      </div>

      {/* Audit Print Layout Header (Normally hidden, visible online during browser print layout view!) */}
      <div className="hidden print:block space-y-4 border-b border-gray-900 pb-5 mb-5">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 font-display">KEMENTERIAN KOORDINATOR BIDANG PEMBANGUNAN MANUSIA</h1>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold font-mono">Manifes Audit Penyaluran Program Makan Bergizi Gratis (MBG)</p>
            <p className="text-xs text-slate-400">Periode Audit: {startDate} s/d {endDate}</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold bg-slate-100 text-slate-800 p-2 rounded border border-gray-200">
              SECRETARIAT MANIFEST
            </span>
          </div>
        </div>
      </div>

      {/* Advanced filters block */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4 print:hidden">
        
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <Filter className="text-emerald-600" size={16} />
          <h3 className="font-bold text-gray-950 text-xs uppercase tracking-widest font-display">Kriteria Penyaringan (Filters)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Start Date */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-1">
              <Calendar size={11} /> Tanggal Mulai
            </label>
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full text-xs font-semibold border border-gray-200 rounded-lg p-2.5 bg-gray-50 cursor-pointer"
            />
          </div>

          {/* End Date */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-1">
              <Calendar size={11} /> Tanggal Akhir
            </label>
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full text-xs font-semibold border border-gray-200 rounded-lg p-2.5 bg-gray-50 cursor-pointer"
            />
          </div>

          {/* School Selection */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-1">
              <Building size={11} /> Nama Sekolah
            </label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full text-xs font-semibold border border-gray-200 bg-white rounded-lg p-2.5 cursor-pointer"
            >
              <option value="Semua">Semua Sekolah Terdaftar</option>
              {sekolahList.map(s => (
                <option key={s.id_sekolah} value={s.id_sekolah}>{s.nama_sekolah}</option>
              ))}
            </select>
          </div>

          {/* Province */}
          <div className="space-y-1 items-center">
            <span className="text-[11px] font-bold text-gray-500 uppercase block">Provinsi Wilayah</span>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full text-xs font-semibold border border-gray-200 bg-white rounded-lg p-2.5 cursor-pointer"
            >
              <option value="Semua">Semua Provinsi (Nasional)</option>
              <option value="DKI Jakarta">DKI Jakarta</option>
              <option value="Jawa Barat">Jawa Barat</option>
              <option value="Jawa Tengah">Jawa Tengah</option>
              <option value="Jawa Timur">Jawa Timur</option>
              <option value="Bali">Bali</option>
              <option value="Sulawesi Selatan">Sulawesi Selatan</option>
              <option value="Papua">Papua</option>
            </select>
          </div>

          {/* Input Kabupaten */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase block">Kabupaten / Kota</span>
            <input 
              type="text"
              placeholder="e.g. Bandung"
              value={inputKabupaten}
              onChange={(e) => setInputKabupaten(e.target.value)}
              className="w-full text-xs font-semibold border border-gray-200 rounded-lg p-2.5"
            />
          </div>

          {/* Input Kecamatan */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase block">Kecamatan (Simulation)</span>
            <input 
              type="text"
              placeholder="e.g. Cicendo"
              value={inputKecamatan}
              onChange={(e) => setInputKecamatan(e.target.value)}
              className="w-full text-xs font-semibold border border-gray-200 rounded-lg p-2.5"
            />
          </div>

        </div>
      </div>

      {/* Grid Match summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total matched Portions */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Porsi Filtered</p>
          <h4 className="text-xl font-bold font-display tracking-tight text-gray-950 mt-1">
            {totalPorsiMatched.toLocaleString('id-ID')} Porsi
          </h4>
        </div>

        {/* Total Cost matched */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Estimasi Penyerapan Dana</p>
          <h4 className="text-xl font-bold font-display tracking-tight text-emerald-600 mt-1">
            Rp {totalAnggaranAbsorbed.toLocaleString('id-ID')}
          </h4>
        </div>

        {/* Status Completed Ratio */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs lg:col-span-2">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Rincian Status Rute Manifest</p>
          <div className="flex items-center gap-4 mt-2 text-xs font-bold">
            <span className="text-emerald-600 flex items-center gap-1">
              • {countSelesai} Selesai (Hijau)
            </span>
            <span className="text-amber-500 flex items-center gap-1">
              • {countPending} Proses (Kuning)
            </span>
            <span className="text-red-500 flex items-center gap-1">
              • {countFailed} Terlambat (Merah)
            </span>
          </div>
        </div>
      </div>

      {/* Actions and exporter triggers */}
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-wrap items-center justify-between gap-4 mb-4 print:hidden">
        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase font-mono">Form Ekspor Sesuai SK Dirwan</span>
          <p className="text-xs text-gray-600">Simpan berkas dalam format digital resmi untuk administrasi Dinas.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* CSV Download */}
          <button
            onClick={exportToCSV}
            className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-3.5 py-2 border border-gray-200 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download size={14} className="text-slate-400" /> Ekspor ke CSV
          </button>

          {/* Excel Spreadsheet Download */}
          <button
            onClick={exportToExcel}
            className="bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs px-3.5 py-2 border border-emerald-150 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <FileSpreadsheet size={14} className="text-emerald-500" /> Ekspor ke Excel
          </button>

          {/* PDF System Print */}
          <button
            onClick={exportToPDF}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Printer size={14} /> Cetak / Unduh PDF
          </button>
        </div>
      </div>

      {/* manifest data table viewport */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/75 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">ID Manifes</th>
                <th className="py-3 px-4">Nama Sekolah</th>
                <th className="py-3 px-4">Wilayah Kabupaten/Provinsi</th>
                <th className="py-3 px-4 text-right">Manifes Porsi</th>
                <th className="py-3 px-4 text-right">Anggaran</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-gray-100">
              {filteredReport.map(route => {
                return (
                  <tr key={route.id_distribusi} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-2.5 px-4 text-gray-500">{route.tanggal}</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-emerald-800 text-xs">
                      {route.id_distribusi}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-gray-900">{route.nama_sekolah}</td>
                    <td className="py-2.5 px-4 text-gray-500">{route.sekolah_kabupaten_provinsi || '-'}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-semibold text-gray-800">
                      {route.jumlah_porsi.toLocaleString('id-ID')} Porsi
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-gray-900">
                      Rp {(route.jumlah_porsi * averagePricePerPortion).toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center justify-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                          route.status === 'selesai' ? 'bg-emerald-100 text-emerald-800' :
                          route.status === 'proses' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {route.status === 'selesai' ? 'SELESAI' :
                           route.status === 'proses' ? 'PROSES' : 'TERLAMBAT'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredReport.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    Tidak ditemukan data manifes dalam kriteria audit yang dicari.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
