import { Sekolah, MenuMakanan, Distribusi, MonitoringGizi, StokBahan, DashboardSettings } from './types';

export const initialSekolah: Sekolah[] = [
  { id_sekolah: 'SCH-001', nama_sekolah: 'SDN 01 Menteng', provinsi: 'DKI Jakarta', kabupaten: 'Jakarta Pusat', jumlah_siswa: 450 },
  { id_sekolah: 'SCH-002', nama_sekolah: 'SMPN 115 Jakarta', provinsi: 'DKI Jakarta', kabupaten: 'Jakarta Selatan', jumlah_siswa: 820 },
  { id_sekolah: 'SCH-003', nama_sekolah: 'SD Negeri Siliwangi', provinsi: 'Jawa Barat', kabupaten: 'Bandung', jumlah_siswa: 380 },
  { id_sekolah: 'SCH-004', nama_sekolah: 'SMPN 1 Bandung', provinsi: 'Jawa Barat', kabupaten: 'Bandung', jumlah_siswa: 670 },
  { id_sekolah: 'SCH-005', nama_sekolah: 'SDN 03 Keputran', provinsi: 'Jawa Timur', kabupaten: 'Surabaya', jumlah_siswa: 510 },
  { id_sekolah: 'SCH-006', nama_sekolah: 'SMPN 1 Surabaya', provinsi: 'Jawa Timur', kabupaten: 'Surabaya', jumlah_siswa: 940 },
  { id_sekolah: 'SCH-007', nama_sekolah: 'SDN 10 Kuta', provinsi: 'Bali', kabupaten: 'Badung', jumlah_siswa: 320 },
  { id_sekolah: 'SCH-008', nama_sekolah: 'SMP 1 Denpasar', provinsi: 'Bali', kabupaten: 'Denpasar', jumlah_siswa: 750 },
  { id_sekolah: 'SCH-009', nama_sekolah: 'SDN 05 Merdeka', provinsi: 'Sumatera Utara', kabupaten: 'Medan', jumlah_siswa: 410 },
  { id_sekolah: 'SCH-010', nama_sekolah: 'SMPN 3 Medan', provinsi: 'Sumatera Utara', kabupaten: 'Medan', jumlah_siswa: 880 },
  { id_sekolah: 'SCH-011', nama_sekolah: 'SDN Karangtengah 1', provinsi: 'Jawa Tengah', kabupaten: 'Semarang', jumlah_siswa: 490 },
  { id_sekolah: 'SCH-012', nama_sekolah: 'SMPN 2 Semarang', provinsi: 'Jawa Tengah', kabupaten: 'Semarang', jumlah_siswa: 810 },
  { id_sekolah: 'SCH-013', nama_sekolah: 'SDN 12 Pettarani', provinsi: 'Sulawesi Selatan', kabupaten: 'Makassar', jumlah_siswa: 340 },
  { id_sekolah: 'SCH-014', nama_sekolah: 'SMPN 6 Makassar', provinsi: 'Sulawesi Selatan', kabupaten: 'Makassar', jumlah_siswa: 790 },
  { id_sekolah: 'SCH-015', nama_sekolah: 'SDN 02 Jayapura', provinsi: 'Papua', kabupaten: 'Jayapura', jumlah_siswa: 280 }
];

export const initialMenus: MenuMakanan[] = [
  {
    id_menu: 'MN-001',
    nama_menu: 'Nasi Ayam Teriyaki & Tumis Sayur',
    foto_menu: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    kalori: 650,
    protein: 35,
    karbohidrat: 70,
    lemak: 18,
    harga: 15000,
    status_aktif: true,
    kategori: 'Nasi Lengkap'
  },
  {
    id_menu: 'MN-002',
    nama_menu: 'Nasi Soto Ayam Merdeka & Telur Rebus',
    foto_menu: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=500&auto=format&fit=crop&q=80',
    kalori: 610,
    protein: 32,
    karbohidrat: 65,
    lemak: 15,
    harga: 14500,
    status_aktif: true,
    kategori: 'Nasi Lengkap'
  },
  {
    id_menu: 'MN-003',
    nama_menu: 'Nasi Kuning Nusantara & Orek Tempe',
    foto_menu: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80',
    kalori: 580,
    protein: 28,
    karbohidrat: 75,
    lemak: 14,
    harga: 13500,
    status_aktif: true,
    kategori: 'Nasi Lengkap'
  },
  {
    id_menu: 'MN-004',
    nama_menu: 'Bubur Kacang Hijau Spesial & Pisang',
    foto_menu: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80',
    kalori: 450,
    protein: 18,
    karbohidrat: 82,
    lemak: 8,
    harga: 11000,
    status_aktif: true,
    kategori: 'Bubur'
  },
  {
    id_menu: 'MN-005',
    nama_menu: 'Macaroni Keju Panggang & Brokoli',
    foto_menu: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&auto=format&fit=crop&q=80',
    kalori: 630,
    protein: 29,
    karbohidrat: 68,
    lemak: 22,
    harga: 16000,
    status_aktif: true,
    kategori: 'Lainnya'
  },
  {
    id_menu: 'MN-006',
    nama_menu: 'Susu UHT & Roti Gandum Selai Srikaya',
    foto_menu: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
    kalori: 420,
    protein: 16,
    karbohidrat: 60,
    lemak: 12,
    harga: 10500,
    status_aktif: false,
    kategori: 'Susu & Snack'
  }
];

export const initialDistribusi: Distribusi[] = [
  {
    id_distribusi: 'DST-101',
    tanggal: '2026-06-02',
    id_sekolah: 'SCH-001',
    nama_sekolah: 'SDN 01 Menteng',
    jumlah_porsi: 450,
    status: 'selesai',
    sekolah_kabupaten_provinsi: 'Jakarta Pusat, DKI Jakarta',
    kurir_nama: 'Pak Rudi Hartono (Trasnport Logistik DKI)',
    waktu_est: '08:30 WIB'
  },
  {
    id_distribusi: 'DST-102',
    tanggal: '2026-06-02',
    id_sekolah: 'SCH-002',
    nama_sekolah: 'SMPN 115 Jakarta',
    jumlah_porsi: 820,
    status: 'selesai',
    sekolah_kabupaten_provinsi: 'Jakarta Selatan, DKI Jakarta',
    kurir_nama: 'Pak Bambang (Trans-Jakarta Cargo)',
    waktu_est: '08:15 WIB'
  },
  {
    id_distribusi: 'DST-103',
    tanggal: '2026-06-02',
    id_sekolah: 'SCH-003',
    nama_sekolah: 'SD Negeri Siliwangi',
    jumlah_porsi: 380,
    status: 'proses',
    sekolah_kabupaten_provinsi: 'Bandung, Jawa Barat',
    kurir_nama: 'Mang Dadang (Logistik Priangan)',
    waktu_est: '10:00 WIB'
  },
  {
    id_distribusi: 'DST-104',
    tanggal: '2026-06-02',
    id_sekolah: 'SCH-004',
    nama_sekolah: 'SMPN 1 Bandung',
    jumlah_porsi: 670,
    status: 'selesai',
    sekolah_kabupaten_provinsi: 'Bandung, Jawa Barat',
    kurir_nama: 'Candra Logistik',
    waktu_est: '08:45 WIB'
  },
  {
    id_distribusi: 'DST-105',
    tanggal: '2026-06-02',
    id_sekolah: 'SCH-005',
    nama_sekolah: 'SDN 03 Keputran',
    jumlah_porsi: 510,
    status: 'terlambat',
    sekolah_kabupaten_provinsi: 'Surabaya, Jawa Timur',
    kurir_nama: 'Cak Soni (Ekspedisi Jatim Express)',
    waktu_est: '10:30 WIB'
  },
  {
    id_distribusi: 'DST-106',
    tanggal: '2026-06-02',
    id_sekolah: 'SCH-006',
    nama_sekolah: 'SMPN 1 Surabaya',
    jumlah_porsi: 940,
    status: 'proses',
    sekolah_kabupaten_provinsi: 'Surabaya, Jawa Timur',
    kurir_nama: 'Cak Soni (Ekspedisi Jatim Express)',
    waktu_est: '09:45 WIB'
  },
  {
    id_distribusi: 'DST-107',
    tanggal: '2026-06-02',
    id_sekolah: 'SCH-007',
    nama_sekolah: 'SDN 10 Kuta',
    jumlah_porsi: 320,
    status: 'selesai',
    sekolah_kabupaten_provinsi: 'Badung, Bali',
    kurir_nama: 'I Ketut Sumarta (Bali Cargo)',
    waktu_est: '08:00 WITA'
  },
  {
    id_distribusi: 'DST-108',
    tanggal: '2026-06-01',
    id_sekolah: 'SCH-008',
    nama_sekolah: 'SMP 1 Denpasar',
    jumlah_porsi: 750,
    status: 'selesai',
    sekolah_kabupaten_provinsi: 'Denpasar, Bali',
    kurir_nama: 'Airlangga Trans',
    waktu_est: '08:30 WITA'
  }
];

export const initialMonitoringGizi: MonitoringGizi[] = [
  { id_gizi: 'GZ-001', tanggal: '2026-06-02', id_sekolah: 'SCH-001', nama_sekolah: 'SDN 01 Menteng', rata_kalori: 650, rata_protein: 35, rata_karbohidrat: 70, rata_lemak: 18 },
  { id_gizi: 'GZ-002', tanggal: '2026-06-02', id_sekolah: 'SCH-002', nama_sekolah: 'SMPN 115 Jakarta', rata_kalori: 650, rata_protein: 35, rata_karbohidrat: 70, rata_lemak: 18 },
  { id_gizi: 'GZ-003', tanggal: '2026-06-02', id_sekolah: 'SCH-003', nama_sekolah: 'SD Negeri Siliwangi', rata_kalori: 610, rata_protein: 32, rata_karbohidrat: 65, rata_lemak: 15 },
  { id_gizi: 'GZ-004', tanggal: '2026-06-02', id_sekolah: 'SCH-004', nama_sekolah: 'SMPN 1 Bandung', rata_kalori: 580, rata_protein: 28, rata_karbohidrat: 75, rata_lemak: 14 },
  { id_gizi: 'GZ-005', tanggal: '2026-06-02', id_sekolah: 'SCH-005', nama_sekolah: 'SDN 03 Keputran', rata_kalori: 610, rata_protein: 32, rata_karbohidrat: 65, rata_lemak: 15 },
  { id_gizi: 'GZ-006', tanggal: '2026-06-01', id_sekolah: 'SCH-006', nama_sekolah: 'SMPN 1 Surabaya', rata_kalori: 650, rata_protein: 35, rata_karbohidrat: 70, rata_lemak: 18 },
  { id_gizi: 'GZ-007', tanggal: '2026-06-01', id_sekolah: 'SCH-001', nama_sekolah: 'SDN 01 Menteng', rata_kalori: 585, rata_protein: 30, rata_karbohidrat: 72, rata_lemak: 16 }
];

export const initialStokBahan: StokBahan[] = [
  { id_bahan: 'STK-001', nama_bahan: 'Beras Premium Cianjur', kategori: 'Karbohidrat', stok_kg: 4500, min_stok_kg: 1000, satuan: 'kg', status: 'Aman', terakhir_diperbarui: '2026-06-02 07:00' },
  { id_bahan: 'STK-002', nama_bahan: 'Daging Ayam Fillet Segar', kategori: 'Protein Hewani', stok_kg: 850, min_stok_kg: 500, satuan: 'kg', status: 'Aman', terakhir_diperbarui: '2026-06-02 06:15' },
  { id_bahan: 'STK-003', nama_bahan: 'Tahu & Tempe Organik', kategori: 'Protein Nabati', stok_kg: 120, min_stok_kg: 200, satuan: 'kg', status: 'Kritis', terakhir_diperbarui: '2026-06-02 06:00' },
  { id_bahan: 'STK-004', nama_bahan: 'Brokoli & Wortel Lembang', kategori: 'Sayuran', stok_kg: 350, min_stok_kg: 400, satuan: 'kg', status: 'Peringatan', terakhir_diperbarui: '2026-06-02 06:30' },
  { id_bahan: 'STK-005', nama_bahan: 'Susu Sapi UHT Cair', kategori: 'Susu', stok_kg: 12000, min_stok_kg: 3000, satuan: 'liter', status: 'Aman', terakhir_diperbarui: '2026-06-02 05:00' },
  { id_bahan: 'STK-006', nama_bahan: 'Telur Ayam Ras Grade A', kategori: 'Protein Hewani', stok_kg: 950, min_stok_kg: 300, satuan: 'kg', status: 'Aman', terakhir_diperbarui: '2026-06-02 06:15' },
  { id_bahan: 'STK-007', nama_bahan: 'Minyak Goreng Sawit', kategori: 'Bumbu', stok_kg: 400, min_stok_kg: 150, satuan: 'liter', status: 'Aman', terakhir_diperbarui: '2026-06-01 09:00' }
];

export const initialSettings: DashboardSettings = {
  targetCalorieMin: 550,
  targetCalorieMax: 700,
  targetProteinMin: 25,
  targetProteinMax: 40,
  porsiPriceLimit: 17500,
  namaMenteri: 'Menteri Koordinator Bidang Pembangunan Manusia dan Kebudayaan',
  wilayahKerja: 'Dashboard Monitoring MBG (Demo) Created by Akmal Fauzan'
};
