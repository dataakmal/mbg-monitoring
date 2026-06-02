import React, { useState } from 'react';
import { DashboardSettings } from '../types';
import { Settings, Save, AlertTriangle, ShieldAlert, BadgeCheck, HelpCircle } from 'lucide-react';

interface PengaturanViewProps {
  settings: DashboardSettings;
  onUpdateSettings: (settings: DashboardSettings) => void;
}

export default function PengaturanView({
  settings,
  onUpdateSettings
}: PengaturanViewProps) {
  // Local form states
  const [minCalorie, setMinCalorie] = useState(settings.targetCalorieMin);
  const [maxCalorie, setMaxCalorie] = useState(settings.targetCalorieMax);
  const [minProtein, setMinProtein] = useState(settings.targetProteinMin);
  const [maxProtein, setMaxProtein] = useState(settings.targetProteinMax);
  const [priceLimit, setPriceLimit] = useState(settings.porsiPriceLimit);
  const [minister, setMinister] = useState(settings.namaMenteri);
  const [jurisdiction, setJurisdiction] = useState(settings.wilayahKerja);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (minCalorie >= maxCalorie || minProtein >= maxProtein) {
      alert('Batas minimum harus lebih kecil dari batas maksimum!');
      return;
    }

    const updatedSettings: DashboardSettings = {
      targetCalorieMin: minCalorie,
      targetCalorieMax: maxCalorie,
      targetProteinMin: minProtein,
      targetProteinMax: maxProtein,
      porsiPriceLimit: priceLimit,
      namaMenteri: minister,
      wilayahKerja: jurisdiction
    };

    onUpdateSettings(updatedSettings);
    alert('Konfigurasi target gizi, harga porsi, dan metadata kementerian berhasil diperbarui secara nasional!');
  };

  return (
    <div className="space-y-6" id="pengaturan-view-root">
      
      {/* Header section */}
      <div>
        <h2 className="text-xl font-bold font-display text-gray-900 flex items-center gap-2">
          <Settings className="text-emerald-600" />
          Konfigurasi & Parameter Kebijakan
        </h2>
        <p className="text-sm text-gray-500">
          Ubah parameter standar gizi gizi nasional, harga referensi porsi katering kementerian, dan identitas menteri koordinator.
        </p>
      </div>

      {/* Main Form container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form left inputs columns */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-xs space-y-6">
          
          {/* Section: Nutrition Targets Standar */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
              1. Standar AKG (Angka Kecukupan Gizi) Porsi
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Calories Target */}
              <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl space-y-3">
                <span className="text-xs font-bold text-slate-700 block">Kisaran Energi Kalori (kcal)</span>
                
                <div className="flex items-center gap-2">
                  <div className="space-y-1-xs flex-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Minimum</span>
                    <input 
                      type="number"
                      value={minCalorie}
                      onChange={(e) => setMinCalorie(Number(e.target.value))}
                      className="w-full text-xs font-semibold border border-gray-200 rounded p-2 bg-white"
                    />
                  </div>

                  <div className="space-y-1-xs flex-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Maksimum</span>
                    <input 
                      type="number"
                      value={maxCalorie}
                      onChange={(e) => setMaxCalorie(Number(e.target.value))}
                      className="w-full text-xs font-semibold border border-gray-200 rounded p-2 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Protein Target */}
              <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl space-y-3">
                <span className="text-xs font-bold text-slate-700 block">Kisaran Protein Pembangun (gr)</span>
                
                <div className="flex items-center gap-2">
                  <div className="space-y-1-xs flex-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Minimum</span>
                    <input 
                      type="number"
                      value={minProtein}
                      onChange={(e) => setMinProtein(Number(e.target.value))}
                      className="w-full text-xs font-semibold border border-gray-200 rounded p-2 bg-white"
                    />
                  </div>

                  <div className="space-y-1-xs flex-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Maksimum</span>
                    <input 
                      type="number"
                      value={maxProtein}
                      onChange={(e) => setMaxProtein(Number(e.target.value))}
                      className="w-full text-xs font-semibold border border-gray-200 rounded p-2 bg-white"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section: Fiscal Standar / Unit Price limit */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
              2. Batas Tertinggi Anggaran Porsi (HPS-MBG)
            </h3>

            <div className="space-y-1.5 max-w-sm">
              <label className="text-xs font-bold text-gray-600 block">Harga Maksimum Referensi (Rupiah per Porsi)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-700">Rp</span>
                <input 
                  type="number"
                  min={5000}
                  max={50000}
                  value={priceLimit}
                  onChange={(e) => setPriceLimit(Number(e.target.value))}
                  className="w-full text-xs font-bold border border-gray-200 rounded-lg pl-9 pr-4 py-2.5"
                />
              </div>
              <span className="text-[10px] text-gray-400 block">Dapur katering dilarang membuat rancangan menu melebihi pagu ini.</span>
            </div>
          </div>

          {/* Section: Ministry metadata */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
              3. Branding & Pengesahan Audit Kementerian
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-gray-600 block">Branding Jabatan Kementerian</span>
                <input 
                  type="text"
                  required
                  value={minister}
                  onChange={(e) => setMinister(e.target.value)}
                  className="w-full text-xs font-bold border border-gray-200 rounded-lg p-2.5 text-gray-800"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-gray-600 block">Wilayah / Yurisdiksi Kerja</span>
                <input 
                  type="text"
                  required
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="w-full text-xs font-bold border border-gray-200 rounded-lg p-2.5 text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-5 border-t border-gray-100">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Save size={16} /> Simpan Semua Konfigurasi
            </button>
          </div>

        </form>

        {/* Informative widget right side */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white">
            <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-1.5 font-display mb-3">
              <BadgeCheck size={18} />
              Status Sinkronisasi Kebijakan
            </h4>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Semua parameter dan kebijakan target kalori yang Anda simpan di halaman ini secara instan terdistribusi ke seluruh modul: Dashboard Utama, Alat Analisis Gizi, serta Validasi Pengajuan Menu Katering.
            </p>

            <div className="border-t border-slate-800 pt-4 mt-4 space-y-2 text-[11px] font-mono text-slate-400">
              <p className="flex justify-between"><span>Database:</span> <strong className="text-emerald-400">AKTIF / LOCAL</strong></p>
              <p className="flex justify-between"><span>Standar KAN:</span> <strong className="text-emerald-400">TERKAIT</strong></p>
              <p className="flex justify-between"><span>Sesi Audit:</span> <strong className="text-white">2026-Q2</strong></p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-slate-900 flex gap-3 text-xs leading-relaxed">
            <ShieldAlert className="text-red-600 shrink-0 mt-0.5" size={18} />
            <div>
              <strong className="text-red-950 font-display block mb-1">Perhatian Keamanan Sistem</strong>
              Setiap kali Anda menaikkan pagu referensi HPS melebihi limits nasional (e.g. &gt; Rp 20,000), sistem akan membubuhkan log peringatan otomatis di manifes audit BPK RI.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
