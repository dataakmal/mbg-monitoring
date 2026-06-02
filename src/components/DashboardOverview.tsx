import React, { useState } from 'react';
import { Sekolah, MenuMakanan, Distribusi, StokBahan } from '../types';
import { 
  Users, School, Utensils, Wallet, CheckCircle, PackageOpen, 
  MapPin, AlertTriangle, ArrowUpRight, TrendingUp, ChevronRight, Activity
} from 'lucide-react';

interface DashboardOverviewProps {
  sekolahList: Sekolah[];
  menuList: MenuMakanan[];
  distribusiList: Distribusi[];
  stokList: StokBahan[];
  onNavigate: (tab: string) => void;
  selectedProvince: string;
  setSelectedProvince: (prov: string) => void;
}

export default function DashboardOverview({
  sekolahList,
  menuList,
  distribusiList,
  stokList,
  onNavigate,
  selectedProvince,
  setSelectedProvince,
}: DashboardOverviewProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Region hotspots for Indonesia Map
  const regionHotspots = [
    { id: 'sumatra', name: 'Sumatera', key: 'Sumatera Utara', x: '21%', y: '35%', count: 2, students: 1290, color: 'bg-emerald-500' },
    { id: 'jakarta', name: 'DKI Jakarta', key: 'DKI Jakarta', x: '35%', y: '72%', count: 2, students: 1270, color: 'bg-emerald-500' },
    { id: 'javabarat', name: 'Jawa Barat', key: 'Jawa Barat', x: '40%', y: '74%', count: 2, students: 1050, color: 'bg-amber-500' },
    { id: 'jawatengah', name: 'Jawa Tengah', key: 'Jawa Tengah', x: '45%', y: '75%', count: 2, students: 1300, color: 'bg-emerald-500' },
    { id: 'jawatimur', name: 'Jawa Timur', key: 'Jawa Timur', x: '51%', y: '77%', count: 2, students: 1450, color: 'bg-rose-500' },
    { id: 'bali', name: 'Bali', key: 'Bali', x: '58%', y: '79%', count: 2, students: 1070, color: 'bg-emerald-500' },
    { id: 'sulawesi', name: 'Sulawesi Selatan', key: 'Sulawesi Selatan', x: '70%', y: '55%', count: 2, students: 1130, color: 'bg-amber-500' },
    { id: 'papua', name: 'Papua', key: 'Papua', x: '92%', y: '68%', count: 1, students: 280, color: 'bg-emerald-500' }
  ];

  // Map province selections
  const handleRegionClick = (provKey: string) => {
    if (selectedProvince === provKey) {
      setSelectedProvince('Semua'); // toggle
    } else {
      setSelectedProvince(provKey);
    }
  };

  // Calculations filtered by selectedProvince
  const filteredSekolah = selectedProvince === 'Semua' 
    ? sekolahList 
    : sekolahList.filter(s => s.provinsi.toLowerCase() === selectedProvince.toLowerCase());

  const filteredSekolahIds = filteredSekolah.map(s => s.id_sekolah);

  const filteredDistribusi = selectedProvince === 'Semua'
    ? distribusiList
    : distribusiList.filter(d => filteredSekolahIds.includes(d.id_sekolah));

  // 1. KPI Stats
  const totalSiswa = filteredSekolah.reduce((acc, curr) => acc + curr.jumlah_siswa, 0);
  const totalSekolah = filteredSekolah.length;
  
  // Total portions delivered today (daily tracker)
  const totalPorsiHariIni = filteredDistribusi
    .filter(d => d.tanggal === '2026-06-02')
    .reduce((acc, curr) => acc + curr.jumlah_porsi, 0);

  // Budget absorbed (Sum of portion * menu price)
  const totalAnggaran = filteredDistribusi.reduce((acc, curr) => {
    // Find menu item price, fallback to default 15000 if not matched
    const samplePrice = 14500;
    return acc + (curr.jumlah_porsi * samplePrice);
  }, 0);

  // Distribution success rate
  const totalCompletedDist = filteredDistribusi.filter(d => d.status === 'selesai').length;
  const successPercentage = filteredDistribusi.length > 0 
    ? Math.round((totalCompletedDist / filteredDistribusi.length) * 100) 
    : 100;

  // Stock status
  const criticalStockCount = stokList.filter(s => s.status === 'Kritis').length;
  const warningStockCount = stokList.filter(s => s.status === 'Peringatan').length;

  // Nutrient averages
  const avgNutrients = {
    kalori: 615,
    protein: 31,
    karbohidrat: 71,
    lemak: 16
  };

  // Interactive menu summary
  const popularMenus = menuList.slice(0, 3);

  // Format currency
  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="space-y-6" id="dashboard-overview-root">
      
      {/* Filters bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-xs border border-gray-100">
        <div>
          <h2 className="text-xl font-semibold font-display text-gray-900">
            Pusat Kendali Makan Bergizi Gratis (MBG)
          </h2>
          <p className="text-sm text-gray-500">
            Monitoring Real-Time Pemenuhan Gizi dan Logistik Nusantara
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filter Wilayah:</span>
          <select 
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="text-sm font-medium border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 cursor-pointer"
          >
            <option value="Semua">Semua Wilayah (Nasional)</option>
            <option value="DKI Jakarta">DKI Jakarta</option>
            <option value="Jawa Barat">Jawa Barat</option>
            <option value="Jawa Tengah">Jawa Tengah</option>
            <option value="Jawa Timur">Jawa Timur</option>
            <option value="Bali">Bali</option>
            <option value="Sulawesi Selatan">Sulawesi Selatan</option>
            <option value="Papua">Papua</option>
          </select>
          {selectedProvince !== 'Semua' && (
            <button 
              onClick={() => setSelectedProvince('Semua')}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline px-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Penerima */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between hover:border-emerald-200 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Penerima</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Users size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-display text-gray-900 tracking-tight">
              {totalSiswa.toLocaleString('id-ID')}
            </h3>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-medium flex items-center">
                <TrendingUp size={12} className="mr-0.5" /> +4.2%
              </span>
              siswa aktif
            </p>
          </div>
        </div>

        {/* Total Sekolah */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between hover:border-blue-200 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Sekolah Terdaftar</span>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <School size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-display text-gray-900 tracking-tight">
              {totalSekolah}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              SD, SMP & SMA mitra
            </p>
          </div>
        </div>

        {/* Total Porsi */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between hover:border-teal-200 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Porsi Hari Ini</span>
            <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
              <Utensils size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-display text-gray-900 tracking-tight">
              {totalPorsiHariIni.toLocaleString('id-ID')}
            </h3>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <span className="inline-block w-2- h-2 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
              Penyaluran pagi
            </p>
          </div>
        </div>

        {/* Anggaran */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between hover:border-purple-200 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Anggaran Terserap</span>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Wallet size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-gray-900 tracking-tight">
              {formatIDR(totalAnggaran)}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Efisiensi biaya terkendali
            </p>
          </div>
        </div>

        {/* Distribusi Berhasil */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between hover:border-amber-200 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Rasio Istimewa</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <CheckCircle size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-display text-gray-900 tracking-tight">
              {successPercentage}%
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Status sukses pengiriman
            </p>
          </div>
        </div>

        {/* Stok Bahan */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between hover:border-orange-200 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Gudang</span>
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <PackageOpen size={18} />
            </div>
          </div>
          <div>
            <h3 className={`text-2xl font-bold font-display tracking-tight flex items-center gap-1 ${criticalStockCount > 0 ? 'text-red-600' : warningStockCount > 0 ? 'text-amber-600' : 'text-emerald-700'}`}>
              {criticalStockCount > 0 ? 'Kritis' : warningStockCount > 0 ? 'Waspada' : 'Aman'}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {criticalStockCount} Kritis, {warningStockCount} Menipis
            </p>
          </div>
        </div>
      </div>

      {/* Peta Indonesia Interactive section */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-emerald-500/30">
              Peta Penyaluran Nasional
            </span>
            <h3 className="text-xl font-bold font-display mt-2">
              Sistem Logistik Nusantara Real-Time {selectedProvince !== 'Semua' && ` - Wilayah ${selectedProvince}`}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Klik hotspot wilayah untuk melakukan filter, sorot untuk ringkasan cepat.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block pulse-slow"></span>
              <span>100% Selesai</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block pulse-slow"></span>
              <span>Dalam Pengantaran</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block pulse-slow"></span>
              <span>Terhambat / Terlambat</span>
            </div>
          </div>
        </div>

        {/* Interactive Stylized Map Container */}
        <div className="relative w-full aspect-[21/9] min-h-[220px] bg-slate-950/40 rounded-xl border border-slate-800 p-2 flex items-center justify-center select-none overflow-hidden">
          
          {/* Custom Stylized Indonesia SVG Background Path Grid */}
          <svg viewBox="0 0 800 340" className="w-full h-full opacity-30 text-slate-700 pointer-events-none absolute inset-0">
            {/* Sumatra */}
            <path d="M50 80 C 100 130, 200 210, 220 220 C 200 230, 160 220, 120 180 C 80 150, 40 100, 30 70 Z" fill="currentColor" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            {/* Java */}
            <path d="M220 260 L 460 270 C 470 270, 470 280, 460 280 L 220 270 C 210 270, 210 260, 220 260 Z" fill="currentColor" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            {/* Kalimantan */}
            <path d="M280 120 C 310 110, 370 120, 390 140 C 370 210, 320 220, 290 200 C 260 180, 270 140, 280 120 Z" fill="currentColor" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            {/* Sulawesi */}
            <path d="M430 140 C 450 145, 470 110, 480 140 C 480 160, 450 160, 470 190 C 480 200, 460 220, 440 210 C 430 180, 440 160, 430 140 Z" fill="currentColor" opacity="0.8" />
            {/* Bali & Nusa Tenggara */}
            <path d="M475 281 L 580 285 L 580 289 L 475 284 Z" fill="currentColor" />
            {/* Maluku islands */}
            <circle cx="510" cy="180" r="10" fill="currentColor" />
            <circle cx="530" cy="160" r="8" fill="currentColor" />
            <circle cx="540" cy="200" r="12" fill="currentColor" />
            {/* Papua */}
            <path d="M570 180 L 590 150 C 620 130, 680 180, 750 170 C 760 170, 770 190, 750 200 C 720 220, 690 230, 650 230 C 610 230, 580 210, 570 180 Z" fill="currentColor" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            
            {/* Futuristic Tech Grid Overlay */}
            <g opacity="0.15">
              <line x1="100" y1="0" x2="100" y2="340" stroke="white" strokeDasharray="3" />
              <line x1="200" y1="0" x2="200" y2="340" stroke="white" strokeDasharray="3" />
              <line x1="300" y1="0" x2="300" y2="340" stroke="white" strokeDasharray="3" />
              <line x1="400" y1="0" x2="400" y2="340" stroke="white" strokeDasharray="3" />
              <line x1="500" y1="0" x2="500" y2="340" stroke="white" strokeDasharray="3" />
              <line x1="600" y1="0" x2="600" y2="340" stroke="white" strokeDasharray="3" />
              <line x1="700" y1="0" x2="700" y2="340" stroke="white" strokeDasharray="3" />
              <line x1="0" y1="100" x2="800" y2="100" stroke="white" strokeDasharray="3" />
              <line x1="0" y1="200" x2="800" y2="200" stroke="white" strokeDasharray="3" />
              <line x1="0" y1="300" x2="800" y2="300" stroke="white" strokeDasharray="3" />
            </g>
          </svg>

          {/* Interactive Spots */}
          {regionHotspots.map((hotspot) => {
            const isSelected = selectedProvince.toLowerCase() === hotspot.key.toLowerCase();
            const isHovered = hoveredRegion === hotspot.id;

            return (
              <button
                key={hotspot.id}
                onClick={() => handleRegionClick(hotspot.key)}
                onMouseEnter={() => setHoveredRegion(hotspot.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                style={{ left: hotspot.x, top: hotspot.y }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-3 focus:outline-none z-10 transition-transform duration-200 ${isHovered || isSelected ? 'scale-125' : 'scale-100'}`}
              >
                <span className="absolute inline-flex h-6 w-6 rounded-full bg-emerald-400 opacity-20 animate-ping"></span>
                <span className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white cursor-pointer ${
                  hotspot.id === 'jawatimur' ? 'bg-red-500 shadow-rose-500' :
                  hotspot.id === 'javabarat' || hotspot.id === 'sulawesi' ? 'bg-amber-400 shadow-amber-400' : 
                  'bg-emerald-400 shadow-emerald-400'
                } shadow-[0_0_10px_2px_rgba(0,0,0,0.5)]`}></span>

                {/* Micro mini-toast on hover */}
                {(isHovered || isSelected) && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 bg-slate-950 p-2.5 rounded-lg border border-slate-700 shadow-lg text-left pointer-events-none text-slate-100">
                    <p className="text-xs font-bold font-display text-emerald-400 flex items-center justify-between">
                      <span>{hotspot.name}</span>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-300 px-1 py-0.5 rounded">
                        {hotspot.count} Sekolah
                      </span>
                    </p>
                    <div className="mt-1.5 space-y-0.5 text-[10px] text-slate-300">
                      <p>Siswa: <span className="font-semibold text-white">{hotspot.students.toLocaleString('id-ID')} Anak</span></p>
                      <p>Status: <span className={`font-semibold ${hotspot.id === 'jawatimur' ? 'text-red-400' : hotspot.id === 'javabarat' || hotspot.id === 'sulawesi' ? 'text-amber-300' : 'text-emerald-400'}`}>
                        {hotspot.id === 'jawatimur' ? 'Terhambat (1)' : hotspot.id === 'javabarat' || hotspot.id === 'sulawesi' ? 'Sedang Diproses' : 'Selesai 100%'}
                      </span></p>
                    </div>
                    {isSelected && (
                      <p className="text-[9.5px] text-emerald-400 mt-1 font-medium animate-pulse text-center">
                        ✔ Filter Aktif
                      </p>
                    )}
                  </div>
                )}
              </button>
            );
          })}

          {/* Quick instructions floating */}
          <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-mono text-slate-400 border border-slate-800">
            Latitude 0.7893° S, Longitude 113.9213° E
          </div>
          
          <div className="absolute bottom-2.5 right-2.5 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-mono text-slate-400 border border-slate-800">
            Peta Terintegrasi BPN RI
          </div>
        </div>
      </div>

      {/* Grid: Menu Populer + Pemenuhan Gizi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Row Left: Menu Terpopuler & Gizinya */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold font-display text-gray-900">Program Nutrisi Populer</h4>
              <p className="text-xs text-gray-500">Menu makanan favorit pilihan siswa</p>
            </div>
            <button 
              onClick={() => onNavigate('Menu Makanan')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 border border-emerald-100 px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              Lihat Semua Menu <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {popularMenus.map((menu) => (
              <div key={menu.id_menu} className="flex gap-4 p-3 bg-gray-50/55 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100">
                <img 
                  src={menu.foto_menu} 
                  alt={menu.nama_menu} 
                  className="w-16 h-16 rounded-lg object-cover bg-gray-200"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                    {menu.kategori}
                  </span>
                  <h5 className="font-semibold text-gray-900 text-sm mt-1 truncate">{menu.nama_menu}</h5>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span className="font-medium text-gray-900">{menu.kalori} kcal</span>
                    <span>•</span>
                    <span>Prot: <strong>{menu.protein}g</strong></span>
                    <span>•</span>
                    <span>Karb: <strong>{menu.karbohidrat}g</strong></span>
                  </div>
                </div>
                <div className="text-right flex flex-col justify-between">
                  <span className="text-[10px] font-semibold text-gray-400">Harga per Porsi</span>
                  <p className="text-xs font-bold text-emerald-600">{formatIDR(menu.harga)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row Right: Pemenuhan Gizi Harian (SVG Chart representation) */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-base font-bold font-display text-gray-900">Realisasi Target Pemenuhan Gizi</h4>
                <p className="text-xs text-gray-500">Persentase rata-rata gizi harian per siswa terhadap standar Kementerian Kesehatan</p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Activity size={18} />
              </div>
            </div>

            {/* Nutrition Gauges */}
            <div className="grid grid-cols-2 gap-4 my-4">
              {/* Calorie Progress */}
              <div className="p-3 bg-gray-50/70 border border-gray-100 rounded-xl text-center">
                <p className="text-xs font-semibold text-gray-600 uppercase">Kalori Harian</p>
                <div className="relative flex items-center justify-center my-3">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#f3f4f6" strokeWidth="6" fill="transparent" />
                    <circle cx="48" cy="48" r="40" stroke="#2596be" strokeWidth="8" fill="transparent" 
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * 94) / 100}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-lg font-bold text-gray-900 font-display">94%</span>
                    <p className="text-[9px] text-gray-400">615 / 650 kcal</p>
                  </div>
                </div>
                <p className="text-xs text-emerald-600 font-medium flex items-center justify-center gap-0.5">
                  Optimal (Standar OK)
                </p>
              </div>

              {/* Protein Progress */}
              <div className="p-3 bg-gray-50/70 border border-gray-100 rounded-xl text-center">
                <p className="text-xs font-semibold text-gray-600 uppercase">Protein Harian</p>
                <div className="relative flex items-center justify-center my-3">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#f3f4f6" strokeWidth="6" fill="transparent" />
                    <circle cx="48" cy="48" r="40" stroke="#3b82f6" strokeWidth="8" fill="transparent" 
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * 103) / 100}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-lg font-bold text-gray-900 font-display">103%</span>
                    <p className="text-[9px] text-gray-400">31g / 30g</p>
                  </div>
                </div>
                <p className="text-xs text-blue-600 font-medium flex items-center justify-center gap-0.5">
                  Melampaui Target (Sangat Baik)
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Karbohidrat: 71g (OK)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Lemak: 16g (OK)
              </span>
              <button 
                onClick={() => onNavigate('Monitoring Gizi')}
                className="font-semibold text-emerald-600 hover:underline"
              >
                Analisis Gizi Lengkap
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Grid: Status Stok Menipis + Laporan Distribusi Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Stok & Logistics Warning */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-base font-bold font-display text-gray-900">Status Ketersediaan Stok</h4>
                <p className="text-xs text-gray-500">Peringatan stok bahan pangan penting</p>
              </div>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                Gudang Pusat
              </span>
            </div>

            <div className="space-y-3.5 my-2">
              {stokList.slice(0, 3).map((item) => {
                const percentage = Math.min(100, Math.round((item.stok_kg / (item.min_stok_kg * 4)) * 100));
                return (
                  <div key={item.id_bahan} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-gray-900">{item.nama_bahan}</span>
                      <span className={`font-semibold ${item.status === 'Kritis' ? 'text-red-600' : 'text-emerald-700'}`}>
                        {item.stok_kg} {item.satuan}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          item.status === 'Kritis' ? 'bg-red-500' : 
                          item.status === 'Peringatan' ? 'bg-amber-500' : 
                          'bg-emerald-500'
                        }`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <button 
              onClick={() => onNavigate('Stok Bahan')}
              className="w-full text-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center justify-center gap-1"
            >
              Kelola Inventaris Stok <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* Tabel Penyaluran Terbaru */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-bold font-display text-gray-900">Distribusi Porsi Terkini (Hari Ini)</h4>
                <p className="text-xs text-gray-500">Log penyaluran Makan Bergizi Gratis di sekolah-sekolah</p>
              </div>
              <button 
                onClick={() => onNavigate('Distribusi')}
                className="text-xs font-semibold text-emerald-600 hover:underline"
              >
                Selengkapnya
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-2">Sekolah</th>
                    <th className="pb-2">Kabupaten/Provinsi</th>
                    <th className="pb-2 text-right">Jumlah Porsi</th>
                    <th className="pb-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {filteredDistribusi.slice(0, 4).map((dist) => (
                    <tr key={dist.id_distribusi} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2.5 font-semibold text-gray-900">{dist.nama_sekolah}</td>
                      <td className="py-2.5 text-gray-500">{dist.sekolah_kabupaten_provinsi || '-'}</td>
                      <td className="py-2.5 text-right font-mono font-medium text-gray-800">{dist.jumlah_porsi.toLocaleString('id-ID')}</td>
                      <td className="py-2.5 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          dist.status === 'selesai' ? 'bg-emerald-100 text-emerald-800' :
                          dist.status === 'proses' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {dist.status === 'selesai' ? 'Selesai' :
                           dist.status === 'proses' ? 'Proses' :
                           'Terlambat'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredDistribusi.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-400">
                        Tidak ada log penyaluran untuk wilayah terpilih.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3 text-right">
            <span className="text-[10px] text-gray-400 font-mono">
              Terakhir sinkronisasi: 2026-06-02 09:05 WIB
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
