import React, { useState, useEffect } from 'react';
import { 
  Sekolah, MenuMakanan, Distribusi, StokBahan, 
  DashboardSettings, MonitoringGizi 
} from './types';
import { 
  initialSekolah, initialMenus, initialDistribusi, 
  initialStokBahan, initialSettings, initialMonitoringGizi 
} from './data';

// Component imports
import DashboardOverview from './components/DashboardOverview';
import DataSekolahView from './components/DataSekolahView';
import DataSiswaView from './components/DataSiswaView';
import MenuMakananView from './components/MenuMakananView';
import MonitoringDistribusiView from './components/MonitoringDistribusiView';
import StokBahanView from './components/StokBahanView';
import MonitoringGiziView from './components/MonitoringGiziView';
import LaporanView from './components/LaporanView';
import PengaturanView from './components/PengaturanView';

// Icon imports
import { 
  LayoutDashboard, GraduationCap, Users, Utensils, 
  Truck, PackageOpen, Activity, FileSpreadsheet, Settings, 
  Menu, X, ChevronLeft, ChevronRight, User, Clock, ShieldCheck
} from 'lucide-react';

export default function App() {
  // Navigation & UI controls
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core Global States
  const [sekolahList, setSekolahList] = useState<Sekolah[]>(initialSekolah);
  const [menuList, setMenuList] = useState<MenuMakanan[]>(initialMenus);
  const [distribusiList, setDistribusiList] = useState<Distribusi[]>(initialDistribusi);
  const [stokList, setStokList] = useState<StokBahan[]>(initialStokBahan);
  const [settings, setSettings] = useState<DashboardSettings>(initialSettings);
  const [giziList, setGiziList] = useState<MonitoringGizi[]>(initialMonitoringGizi);
  const [selectedProvince, setSelectedProvince] = useState('Semua');

  // Sync calculations for logs when list updates
  useEffect(() => {
    // Optional client side persistence or auditing block
  }, [sekolahList, menuList, distribusiList, stokList, settings]);

  // State modifiers (callbacks)
  
  // 1. Schools modifications
  const handleAddSekolah = (newSekolah: Sekolah) => {
    setSekolahList(prev => [newSekolah, ...prev]);
  };

  const handleEditSekolah = (updated: Sekolah) => {
    setSekolahList(prev => prev.map(item => item.id_sekolah === updated.id_sekolah ? updated : item));
    // Propagate changes to distributions/gizi denormalized details
    setDistribusiList(prev => prev.map(d => d.id_sekolah === updated.id_sekolah ? {
      ...d,
      nama_sekolah: updated.nama_sekolah,
      sekolah_kabupaten_provinsi: `${updated.kabupaten}, ${updated.provinsi}`
    } : d));
  };

  const handleDeleteSekolah = (id: string) => {
    setSekolahList(prev => prev.filter(item => item.id_sekolah !== id));
    setDistribusiList(prev => prev.filter(d => d.id_sekolah !== id));
  };

  // 2. Menu modifications
  const handleAddMenu = (newMenu: MenuMakanan) => {
    setMenuList(prev => [newMenu, ...prev]);
  };

  const handleEditMenu = (updated: MenuMakanan) => {
    setMenuList(prev => prev.map(item => item.id_menu === updated.id_menu ? updated : item));
  };

  const handleDeleteMenu = (id: string) => {
    setMenuList(prev => prev.filter(item => item.id_menu !== id));
  };

  // 3. Distribution modifications (Updating Delivery states)
  const handleUpdateStatus = (idDist: string, newStatus: 'selesai' | 'proses' | 'terlambat') => {
    setDistribusiList(prev => prev.map(d => d.id_distribusi === idDist ? { ...d, status: newStatus } : d));
  };

  const handleAddDistribusi = (newDist: Distribusi) => {
    setDistribusiList(prev => [newDist, ...prev]);
  };

  // 4. Stock management additions
  const handleAddStock = (idBahan: string, amountKg: number) => {
    setStokList(prev => prev.map(item => {
      if (item.id_bahan === idBahan) {
        const nextQty = item.stok_kg + amountKg;
        const nextStatus = nextQty <= item.min_stok_kg ? 'Kritis' : 
                           nextQty <= item.min_stok_kg * 1.5 ? 'Peringatan' : 'Aman';
        return {
          ...item,
          stok_kg: nextQty,
          status: nextStatus,
          terakhir_diperbarui: '2026-06-02 09:12'
        };
      }
      return item;
    }));
  };

  const handleAddNewIngredient = (item: StokBahan) => {
    setStokList(prev => [item, ...prev]);
  };

  // Sidebar list of nav coordinates
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Data Sekolah', icon: GraduationCap },
    { name: 'Data Siswa', icon: Users },
    { name: 'Menu Makanan', icon: Utensils },
    { name: 'Distribusi', icon: Truck },
    { name: 'Stok Bahan', icon: PackageOpen },
    { name: 'Monitoring Gizi', icon: Activity },
    { name: 'Laporan', icon: FileSpreadsheet },
    { name: 'Pengaturan', icon: Settings },
  ];

  // Active view router switch
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <DashboardOverview 
            sekolahList={sekolahList}
            menuList={menuList}
            distribusiList={distribusiList}
            stokList={stokList}
            onNavigate={(tab) => setActiveTab(tab)}
            selectedProvince={selectedProvince}
            setSelectedProvince={setSelectedProvince}
          />
        );
      case 'Data Sekolah':
        return (
          <DataSekolahView 
            sekolahList={sekolahList}
            onAddSekolah={handleAddSekolah}
            onEditSekolah={handleEditSekolah}
            onDeleteSekolah={handleDeleteSekolah}
          />
        );
      case 'Data Siswa':
        return (
          <DataSiswaView 
            sekolahList={sekolahList}
          />
        );
      case 'Menu Makanan':
        return (
          <MenuMakananView 
            menuList={menuList}
            onAddMenu={handleAddMenu}
            onEditMenu={handleEditMenu}
            onDeleteMenu={handleDeleteMenu}
          />
        );
      case 'Distribusi':
        return (
          <MonitoringDistribusiView 
            distribusiList={distribusiList}
            sekolahList={sekolahList}
            onUpdateStatus={handleUpdateStatus}
            onAddDistribusi={handleAddDistribusi}
          />
        );
      case 'Stok Bahan':
        return (
          <StokBahanView 
            stokList={stokList}
            onAddStock={handleAddStock}
            onAddNewIngredient={handleAddNewIngredient}
          />
        );
      case 'Monitoring Gizi':
        return (
          <MonitoringGiziView 
            giziList={giziList}
            sekolahList={sekolahList}
            settings={settings}
          />
        );
      case 'Laporan':
        return (
          <LaporanView 
            distribusiList={distribusiList}
            sekolahList={sekolahList}
          />
        );
      case 'Pengaturan':
        return (
          <PengaturanView 
            settings={settings}
            onUpdateSettings={(newSet) => setSettings(newSet)}
          />
        );
      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans antialiased" id="mbg-dashboard-app">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside 
        className={`hidden md:flex flex-col bg-slate-900 text-slate-200 border-r border-slate-950 transition-all duration-300 select-none print:hidden shrink-0 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-950">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img 
              src="/assets/public/logo-bgn.png" 
              alt="Logo BGN" 
              className="w-10 h-10 min-w-10 object-contain drop-shadow-[0_0_8px_rgba(37,150,190,0.3)]"
              referrerPolicy="no-referrer"
            />
            {!isSidebarCollapsed && (
              <div>
                <h1 className="font-extrabold text-sm text-white font-display tracking-tight leading-none">
                  MBG Dashboard
                </h1>
                <span className="text-[9px] font-extrabold text-amber-500 tracking-wider uppercase leading-none mt-1 block">
                  Badan Gizi Nasional
                </span>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isSidebarCollapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>
        </div>

        {/* Sidebar Nav links */}
        <nav className="flex-1 py-4 px-2.5 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-500/15 text-emerald-300 border-l-4 border-emerald-500 font-extrabold shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <Icon size={17} className={`${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                {!isSidebarCollapsed && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Account summary in footer of sidebar */}
        <div className="p-4 border-t border-slate-950 flex items-center gap-3 overflow-hidden text-xs">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
            <User size={15} className="text-slate-300" />
          </div>
          {!isSidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white truncate leading-none">Admin Pusat</p>
              <p className="text-[10px] text-slate-500 truncate mt-1">kementerian@go.id</p>
            </div>
          )}
        </div>
      </aside>

      {/* 2. MOBILE HEADER & NAVIGATION DRAWER */}
      <div className="md:hidden print:hidden fixed top-0 left-0 right-0 h-14 bg-slate-900 border-b border-slate-950 flex items-center justify-between px-4 z-40 text-white">
        <div className="flex items-center gap-2">
          <img 
            src="/assets/public/logo-bgn.png" 
            alt="Logo BGN" 
            className="w-8 h-8 object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="font-bold font-display text-sm">MBG Dashboard</span>
        </div>

        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 px-2 hover:bg-slate-800 rounded-md text-slate-200 cursor-pointer"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar overlay Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setIsMobileMenuOpen(false)}>
          <aside 
            className="w-60 h-full bg-slate-950 text-slate-100 flex flex-col p-4 space-y-4 animate-in slide-in-from-left duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold font-display text-sm">Navigation Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveTab(item.name);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-emerald-600/20 text-emerald-400 font-extrabold border-l-4 border-emerald-500' 
                        : 'text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* 3. MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 pt-14 md:pt-0">
        
        {/* Top Header details panel */}
        <header className="h-16 bg-white border-b border-gray-100 px-6 hidden sm:flex items-center justify-between shadow-xs print:hidden">
          <div className="flex items-center gap-6 text-xs text-slate-500 font-medium select-none">
            {/* Jurisdiction Badge */}
            <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider font-mono flex items-center gap-1">
              <ShieldCheck size={13} className="text-slate-500" />
              YURISDIKSI: {settings.wilayahKerja.toUpperCase()}
            </span>

            {/* Simulated Live status and date */}
            <span className="flex items-center gap-1 font-mono font-bold text-slate-500">
              <Clock size={13} /> 
              02 Juni 2026, 09:05 WIB
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="text-slate-400">Operator Akun:</span>
            <span className="text-emerald-600 bg-emerald-50/60 border border-emerald-100 px-2 py-1 rounded-lg">
              Akmalfauzan2910@gmail.com
            </span>
          </div>
        </header>

        {/* Content body wrapper with scroll */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto no-scrollbar max-w-7xl w-full mx-auto">
          {renderActiveComponent()}
        </div>

      </main>

    </div>
  );
}
