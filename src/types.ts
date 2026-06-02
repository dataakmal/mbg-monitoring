export interface Sekolah {
  id_sekolah: string;
  nama_sekolah: string;
  provinsi: string;
  kabupaten: string;
  jumlah_siswa: number;
}

export interface MenuMakanan {
  id_menu: string;
  nama_menu: string;
  foto_menu: string;
  kalori: number;      // kcal
  protein: number;     // gr
  karbohidrat: number;  // gr
  lemak: number;       // gr
  harga: number;       // IDR per porsi
  status_aktif: boolean;
  kategori: 'Nasi Lengkap' | 'Susu & Snack' | 'Bubur' | 'Lainnya';
}

export interface Distribusi {
  id_distribusi: string;
  tanggal: string;
  id_sekolah: string;
  nama_sekolah: string; // denormalized for search ease
  jumlah_porsi: number;
  status: 'selesai' | 'proses' | 'terlambat';
  sekolah_kabupaten_provinsi?: string;
  kurir_nama?: string;
  waktu_est?: string;
}

export interface MonitoringGizi {
  id_gizi: string;
  tanggal: string;
  id_sekolah: string;
  nama_sekolah: string;
  rata_kalori: number;
  rata_protein: number;
  rata_karbohidrat: number;
  rata_lemak: number;
}

export interface StokBahan {
  id_bahan: string;
  nama_bahan: string;
  kategori: 'Karbohidrat' | 'Protein Hewani' | 'Protein Nabati' | 'Sayuran' | 'Susu' | 'Bumbu';
  stok_kg: number;
  min_stok_kg: number;
  satuan: string;
  status: 'Aman' | 'Peringatan' | 'Kritis';
  terakhir_diperbarui: string;
}

export interface DashboardSettings {
  targetCalorieMin: number;
  targetCalorieMax: number;
  targetProteinMin: number;
  targetProteinMax: number;
  porsiPriceLimit: number;
  namaMenteri: string;
  wilayahKerja: string;
}
