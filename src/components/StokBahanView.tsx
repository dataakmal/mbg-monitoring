import React, { useState } from 'react';
import { StokBahan } from '../types';
import { 
  PackageOpen, AlertCircle, Plus, Info, CheckCircle2, 
  Search, ArrowDownToLine, RefreshCw, Layers, Sparkles, X
} from 'lucide-react';

interface StokBahanViewProps {
  stokList: StokBahan[];
  onAddStock: (idBahan: string, amountKg: number) => void;
  onAddNewIngredient: (item: StokBahan) => void;
}

export default function StokBahanView({
  stokList,
  onAddStock,
  onAddNewIngredient
}: StokBahanViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'Semua' | 'Karbohidrat' | 'Protein Hewani' | 'Protein Nabati' | 'Sayuran' | 'Susu' | 'Bumbu'>('Semua');

  // Incremental replenishment state
  const [selectedBahan, setSelectedBahan] = useState('');
  const [replenishAmount, setReplenishAmount] = useState(50);

  // New Ingredient state
  const [isNewIngOpen, setIsNewIngOpen] = useState(false);
  const [newIngName, setNewIngName] = useState('');
  const [newIngCat, setNewIngCat] = useState<'Karbohidrat' | 'Protein Hewani' | 'Protein Nabati' | 'Sayuran' | 'Susu' | 'Bumbu'>('Karbohidrat');
  const [newIngQty, setNewIngQty] = useState(100);
  const [newIngMin, setNewIngMin] = useState(50);
  const [newIngUnit, setNewIngUnit] = useState('kg');

  // Filtering
  const filteredStok = stokList.filter(item => {
    const matchesSearch = item.nama_bahan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'Semua' || item.kategori === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleReplenish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBahan || replenishAmount <= 0) {
      alert('Mohon pilih bahan pangan dan masukkan jumlah penambahan yang valid!');
      return;
    }

    onAddStock(selectedBahan, replenishAmount);
    // Reset form fields
    setSelectedBahan('');
    setReplenishAmount(50);
    alert('Stok bahan berhasil ditambahkan dan dicatat!');
  };

  const handleCreateNewIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngName) {
      alert('Nama bahan pangan wajib diisi!');
      return;
    }

    const calculatedStatus: 'Aman' | 'Peringatan' | 'Kritis' = 
      newIngQty <= newIngMin ? 'Kritis' : 
      newIngQty <= newIngMin * 1.5 ? 'Peringatan' : 'Aman';

    const newIng: StokBahan = {
      id_bahan: `STK-${String(stokList.length + 1).padStart(3, '0')}`,
      nama_bahan: newIngName,
      kategori: newIngCat,
      stok_kg: newIngQty,
      min_stok_kg: newIngMin,
      satuan: newIngUnit,
      status: calculatedStatus,
      terakhir_diperbarui: '2026-06-02 09:00'
    };

    onAddNewIngredient(newIng);
    setIsNewIngOpen(false);
    // Reset form
    setNewIngName('');
    setNewIngQty(100);
    setNewIngMin(50);
  };

  return (
    <div className="space-y-6" id="stok-bahan-view-root">
      
      {/* Header element */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-gray-900 flex items-center gap-2">
            <PackageOpen className="text-emerald-600" />
            Audit Inventaris Bahan Pangan
          </h2>
          <p className="text-sm text-gray-500">
            Pemantauan ketersediaan bahan dapur sehat di gudang pusat katering MBG wilayah.
          </p>
        </div>

        <button
          onClick={() => setIsNewIngOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus size={18} /> Daftarkan Bahan Pangan Baru
        </button>
      </div>

      {/* Grid: Stok status meters + Quick Add Stock form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Replenishment form */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs h-fit space-y-4">
          <div>
            <h4 className="font-bold text-gray-900 text-sm font-display flex items-center gap-1.5">
              <ArrowDownToLine className="text-emerald-600" size={16} />
              Input Pasokan Masuk (Retur Gudang)
            </h4>
            <p className="text-xs text-gray-500">Formuler pencatatan pengiriman suplai baru dari petani/supplier.</p>
          </div>

          <form onSubmit={handleReplenish} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 block">Pilih Bahan Pangan</label>
              <select
                value={selectedBahan}
                onChange={(e) => setSelectedBahan(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="">-- Pilih Komoditas --</option>
                {stokList.map(item => (
                  <option key={item.id_bahan} value={item.id_bahan}>
                    {item.nama_bahan} ({item.stok_kg} {item.satuan} sisa)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 block">Jumlah Pasokan Masuk</label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={50000}
                  value={replenishAmount}
                  onChange={(e) => setReplenishAmount(Number(e.target.value))}
                  className="w-full text-xs font-semibold border border-gray-200 rounded-lg px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold font-mono">
                  {selectedBahan ? stokList.find(s => s.id_bahan === selectedBahan)?.satuan : 'kg'}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-lg transition-all"
            >
              Simpan Tambah Stok
            </button>
          </form>
        </div>

        {/* Stok List layout cards */}
        <div className="lg:col-span-2 space-y-4">
          {/* Controls inner */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Cari komoditas pangan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex gap-2 text-xs">
              {(['Semua', 'Karbohidrat', 'Protein Hewani', 'Sayuran', 'Susu'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold border transition-colors ${
                    categoryFilter === cat
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List display rows */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="divide-y divide-gray-100">
              {filteredStok.map((item) => {
                const isCritical = item.status === 'Kritis';
                const isWarning = item.status === 'Peringatan';

                const progressPercentage = Math.min(100, Math.round((item.stok_kg / (item.min_stok_kg * 4)) * 100));

                return (
                  <div key={item.id_bahan} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/30 transition-colors">
                    
                    <div className="space-y-1 max-w-sm">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h5 className="font-bold text-sm text-gray-900">{item.nama_bahan}</h5>
                        <span className="text-[9px] bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono font-medium uppercase">
                          {item.id_bahan}
                        </span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          {item.kategori}
                        </span>
                      </div>
                      
                      <p className="text-[11px] text-gray-400 font-medium">
                        Terakhir diupdate: {item.terakhir_diperbarui}
                      </p>
                    </div>

                    {/* Progress Bar and stocks */}
                    <div className="w-full sm:max-w-xs space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-gray-500">Min: {item.min_stok_kg} {item.satuan}</span>
                        <span className="text-gray-900">{item.stok_kg} {item.satuan}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`}
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Badge Status */}
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${
                      isCritical ? 'bg-red-100 text-red-900 border border-red-200 glow-rose' : 
                      isWarning ? 'bg-amber-100 text-amber-900 border border-amber-200 glow-amber' : 
                      'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    }`}>
                      {isCritical ? <AlertCircle size={12} /> : isWarning ? <Info size={12} /> : <CheckCircle2 size={12} />}
                      {item.status}
                    </span>

                  </div>
                );
              })}

              {filteredStok.length === 0 && (
                <div className="py-12 text-center text-gray-400">
                  Tidak ada bahan pangan terdaftar.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Modal create new custom raw material */}
      {isNewIngOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-base text-gray-900 font-display">
                Mendaftarkan Bahan Pangan Baru
              </h3>
              <button 
                onClick={() => setIsNewIngOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewIngredient} className="p-5 space-y-4">
              
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">Nama Bahan Baku / Komoditas</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Wortel Segar Lembang"
                  value={newIngName}
                  onChange={(e) => setNewIngName(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">Kategori Kelompok Pangan</label>
                <select
                  value={newIngCat}
                  onChange={(e) => setNewIngCat(e.target.value as any)}
                  className="w-full text-sm border border-gray-200 bg-white rounded-lg px-3 py-2.5 focus:outline-none"
                >
                  <option value="Karbohidrat">Karbohidrat (Beras, Kentang, Mi)</option>
                  <option value="Protein Hewani">Protein Hewani (Ayam, Telur, Daging)</option>
                  <option value="Protein Nabati">Protein Nabati (Tahu, Tempe)</option>
                  <option value="Sayuran">Sayuran (Brokoli, Wortel, Buncis)</option>
                  <option value="Susu">Susu (Susu UHT, Keju)</option>
                  <option value="Bumbu">Bumbu & Minyak</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Qty */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">Jumlah Awal</label>
                  <input 
                    type="number"
                    required
                    min={1}
                    value={newIngQty}
                    onChange={(e) => setNewIngQty(Number(e.target.value))}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none-xs"
                  />
                </div>

                {/* Min */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">Minimal Stok</label>
                  <input 
                    type="number"
                    required
                    min={1}
                    value={newIngMin}
                    onChange={(e) => setNewIngMin(Number(e.target.value))}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none-xs"
                  />
                </div>

                {/* Satuan */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">Satuan Ukuran</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. kg"
                    value={newIngUnit}
                    onChange={(e) => setNewIngUnit(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsNewIngOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 bg-slate-50 border border-gray-200 rounded-lg"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Daftarkan Bahan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
