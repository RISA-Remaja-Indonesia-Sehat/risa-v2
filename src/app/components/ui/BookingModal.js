'use client';

import { useEffect } from 'react';
import useLabsLocation from '@/app/store/useLabsLocation';
import useVaccineTypes from '@/app/store/useVaccineTypes';
import useBookingData from '@/app/store/useBookingData';

export default function BookingModal({ show, onClose, onSubmit, selectedVaccine }) {
  const { labs, fetchLabs } = useLabsLocation();
  const { vaccineTypes } = useVaccineTypes();
  const { bookingData, updateBookingField } = useBookingData();

  useEffect(() => {
    fetchLabs();
  }, [fetchLabs]);

  useEffect(() => {
    if (selectedVaccine && show) {
      updateBookingField('vaccineType', selectedVaccine.name);
    }
  }, [selectedVaccine, show, updateBookingField]);

  const handleChange = (e) => {
    updateBookingField(e.target.name, e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(bookingData);   
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-md mx-auto border-2 border-pink-200 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-pink-600 mb-4 sm:mb-6 text-center">Booking Slot Vaksin HPV</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIK</label>
            <input 
              name="nik" 
              required 
              pattern="[0-9]{16}" 
              title="NIK harus 16 digit"
              onChange={handleChange} 
              value={bookingData.nik} 
              placeholder="Masukkan 16 digit NIK" 
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input 
              name="nama" 
              required 
              onChange={handleChange} 
              value={bookingData.nama} 
              placeholder="Sesuai KTP" 
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usia</label>
            <input 
              name="usia" 
              type="number" 
              min="9" 
              max="45" 
              required 
              onChange={handleChange} 
              value={bookingData.usia} 
              placeholder="9-45 tahun" 
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
            <select 
              name="gender" 
              required 
              onChange={handleChange} 
              value={bookingData.gender} 
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Perempuan">Perempuan</option>
              <option value="Laki-laki">Laki-laki</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
            <input 
              name="phone" 
              type="tel" 
              required 
              pattern="[0-9]{10,13}"
              title="Nomor telepon harus 10-13 digit"
              onChange={handleChange} 
              value={bookingData.phone} 
              placeholder="Contoh: 08123456789" 
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lab Tujuan</label>
            <select 
              name="lab" 
              required 
              onChange={handleChange} 
              value={bookingData.lab} 
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="">Pilih Lab Prodia</option>
              {labs.map((lab) => (
                <option key={lab.id} value={lab.name}>
                  {lab.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Vaksin</label>
            <select 
              name="vaccineType" 
              required 
              onChange={handleChange} 
              value={bookingData.vaccineType} 
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="">Pilih Jenis Vaksin HPV</option>
              {vaccineTypes.map((vaccine, index) => (
                <option key={index} value={vaccine.name}>
                  {vaccine.name} - {vaccine.price}
                </option>
              ))}
            </select>
            {selectedVaccine && (
              <p className="text-xs text-pink-600 mt-1">✨ Paket terpilih: {selectedVaccine.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Vaksinasi</label>
            <input 
              name="tanggal" 
              type="date" 
              required 
              min={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              onChange={handleChange} 
              value={bookingData.tanggal} 
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jam Vaksinasi</label>
            <select 
              name="jam" 
              required 
              onChange={handleChange} 
              value={bookingData.jam} 
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="">Pilih Jam</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
            <button 
              type="button" 
              onClick={onClose} 
              className="w-full py-3 bg-white text-pink-600 rounded-full font-semibold border-2 border-pink-300 hover:bg-pink-50 hover:border-pink-400 transition-all duration-300 text-sm sm:text-base"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="w-full py-3 bg-pink-500 text-white rounded-full font-semibold hover:shadow-lg hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            >
              Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}