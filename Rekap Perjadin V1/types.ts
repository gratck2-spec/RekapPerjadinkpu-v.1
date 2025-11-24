export enum VehicleType {
  PRIBADI = 'Pribadi',
  DINAS = 'Dinas',
  PESAWAT = 'Umum-Pesawat',
  KERETA = 'Umum-Kereta',
  BUS_TRAVEL = 'Umum-BusTravel',
  KAPAL = 'Umum-Kapal'
}

export interface Trip {
  id?: string;
  nama: string;
  tujuan: string;
  hotelName?: string; // Menambahkan nama hotel
  tanggalMulai: string;
  tanggalSelesai: string;
  tujuanPerjalanan: string;
  jenisKendaraan: string;
  nomorTiket?: string;
  tempatDuduk?: string;
  nomorSurat: string;
  nomorNotaDinas: string;
  notaDinasFileUrl?: string;
  
  // Costs
  biayaBBM: number;
  biayaTOL: number;
  akomodasi: number;
  uangMakan: number;
  transportLokal: number;
  hargaTiket: number;
  totalBiaya: number;
  
  addedByUserId?: string | null;
}

// Declaration for the injected environment variables
declare global {
  interface Window {
    __app_id?: string;
    __firebase_config?: string;
    __initial_auth_token?: string;
  }
}
