import React, { useState } from 'react';
import { MenuMakanan } from '../types';
import { Search, Plus, Eye, Edit2, Trash2, X, PlusCircle, Sparkles, Flame, Percent, ShieldCheck } from 'lucide-react';

interface MenuMakananViewProps {
  menuList: MenuMakanan[];
  onAddMenu: (menu: MenuMakanan) => void;
  onEditMenu: (menu: MenuMakanan) => void;
  onDeleteMenu: (id: string) => void;
}

export default function MenuMakananView({
  menuList,
  onAddMenu,
  onEditMenu,
  onDeleteMenu
}: MenuMakananViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | 'Nasi Lengkap' | 'Susu & Snack' | 'Bubur' | 'Lainnya'>('Semua');

  // Detail Modal
  const [selectedMenu, setSelectedMenu] = useState<MenuMakanan | null>(null);

  // CRUD Forms
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'tambah' | 'edit'>('tambah');
  const [curMenu, setCurMenu] = useState<MenuMakanan | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [category, setCategory] = useState<'Nasi Lengkap' | 'Susu & Snack' | 'Bubur' | 'Lainnya'>('Nasi Lengkap');
  const [calories, setCalories] = useState(600);
  const [protein, setProtein] = useState(30);
  const [carbs, setCarbs] = useState(70);
  const [fats, setFats] = useState(15);
  const [price, setPrice] = useState(15000);
  const [active, setActive] = useState(true);

  // Filter logic
  const filteredMenus = menuList.filter(m => {
    const matchesSearch = m.nama_menu.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'Semua' || m.kategori === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setFormMode('tambah');
    setName('');
    // High-quality food stock photos by default
    setPhoto('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80');
    setCategory('Nasi Lengkap');
    setCalories(600);
    setProtein(30);
    setCarbs(70);
    setFats(15);
    setPrice(15000);
    setActive(true);
    setCurMenu(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (menu: MenuMakanan, e: React.MouseEvent) => {
    e.stopPropagation(); // don't open view detail modal
    setFormMode('edit');
    setCurMenu(menu);
    setName(menu.nama_menu);
    setPhoto(menu.foto_menu);
    setCategory(menu.kategori);
    setCalories(menu.kalori);
    setProtein(menu.protein);
    setCarbs(menu.karbohidrat);
    setFats(menu.lemak);
    setPrice(menu.harga);
    setActive(menu.status_aktif);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm('Apakah Anda yakin ingin menghapus menu ini dari daftar program?')) {
      onDeleteMenu(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!name || price <= 0 || calories <= 0) {
      alert('Nama, harga, dan kalori harus diisi dengan benar!');
      return;
    }

    if (formMode === 'tambah') {
      const newMenu: MenuMakanan = {
        id_menu: `MN-${String(menuList.length + 1).padStart(3, '0')}`,
        nama_menu: name,
        foto_menu: photo || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
        kalori: calories,
        protein: protein,
        karbohidrat: carbs,
        lemak: fats,
        harga: price,
        status_aktif: active,
        kategori: category
      };
      onAddMenu(newMenu);
    } else if (formMode === 'edit' && curMenu) {
      const updatedMenu: MenuMakanan = {
        ...curMenu,
        nama_menu: name,
        foto_menu: photo,
        kalori: calories,
        protein: protein,
        karbohidrat: carbs,
        lemak: fats,
        harga: price,
        status_aktif: active,
        kategori: category
      };
      onEditMenu(updatedMenu);
    }
    setIsFormOpen(false);
  };

  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="space-y-6" id="menu-makanan-view-root">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-gray-900 flex items-center gap-2">
            <Sparkles className="text-emerald-600 animate-spin-pulse" />
            Manajemen Nutrisi & Menu Makanan
          </h2>
          <p className="text-sm text-gray-500">
            Katalog piring sehat program Makan Bergizi Gratis sesuai target angka kecukupan gizi (AKG) nasional.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <PlusCircle size={18} /> Tambah Menu Baru
        </button>
      </div>

      {/* Categories & Search Panel */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
            <input
              type="text"
              placeholder="Cari menu sehat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(['Semua', 'Nasi Lengkap', 'Bubur', 'Susu & Snack', 'Lainnya'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenus.map((menu) => (
          <div
            key={menu.id_menu}
            onClick={() => setSelectedMenu(menu)}
            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md cursor-pointer transition-all duration-200 hover:-translate-y-1"
          >
            {/* Image Box */}
            <div className="relative aspect-video bg-gray-100 overflow-hidden">
              <img
                src={menu.foto_menu}
                alt={menu.nama_menu}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 px-2.5 py-0.5 rounded-full border border-slate-700">
                  {menu.kategori}
                </span>
                {!menu.status_aktif && (
                  <span className="bg-red-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full tracking-wider border border-red-400">
                    Nonaktif
                  </span>
                )}
              </div>
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-gray-900 text-xs font-extrabold px-3 py-1 rounded-lg border border-gray-100 shadow-sm">
                {formatIDR(menu.harga)}
              </div>

              {/* Cover overlays on Hover with visual tips */}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <span className="bg-white text-slate-900 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 shadow-md">
                  <Eye size={14} /> Lihat Gizi Lengkap
                </span>
              </div>
            </div>

            {/* Nutrition summaries */}
            <div className="p-4 space-y-3">
              <h4 className="font-bold font-display text-gray-900 text-base leading-snug truncate">
                {menu.nama_menu}
              </h4>

              {/* Energy counters */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-orange-50/50 p-1 rounded-lg border border-orange-100">
                  <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider flex items-center justify-center gap-0.5">
                    <Flame size={9} /> Energi
                  </p>
                  <p className="text-xs font-black text-orange-950">{menu.kalori} kcal</p>
                </div>

                <div className="bg-emerald-50/50 p-1 rounded-lg border border-emerald-100">
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Protein</p>
                  <p className="text-xs font-black text-emerald-950">{menu.protein}g</p>
                </div>

                <div className="bg-blue-50/50 p-1 rounded-lg border border-blue-100">
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Karbo</p>
                  <p className="text-xs font-black text-blue-950">{menu.karbohidrat}g</p>
                </div>

                <div className="bg-amber-50/50 p-1 rounded-lg border border-amber-100">
                  <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Lemak</p>
                  <p className="text-xs font-black text-amber-950">{menu.lemak}g</p>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-3.5">
                <span className="text-[10.5px] text-gray-400 font-semibold font-mono">ID: {menu.id_menu}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleOpenEdit(menu, e)}
                    className="p-1 px-2 text-xs font-bold rounded-lg border border-gray-200 text-gray-600 hover:bg-slate-50 hover:text-emerald-700 transition-colors flex items-center gap-1"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(menu.id_menu, e)}
                    className="p-1 px-2 text-xs font-bold rounded-lg border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredMenus.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-400 bg-white border border-gray-100 rounded-2xl">
            Tidak ada menu yang terdaftar untuk kata kunci / kriteria tersebut.
          </div>
        )}
      </div>

      {/* Card Detail Modal */}
      {selectedMenu && (
        <div className="fixed inset-0 bg-black/60 shadow-2xl backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden border border-gray-100 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            
            {/* Banner image background inside modal */}
            <div className="relative aspect-[21/9] bg-slate-900">
              <img
                src={selectedMenu.foto_menu}
                alt={selectedMenu.nama_menu}
                className="w-full h-full object-cover opacity-85"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedMenu(null)}
                className="absolute top-4 right-4 bg-black/60 text-white hover:bg-black/80 p-2 rounded-full hover:scale-105 transition-all outline-none"
              >
                <X size={18} />
              </button>
              
              <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/10 text-white text-xs font-semibold">
                ID: {selectedMenu.id_menu}
              </div>
            </div>

            {/* Modal Specs */}
            <div className="p-6 space-y-6">
              
              <div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedMenu.kategori}
                </span>
                <h3 className="font-extrabold font-display text-gray-900 text-xl mt-3">
                  {selectedMenu.nama_menu}
                </h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="text-emerald-600" size={16} /> Standardisasi AKG Kementerian Kesehatan RI
                </p>
              </div>

              {/* Balanced Circle Charts or grid */}
              <div className="p-4 bg-gray-55/40 bg-slate-50 border border-gray-100 rounded-2xl">
                <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
                  <span className="text-xs font-bold text-gray-600">DISTRIBUSI GIZI MAKRO NUTRISI:</span>
                  <span className="text-xs font-extrabold text-orange-600 flex items-center gap-1">
                    <Flame size={12} /> {selectedMenu.kalori} Kilokalori (kcal)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Protein */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                      <span>Protein (Aman)</span>
                      <strong className="text-gray-900">{selectedMenu.protein} gr</strong>
                    </div>
                    {/* progress line */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(selectedMenu.protein / 50) * 100}%` }}></div>
                    </div>
                    <p className="text-[10px] text-gray-400">Nutrisi pembangun otot</p>
                  </div>

                  {/* Carbohydrates */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                      <span>Karbohidrat</span>
                      <strong className="text-gray-900">{selectedMenu.karbohidrat} gr</strong>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(selectedMenu.karbohidrat / 120) * 100}%` }}></div>
                    </div>
                    <p className="text-[10px] text-gray-400">Pemberi glukosa & tenaga</p>
                  </div>

                  {/* Fats */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                      <span>Lemak Sehat</span>
                      <strong className="text-gray-900">{selectedMenu.lemak} gr</strong>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(selectedMenu.lemak / 40) * 100}%` }}></div>
                    </div>
                    <p className="text-[10px] text-gray-400">Penunjang perkembangan sel</p>
                  </div>
                </div>
              </div>

              {/* Price and Action Row */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                <div>
                  <span className="text-xs text-gray-400 font-semibold uppercase block">Estimasi Anggaran Porsi</span>
                  <span className="text-xl font-black text-emerald-600 leading-none">{formatIDR(selectedMenu.harga)}</span>
                </div>
                <button
                  onClick={() => setSelectedMenu(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all"
                >
                  Selesai Memeriksa
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* CRUD Add/Edit Form Modal Sheet */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-base text-gray-900 font-display">
                {formMode === 'tambah' ? 'Buat Tambahan Menu Gizi Baru' : 'Edit Item Menu Makanan'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Menu Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">Nama Menu Sehat</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Nasi Ayam Teriyaki & Tumis Sayur"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Photo url */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">URL Foto Makanan (Unsplash/Picsum)</label>
                <input 
                  type="url"
                  placeholder="e.g. https://images.unsplash.com/photo-..."
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">Kategori Menu</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Nasi Lengkap">Nasi Lengkap</option>
                  <option value="Bubur">Bubur</option>
                  <option value="Susu & Snack">Susu & Snack</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {/* Grid: Calories & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">Kalori (kcal)</label>
                  <input 
                    type="number"
                    required
                    min={50}
                    max={2000}
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">Harga / Porsi (Rp)</label>
                  <input 
                    type="number"
                    required
                    min={1000}
                    max={100000}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Grid: protein, carbs, fats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">Protein (g)</label>
                  <input 
                    type="number"
                    required
                    min={0}
                    value={protein}
                    onChange={(e) => setProtein(Number(e.target.value))}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">Karbo (g)</label>
                  <input 
                    type="number"
                    required
                    min={0}
                    value={carbs}
                    onChange={(e) => setCarbs(Number(e.target.value))}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">Lemak (g)</label>
                  <input 
                    type="number"
                    required
                    min={0}
                    value={fats}
                    onChange={(e) => setFats(Number(e.target.value))}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500-xs"
                  />
                </div>
              </div>

              {/* Status Aktif */}
              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox"
                  id="status-aktif-checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded-sm text-emerald-600 focus:ring-emerald-500 border-gray-300 pointer-events-auto cursor-pointer"
                />
                <label htmlFor="status-aktif-checkbox" className="text-xs font-bold text-gray-700 cursor-pointer">
                  Menu Aktif & Siap Disajikan Hari Ini
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-slate-50 border border-gray-200 rounded-lg"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Simpan Menu
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
