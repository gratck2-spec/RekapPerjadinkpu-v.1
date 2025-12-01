import React, { useState } from 'react';
import { FileSpreadsheet, Trash2, ExternalLink, Eye } from 'lucide-react';
import { Trip } from '../types';
import { Modal } from './Modal';

interface TripListProps {
  trips: Trip[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export const TripList: React.FC<TripListProps> = ({ trips, loading, onDelete }) => {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const exportToCsv = () => {
    if (trips.length === 0) return;

    // Header disusun rapi sesuai urutan input di form
    const headers = [
      "Nama Pegawai", 
      "Kota Tujuan",
      "Nama Hotel/Penginapan", 
      "Tanggal Mulai", 
      "Tanggal Selesai", 
      "Keperluan Perjalanan", 
      "Jenis Kendaraan", 
      "Nomor Tiket", 
      "Tempat Duduk", 
      "Biaya BBM (Rp)", 
      "Biaya TOL (Rp)", 
      "Akomodasi (Rp)", 
      "Uang Makan (Rp)", 
      "Transport Lokal (Rp)", 
      "Harga Tiket (Rp)",
      "Total Biaya (Rp)",
      "No. Surat Tugas", 
      "No. Nota Dinas", 
      "Link File Nota"
    ];
    
    const rows = trips.map(trip => [
      `"${(trip.nama || '').replace(/"/g, '""')}"`,
      `"${(trip.tujuan || '').replace(/"/g, '""')}"`,
      `"${(trip.hotelName || '').replace(/"/g, '""')}"`, // Data baru
      trip.tanggalMulai,
      trip.tanggalSelesai,
      `"${(trip.tujuanPerjalanan || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${(trip.jenisKendaraan || '').replace(/"/g, '""')}"`,
      `"${(trip.nomorTiket || '').replace(/"/g, '""')}"`,
      `"${(trip.tempatDuduk || '').replace(/"/g, '""')}"`,
      trip.biayaBBM,
      trip.biayaTOL,
      trip.akomodasi,
      trip.uangMakan,
      trip.transportLokal,
      (trip.hargaTiket ?? 0),
      trip.totalBiaya,
      `"${(trip.nomorSurat || '').replace(/"/g, '""')}"`,
      `"${(trip.nomorNotaDinas || '').replace(/"/g, '""')}"`,
      `"${(trip.notaDinasFileUrl || '').replace(/"/g, '""')}"`
    ]);

    // Menggunakan semicolon (;) sebagai separator agar otomatis rapi di Excel format Indonesia/Eropa
    const csvContent = [
      headers.join(';'),
      ...rows.map(e => e.join(';'))
    ].join('\n');

    // Tambahkan BOM (\uFEFF) agar karakter UTF-8 terbaca benar di Excel
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Rekap_Perjalanan_Dinas_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-full">
      {/* Toolbar */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">Rekap Data</h2>
        <div className="flex gap-2">
          <button 
            onClick={exportToCsv}
            disabled={trips.length === 0}
            className="flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-medium text-sm disabled:opacity-50 shadow-sm"
          >
            <FileSpreadsheet size={18} className="mr-2" /> Export Excel (.csv)
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">Nama & Tujuan</th>
              <th className="px-6 py-3">Tanggal</th>
              <th className="px-6 py-3">Kendaraan</th>
              <th className="px-6 py-3">Keperluan</th>
              <th className="px-6 py-3">Dokumen</th>
              <th className="px-6 py-3 text-right">Total Biaya</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex justify-center items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="mt-2 block text-xs">Memuat Data...</span>
                </td>
              </tr>
            ) : trips.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  Belum ada data perjalanan dinas.
                </td>
              </tr>
            ) : (
              trips.map((trip) => (
                <tr key={trip.id} onClick={() => setSelectedTrip(trip)} className="hover:bg-red-50/50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{trip.nama}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{trip.tujuan}</div>
                    {trip.hotelName && (
                      <div className="text-[10px] text-gray-400 italic mt-0.5">🏨 {trip.hotelName}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md inline-block">
                      {trip.tanggalMulai}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 text-center">s/d</div>
                    <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md inline-block">
                      {trip.tanggalSelesai}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="text-xs font-medium text-gray-700">{trip.jenisKendaraan}</div>
                     {(trip.nomorTiket || trip.tempatDuduk) && (
                       <div className="text-[10px] text-gray-400 mt-1">
                         {trip.nomorTiket && <div>Tiket: {trip.nomorTiket}</div>}
                         {trip.tempatDuduk && <div>Kursi: {trip.tempatDuduk}</div>}
                       </div>
                     )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-600 line-clamp-2 max-w-[200px]" title={trip.tujuanPerjalanan}>
                      {trip.tujuanPerjalanan}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {trip.nomorSurat && (
                        <div className="text-[10px] text-gray-500 bg-white border border-gray-200 px-1.5 py-0.5 rounded truncate max-w-[100px]" title={trip.nomorSurat}>
                          ST: {trip.nomorSurat}
                        </div>
                      )}
                      {trip.nomorNotaDinas && (
                        <div className="text-[10px] text-gray-500 bg-white border border-gray-200 px-1.5 py-0.5 rounded truncate max-w-[100px]" title={trip.nomorNotaDinas}>
                          ND: {trip.nomorNotaDinas}
                        </div>
                      )}
                      {trip.notaDinasFileUrl && (
                        <a href={trip.notaDinasFileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center mt-1">
                          <ExternalLink size={10} className="mr-1" /> File
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm text-red-700 font-medium">
                    {formatRupiah(trip.totalBiaya)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); trip.id && onDelete(trip.id); }}
                      className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Footer stats */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl text-sm text-gray-600 flex justify-between">
        <span>Total Transaksi: <strong>{trips.length}</strong></span>
        <span>Grand Total: <strong>{formatRupiah(trips.reduce((acc, curr) => acc + curr.totalBiaya, 0))}</strong></span>
      </div>
    </div>

    <Modal
      isOpen={!!selectedTrip}
      onClose={() => setSelectedTrip(null)}
      title="Preview Rekap Perjalanan"
    >
      {selectedTrip && (
        <div className="space-y-2 text-sm text-gray-700">
          <div className="grid grid-cols-3 gap-2 pb-3 border-b border-gray-100">
            <span className="font-semibold">Nama:</span>
            <span className="col-span-2">{selectedTrip.nama}</span>
            <span className="font-semibold">Tujuan:</span>
            <span className="col-span-2">{selectedTrip.tujuan}</span>
            {selectedTrip.hotelName && (
              <>
                <span className="font-semibold">Hotel:</span>
                <span className="col-span-2">{selectedTrip.hotelName}</span>
              </>
            )}
            <span className="font-semibold">Tanggal:</span>
            <span className="col-span-2">{selectedTrip.tanggalMulai} s/d {selectedTrip.tanggalSelesai}</span>
            <span className="font-semibold">Kendaraan:</span>
            <span className="col-span-2">{selectedTrip.jenisKendaraan}</span>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-1">Rincian Biaya</h4>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <span>BBM:</span> <span className="text-right">{(selectedTrip.biayaBBM ?? 0).toLocaleString('id-ID')}</span>
              <span>TOL:</span> <span className="text-right">{(selectedTrip.biayaTOL ?? 0).toLocaleString('id-ID')}</span>
              <span>Akomodasi:</span> <span className="text-right">{(selectedTrip.akomodasi ?? 0).toLocaleString('id-ID')}</span>
              <span>Uang Makan:</span> <span className="text-right">{(selectedTrip.uangMakan ?? 0).toLocaleString('id-ID')}</span>
              <span>Lokal:</span> <span className="text-right">{(selectedTrip.transportLokal ?? 0).toLocaleString('id-ID')}</span>
              <span>Tiket:</span> <span className="text-right">{(selectedTrip.hargaTiket ?? 0).toLocaleString('id-ID')}</span>
              <span className="font-bold text-red-600 border-t border-gray-200 pt-1 mt-1">TOTAL:</span>
              <span className="font-bold text-red-600 border-t border-gray-200 pt-1 mt-1 text-right">Rp {selectedTrip.totalBiaya.toLocaleString('id-ID')}</span>
            </div>
          </div>
          <div className="pt-2">
            {selectedTrip.notaDinasFileUrl && (
              <a href={selectedTrip.notaDinasFileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center">
                <ExternalLink size={10} className="mr-1" /> Buka File Nota Dinas
              </a>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};