import React, { useState, useMemo } from 'react';
import { Save, Upload, Car, Plane, Train, Bus, Ship, Building2 } from 'lucide-react';
import { VehicleType, Trip } from '../types';
import { Modal } from './Modal';

interface TripFormProps {
  onSave: (trip: Omit<Trip, 'id'>) => Promise<void>;
  userId: string | null;
}

export const TripForm: React.FC<TripFormProps> = ({ onSave, userId }) => {
  const [formData, setFormData] = useState<Partial<Trip>>({
    nama: '',
    tujuan: '',
    hotelName: '', // State baru untuk nama hotel
    tanggalMulai: '',
    tanggalSelesai: '',
    tujuanPerjalanan: '',
    jenisKendaraan: '',
    nomorTiket: '',
    tempatDuduk: '',
    nomorSurat: '',
    nomorNotaDinas: '',
    notaDinasFileUrl: '',
    biayaBBM: 0,
    biayaTOL: 0,
    akomodasi: 0,
    uangMakan: 0,
    transportLokal: 0,
    hargaTiket: 0,
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const totalBiaya = useMemo(() => {
    return (
      (formData.biayaBBM || 0) +
      (formData.biayaTOL || 0) +
      (formData.akomodasi || 0) +
      (formData.uangMakan || 0) +
      (formData.transportLokal || 0) +
      (formData.hargaTiket || 0)
    );
  }, [formData]);

  // Format angka untuk tampilan (misal: 100000 -> 100.000)
  const formatDisplayNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return '';
    if (num === 0) return '0'; // Tampilkan 0 jika nilainya 0
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler khusus untuk input angka agar ada format ribuan
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Hapus semua karakter selain angka
    const numericValue = value.replace(/\D/g, '');
    
    setFormData(prev => ({
      ...prev,
      [name]: numericValue === '' ? 0 : parseInt(numericValue, 10)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isPublic = !!formData.jenisKendaraan && formData.jenisKendaraan !== VehicleType.PRIBADI && formData.jenisKendaraan !== VehicleType.DINAS;
    if (isPublic && (!formData.hargaTiket || formData.hargaTiket <= 0)) {
      alert('Harga Tiket wajib diisi untuk kendaraan umum');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSave = async () => {
    const tripData: Omit<Trip, 'id'> = {
      nama: formData.nama!,
      tujuan: formData.tujuan!,
      hotelName: formData.hotelName || '',
      tanggalMulai: formData.tanggalMulai!,
      tanggalSelesai: formData.tanggalSelesai!,
      tujuanPerjalanan: formData.tujuanPerjalanan!,
      jenisKendaraan: formData.jenisKendaraan!,
      nomorTiket: formData.nomorTiket || '',
      tempatDuduk: formData.tempatDuduk || '',
      nomorSurat: formData.nomorSurat!,
      nomorNotaDinas: formData.nomorNotaDinas!,
      notaDinasFileUrl: formData.notaDinasFileUrl || '',
      biayaBBM: formData.biayaBBM || 0,
      biayaTOL: formData.biayaTOL || 0,
      akomodasi: formData.akomodasi || 0,
      uangMakan: formData.uangMakan || 0,
      transportLokal: formData.transportLokal || 0,
      hargaTiket: formData.hargaTiket || 0,
      totalBiaya: totalBiaya,
      addedByUserId: userId
    };

    await onSave(tripData);
    
    // Reset form
    setFormData({
      nama: '',
      tujuan: '',
      hotelName: '',
      tanggalMulai: '',
      tanggalSelesai: '',
      tujuanPerjalanan: '',
      jenisKendaraan: '',
      nomorTiket: '',
      tempatDuduk: '',
      nomorSurat: '',
      nomorNotaDinas: '',
      notaDinasFileUrl: '',
      biayaBBM: 0,
      biayaTOL: 0,
      akomodasi: 0,
      uangMakan: 0,
      transportLokal: 0,
      hargaTiket: 0,
    });
    setShowConfirmModal(false);
  };

  const isPublicTransport =
    !!formData.jenisKendaraan &&
    formData.jenisKendaraan !== VehicleType.PRIBADI &&
    formData.jenisKendaraan !== VehicleType.DINAS;

  const isBusTravel = formData.jenisKendaraan === VehicleType.BUS_TRAVEL;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="w-2 h-6 bg-red-600 rounded-full mr-3"></span>
            Tambah Perjalanan
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nama Pegawai</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none text-gray-800"
                placeholder="Nama Lengkap"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Kota Tujuan</label>
              <input
                type="text"
                name="tujuan"
                value={formData.tujuan}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none text-gray-800"
                placeholder="Kota Tujuan"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nama Hotel / Penginapan</label>
              <div className="relative">
                <input
                  type="text"
                  name="hotelName"
                  value={formData.hotelName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none text-gray-800 pl-10"
                  placeholder="Nama Hotel (Opsional)"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Building2 size={16} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Mulai</label>
                <input
                  type="date"
                  name="tanggalMulai"
                  value={formData.tanggalMulai}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none text-gray-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Selesai</label>
                <input
                  type="date"
                  name="tanggalSelesai"
                  value={formData.tanggalSelesai}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none text-gray-800 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Keperluan</label>
              <textarea
                name="tujuanPerjalanan"
                value={formData.tujuanPerjalanan}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none text-gray-800"
                placeholder="Rincian keperluan perjalanan..."
              />
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="pt-4 border-t border-dashed border-gray-200">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Kendaraan</label>
            <div className="relative">
              <select
                name="jenisKendaraan"
                value={formData.jenisKendaraan}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none text-gray-800 appearance-none"
              >
                <option value="" disabled>Pilih Jenis Kendaraan</option>
                <option value={VehicleType.PRIBADI}>Kendaraan Pribadi</option>
                <option value={VehicleType.DINAS}>Kendaraan Dinas</option>
                <option value={VehicleType.PESAWAT}>Pesawat Terbang</option>
                <option value={VehicleType.KERETA}>Kereta Api</option>
                <option value={VehicleType.BUS_TRAVEL}>Bus / Travel</option>
                <option value={VehicleType.KAPAL}>Kapal Laut</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                {formData.jenisKendaraan === VehicleType.PESAWAT ? <Plane size={16} /> :
                 formData.jenisKendaraan === VehicleType.BUS_TRAVEL ? <Bus size={16} /> :
                 formData.jenisKendaraan === VehicleType.KERETA ? <Train size={16} /> :
                 formData.jenisKendaraan === VehicleType.KAPAL ? <Ship size={16} /> :
                 <Car size={16} />}
              </div>
            </div>

            {isPublicTransport && (
              <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-fadeIn">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-blue-700 mb-1">Nomor Tiket</label>
                    <input
                      type="text"
                      name="nomorTiket"
                      value={formData.nomorTiket}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
                      placeholder="Contoh: GA123"
                    />
                  </div>
                  {!isBusTravel && (
                    <div>
                      <label className="block text-xs font-semibold text-blue-700 mb-1">Tempat Duduk</label>
                      <input
                        type="text"
                        name="tempatDuduk"
                        value={formData.tempatDuduk}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-blue-200 rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
                        placeholder="Contoh: 12A"
                      />
                    </div>
                  )}
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold text-blue-700 mb-1">Harga Tiket (Rp)</label>
                    <input
                      type="text"
                      name="hargaTiket"
                      value={formatDisplayNumber(formData.hargaTiket)}
                      onChange={handleNumberChange}
                      required={isPublicTransport}
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cost Info */}
          <div className="pt-4 border-t border-dashed border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Rincian Biaya (Rp)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs text-gray-500 mb-1">BBM</label>
                <input
                  type="text"
                  name="biayaBBM"
                  value={formatDisplayNumber(formData.biayaBBM)}
                  onChange={handleNumberChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:border-red-500 outline-none"
                  placeholder="0"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs text-gray-500 mb-1">TOL</label>
                <input
                  type="text"
                  name="biayaTOL"
                  value={formatDisplayNumber(formData.biayaTOL)}
                  onChange={handleNumberChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:border-red-500 outline-none"
                  placeholder="0"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs text-gray-500 mb-1">Akomodasi</label>
                <input
                  type="text"
                  name="akomodasi"
                  value={formatDisplayNumber(formData.akomodasi)}
                  onChange={handleNumberChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:border-red-500 outline-none"
                  placeholder="0"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs text-gray-500 mb-1">Uang Makan</label>
                <input
                  type="text"
                  name="uangMakan"
                  value={formatDisplayNumber(formData.uangMakan)}
                  onChange={handleNumberChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:border-red-500 outline-none"
                  placeholder="0"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Transport Lokal</label>
                <input
                  type="text"
                  name="transportLokal"
                  value={formatDisplayNumber(formData.transportLokal)}
                  onChange={handleNumberChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:border-red-500 outline-none"
                  placeholder="0"
                />
              </div>

            </div>
          </div>

          {/* Documents */}
          <div className="pt-4 border-t border-dashed border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Dokumen</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">No. Surat Tugas</label>
                <input
                  type="text"
                  name="nomorSurat"
                  value={formData.nomorSurat}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  placeholder="123/SPPD/IV/2024"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">No. Nota Dinas</label>
                <input
                  type="text"
                  name="nomorNotaDinas"
                  value={formData.nomorNotaDinas}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  placeholder="ND-001/IV/2024"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Unggah File Nota Dinas (GDrive)</label>
                <a
                  href="https://drive.google.com/drive/folders/1vhIyR1maXl6LqDrrtTRVixFnQNGM8D3-?usp=drive_link"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  <Upload size={14} className="mr-2" /> Unggah File Nota Dinas
                </a>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-700/30 hover:shadow-red-800/40 transition-all transform active:scale-[0.99] flex items-center justify-center"
          >
            <Save className="mr-2 w-5 h-5" />
            Simpan Perjalanan
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Verifikasi Data Perjalanan"
      >
        <div className="space-y-3 text-sm text-gray-600">
          <div className="grid grid-cols-3 gap-2 pb-3 border-b border-gray-100">
            <span className="font-semibold text-gray-800">Nama:</span>
            <span className="col-span-2">{formData.nama}</span>
            
            <span className="font-semibold text-gray-800">Tujuan:</span>
            <span className="col-span-2">{formData.tujuan}</span>

            {formData.hotelName && (
              <>
                <span className="font-semibold text-gray-800">Hotel:</span>
                <span className="col-span-2">{formData.hotelName}</span>
              </>
            )}
            
            <span className="font-semibold text-gray-800">Tanggal:</span>
            <span className="col-span-2">{formData.tanggalMulai} s/d {formData.tanggalSelesai}</span>

            <span className="font-semibold text-gray-800">Kendaraan:</span>
            <span className="col-span-2">{formData.jenisKendaraan}</span>
          </div>

          <div className="py-2">
             <h4 className="font-bold text-gray-800 mb-1">Rincian Biaya</h4>
             <div className="grid grid-cols-2 gap-1 text-xs">
                <span>BBM:</span> <span className="text-right">{formData.biayaBBM?.toLocaleString('id-ID')}</span>
                <span>TOL:</span> <span className="text-right">{formData.biayaTOL?.toLocaleString('id-ID')}</span>
                <span>Akomodasi:</span> <span className="text-right">{formData.akomodasi?.toLocaleString('id-ID')}</span>
                <span>Uang Makan:</span> <span className="text-right">{formData.uangMakan?.toLocaleString('id-ID')}</span>
                <span>Lokal:</span> <span className="text-right">{formData.transportLokal?.toLocaleString('id-ID')}</span>
                <span>Tiket:</span> <span className="text-right">{formData.hargaTiket?.toLocaleString('id-ID')}</span>
                <span className="font-bold text-red-600 border-t border-gray-200 pt-1 mt-1">TOTAL:</span>
                <span className="font-bold text-red-600 border-t border-gray-200 pt-1 mt-1 text-right">Rp {totalBiaya.toLocaleString('id-ID')}</span>
             </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Batal
            </button>
            <button
              onClick={confirmSave}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-md"
            >
              Konfirmasi Simpan
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
