import React, { useState } from 'react';
import { Distribusi, Sekolah } from '../types';
import { 
  MapPin, CheckCircle, Clock, AlertTriangle, Search, 
  ChevronRight, RefreshCw, Truck, Play, CheckCircle2, UserCircle2, X
} from 'lucide-react';

interface MonitoringDistribusiViewProps {
  distribusiList: Distribusi[];
  sekolahList: Sekolah[];
  onUpdateStatus: (idDistribusi: string, status: 'selesai' | 'proses' | 'terlambat') => void;
  onAddDistribusi: (distribusi: Distribusi) => void;
}

export default function MonitoringDistribusiView({
  distribusiList,
  sekolahList,
  onUpdateStatus,
  onAddDistribusi
}: MonitoringDistribusiViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'selesai' | 'proses' | 'terlambat'>('Semua');

  // Input states for adding new distribution route simulation
  const [isSimOpen, setIsSimOpen] = useState(false);
  const [simSchool, setSimSchool] = useState('');
  const [simPortions, setSimPortions] = useState(200);
  const [simCourier, setSimCourier] = useState('Pak Joko Santoso');

  // Filter lists
  const filteredDistribusi = distribusiList.filter(d => {
    const matchesQuery = d.nama_sekolah.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (d.sekolah_kabupaten_provinsi && d.sekolah_kabupaten_provinsi.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (d.kurir_nama && d.kurir_nama.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'Semua' || d.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  // Calculate high-fidelity metrics
  const totalPorsi = distribusiList.reduce((acc, curr) => acc + curr.jumlah_porsi, 0);
  
  const porsiSelesai = distribusiList
    .filter(d => d.status === 'selesai')
    .reduce((acc, curr) => acc + curr.jumlah_porsi, 0);

  const porsiProses = distribusiList
    .filter(d => d.status === 'proses')
    .reduce((acc, curr) => acc + curr.jumlah_porsi, 0);

  const porsiTerlambat = distribusiList
    .filter(d => d.status === 'terlambat')
    .reduce((acc, curr) => acc + curr.jumlah_porsi, 0);

  const successPercentage = totalPorsi > 0 ? Math.round((porsiSelesai / totalPorsi) * 100) : 100;

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simSchool) {
      alert('Mohon pilih sekolah tujuan!');
      return;
    }

    const selectedSch = sekolahList.find(s => s.id_sekolah === simSchool);
    if (!selectedSch) return;

    const newDist: Distribusi = {
      id_distribusi: `DST-${String(distribusiList.length + 101).padStart(3, '0')}`,
      tanggal: '2026-06-02',
      id_sekolah: selectedSch.id_sekolah,
      nama_sekolah: selectedSch.nama_sekolah,
      jumlah_porsi: simPortions,
      status: 'proses',
      sekolah_kabupaten_provinsi: `${selectedSch.kabupaten}, ${selectedSch.provinsi}`,
      kurir_nama: simCourier,
      waktu_est: '11:15 WIB'
    };

    onAddDistribusi(newDist);
    setIsSimOpen(false);
  };

  return (
    <div className="space-y-6" id="monitoring-distribusi-view-root">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-gray-900 flex items-center gap-2">
            <Truck className="text-emerald-600" />
            Sistem Monitoring Distribusi Porsi
          </h2>
          <p className="text-sm text-gray-500">
            Sistem pelacakan pengiriman piring sehat berbasis indikator warna dari dapur katering mitra ke halaman sekolah.
          </p>
        </div>

        <button
          onClick={() => setIsSimOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Play size={16} /> Simulasi Kiriman Baru
        </button>
      </div>

      {/* Dashboard KPI cards for logistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered Target */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Target Porsi Logistik</p>
          <h3 className="text-2xl font-bold font-display mt-1.5 text-gray-950">
            {totalPorsi.toLocaleString('id-ID')} <span className="text-xs font-medium text-gray-500">Porsi</span>
          </h3>
          <p className="text-[10px] text-gray-400 mt-1">Akumulasi rute terdaftar</p>
        </div>

        {/* Portions Delivered */}
        <div className="bg-emerald-50 text-emerald-950 p-4 rounded-xl border border-emerald-100 shadow-xs">
          <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1">
            <CheckCircle size={12} className="text-emerald-500" /> Porsi Terkirim (Hijau)
          </p>
          <h3 className="text-2xl font-bold font-display mt-1.5 text-emerald-950">
            {porsiSelesai.toLocaleString('id-ID')} <span className="text-xs font-semibold text-emerald-700">Porsi</span>
          </h3>
          <p className="text-[10px] text-emerald-600 mt-1">{successPercentage}% target penyaluran sukses</p>
        </div>

        {/* Portions In Progress */}
        <div className="bg-amber-50 text-amber-950 p-4 rounded-xl border border-amber-100 shadow-xs">
          <p className="text-xs text-amber-600 font-bold uppercase tracking-wider flex items-center gap-1">
            <Clock size={12} className="text-amber-500" /> Dalam Perjalanan (Kuning)
          </p>
          <h3 className="text-2xl font-bold font-display mt-1.5 text-amber-950">
            {porsiProses.toLocaleString('id-ID')} <span className="text-xs font-semibold text-amber-700">Porsi</span>
          </h3>
          <p className="text-[10px] text-amber-600 mt-1">Armada kurir aktif di lapangan</p>
        </div>

        {/* Portions Delayed */}
        <div className="bg-rose-50 text-red-950 p-4 rounded-xl border border-rose-100 shadow-xs">
          <p className="text-xs text-red-600 font-bold uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle size={12} className="text-red-500" /> Terlambat / Terhambat (Merah)
          </p>
          <h3 className="text-2xl font-bold font-display mt-1.5 text-red-950">
            {porsiTerlambat.toLocaleString('id-ID')} <span className="text-xs font-semibold text-red-700">Porsi</span>
          </h3>
          <p className="text-[10px] text-red-600 mt-1">Butuh intervensi jalur alternatif</p>
        </div>
      </div>

      {/* Control panel and Log List */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
          <input
            type="text"
            placeholder="Cari sekolah, ekspedisi/kurir..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          {(['Semua', 'selesai', 'proses', 'terlambat'] as const).map(stat => (
            <button
              key={stat}
              onClick={() => setStatusFilter(stat)}
              className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
                statusFilter === stat
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {stat === 'Semua' ? 'Semua Status' : stat === 'selesai' ? 'Hijau' : stat === 'proses' ? 'Kuning' : 'Merah'}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Logistics List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-5 space-y-4">
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Manifest Penyaluran Piring Sehat</h4>
        
        <div className="space-y-4">
          {filteredDistribusi.map((item) => {
            return (
              <div 
                key={item.id_distribusi} 
                className={`border rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all duration-200 ${
                  item.status === 'selesai' ? 'bg-emerald-50/20 border-emerald-100 hover:border-emerald-250' : 
                  item.status === 'proses' ? 'bg-amber-50/25 border-amber-100 hover:border-amber-250' : 
                  'bg-red-50/20 border-red-100 hover:border-red-200'
                }`}
              >
                
                {/* School and driver summary */}
                <div className="flex items-start gap-4">
                  {/* Status Indicator circle icon */}
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                    item.status === 'selesai' ? 'bg-emerald-100 text-emerald-700 glow-emerald' : 
                    item.status === 'proses' ? 'bg-amber-100 text-amber-700 glow-amber animate-pulse-slow' : 
                    'bg-red-100 text-red-600 glow-rose'
                  }`}>
                    {item.status === 'selesai' ? <CheckCircle2 size={22} /> : 
                     item.status === 'proses' ? <Clock size={20} /> : 
                     <AlertTriangle size={20} />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h5 className="font-extrabold text-sm text-gray-900">{item.nama_sekolah}</h5>
                      <span className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-mono font-medium">
                        {item.id_distribusi}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin size={12} className="text-slate-400" /> {item.sekolah_kabupaten_provinsi || 'DKI Jakarta'}
                    </p>
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                      <UserCircle2 size={13} className="text-gray-400" /> Kurir: <strong>{item.kurir_nama || 'Ekspedisi Lokal'}</strong>
                    </p>
                  </div>
                </div>

                {/* Portions & time */}
                <div className="grid grid-cols-2 lg:flex lg:items-center gap-4 lg:gap-8 bg-white/60 p-3 rounded-xl border border-gray-100 lg:border-transparent lg:bg-transparent text-left lg:text-right">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Porsi Dipesan</span>
                    <strong className="text-base text-slate-900 font-display">{item.jumlah_porsi} Porsi</strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Estimasi Waktu</span>
                    <strong className="text-xs text-slate-700 font-mono">{item.waktu_est || 'Pagi Hari'}</strong>
                  </div>
                </div>

                {/* Transition state controller (Interactive status updating) */}
                <div className="flex items-center gap-1.5 border-t border-gray-100 pt-3 lg:border-t-0 lg:pt-0 self-end lg:self-auto">
                  <span className="text-[11px] text-gray-400 font-semibold mr-1.5">Ubah Status:</span>
                  
                  {/* Selesai / green trigger */}
                  <button
                    onClick={() => onUpdateStatus(item.id_distribusi, 'selesai')}
                    title="Mark as selesai / hijau"
                    className={`p-1 px-2.5 rounded-lg text-[10.5px] font-bold border transition-colors ${
                      item.status === 'selesai' 
                        ? 'bg-emerald-600 text-white border-emerald-600' 
                        : 'bg-white border-gray-200 text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    Hijau
                  </button>

                  {/* Proses / yellow trigger */}
                  <button
                    onClick={() => onUpdateStatus(item.id_distribusi, 'proses')}
                    title="Mark as proses / kuning"
                    className={`p-1 px-2.5 rounded-lg text-[10.5px] font-bold border transition-colors ${
                      item.status === 'proses' 
                        ? 'bg-amber-500 text-white border-amber-500' 
                        : 'bg-white border-gray-200 text-amber-600 hover:bg-amber-50'
                    }`}
                  >
                    Kuning
                  </button>

                  {/* Terlambat / red trigger */}
                  <button
                    onClick={() => onUpdateStatus(item.id_distribusi, 'terlambat')}
                    title="Mark as terlambat / merah"
                    className={`p-1 px-2.5 rounded-lg text-[10.5px] font-bold border transition-colors ${
                      item.status === 'terlambat' 
                        ? 'bg-red-500 text-white border-red-500' 
                        : 'bg-white border-gray-200 text-red-500 hover:bg-red-50'
                    }`}
                  >
                    Merah
                  </button>
                </div>

              </div>
            );
          })}

          {filteredDistribusi.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-400">
              Tidak ada catatan audit pengiriman piring pintar yang cocok.
            </div>
          )}
        </div>
      </div>

      {/* Simulator Modal Box */}
      {isSimOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-base text-gray-900 font-display">
                Simulasikan Rute Pengantaran Baru
              </h3>
              <button 
                onClick={() => setIsSimOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSimulateSubmit} className="p-5 space-y-4">
              
              {/* Select school */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">Pilih Sekolah Penerima</label>
                <select
                  required
                  value={simSchool}
                  onChange={(e) => setSimSchool(e.target.value)}
                  className="w-full text-sm border border-gray-200 bg-white rounded-lg px-3 py-2.5 focus:outline-none"
                >
                  <option value="">-- Pilih Sekolah --</option>
                  {sekolahList.map(s => (
                    <option key={s.id_sekolah} value={s.id_sekolah}>{s.nama_sekolah} ({s.kabupaten})</option>
                  ))}
                </select>
              </div>

              {/* Portion size */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">Jumlah Porsi Makanan Sehat</label>
                <input 
                  type="number"
                  required
                  min={50}
                  max={2000}
                  value={simPortions}
                  onChange={(e) => setSimPortions(Number(e.target.value))}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none"
                />
                <span className="text-[10px] text-gray-400">Sesuaikan dengan kapasitas siswa sekolah terpilih.</span>
              </div>

              {/* Courier service */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">Nama Pengemudi / Ekspedisi</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Pak Ahmad Junaidi (Trans express)"
                  value={simCourier}
                  onChange={(e) => setSimCourier(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsSimOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-slate-50 border border-gray-200 rounded-lg"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm"
                >
                  Mulai Pengantaran
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
