'use client';
import { useState } from 'react';
import { ChevronRight, Download } from 'lucide-react';
import useVaccineSavingsStore from '../../store/useVaccineSavingsStore';

export default function VaccineBankSetup({ onNext }) {
  const { setSavingsData } = useVaccineSavingsStore();
  const [bankSetupDone, setBankSetupDone] = useState(false);
  const [adminPaymentDone, setAdminPaymentDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBankSetupComplete = () => {
    setBankSetupDone(true);
  };

  const handleAdminPaymentComplete = () => {
    setAdminPaymentDone(true);
  };

  const handleNext = async () => {
    if (!bankSetupDone || !adminPaymentDone) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vaccine-savings/bank-setup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal menyimpan setup bank');
      }

      setSavingsData({
        bank_account_status: 'ready',
        profile_status: 'approved',
      });

      onNext();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Rekening Bank</h1>
          <p className="text-gray-600 mb-8">Langkah 3: Persiapan Rekening Tabungan</p>

          <div className="space-y-8">
            {/* Bank Account Setup */}
            <div className="border-2 border-pink-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">📱 Buka Rekening BluTeens / BCA</h3>
                  <p className="text-sm text-gray-600 mt-1">Khusus untuk remaja usia 9-17 tahun</p>
                </div>
                <button
                  onClick={handleBankSetupComplete}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    bankSetupDone
                      ? 'bg-green-500 text-white'
                      : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                  }`}
                >
                  {bankSetupDone ? '✓ Selesai' : 'Buka Rekening'}
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Langkah:</span>
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>Download aplikasi BCA Mobile atau kunjungi kantor BCA terdekat</li>
                  <li>Pilih produk "BluTeens" untuk remaja</li>
                  <li>Siapkan KTP/Kartu Pelajar dan izin orang tua</li>
                  <li>Selesaikan proses verifikasi</li>
                  <li>Catat nomor rekening kamu</li>
                </ol>
              </div>

              <a
                href="#"
                className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold mt-4"
              >
                <Download className="w-4 h-4" />
                Download Panduan Lengkap (PDF)
              </a>
            </div>

            {/* Admin Fee Payment */}
            <div className="border-2 border-yellow-300 rounded-lg p-6 bg-yellow-50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">💳 Bayar Biaya Admin</h3>
                  <p className="text-sm text-gray-600 mt-1">Rp 30.000 (sekali saja)</p>
                </div>
                <button
                  onClick={handleAdminPaymentComplete}
                  disabled={!bankSetupDone}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    adminPaymentDone
                      ? 'bg-green-500 text-white'
                      : bankSetupDone
                      ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {adminPaymentDone ? '✓ Sudah Bayar' : 'Bayar Sekarang'}
                </button>
              </div>

              <div className="bg-white p-4 rounded-lg space-y-3 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Instruksi Pembayaran:</span>
                </p>
                <div className="bg-gray-100 p-3 rounded font-mono text-xs">
                  <p>Transfer ke: BCA 1234567890</p>
                  <p>Atas Nama: RISA Vaksin Savings</p>
                  <p>Nominal: Rp 30.000</p>
                  <p>Keterangan: Biaya Admin Tabungan Vaksin</p>
                </div>
                <p className="text-yellow-700 font-semibold">
                  ⏱️ Konfirmasi pembayaran dalam 1x24 jam
                </p>
              </div>
            </div>

            {/* Confirmation */}
            {bankSetupDone && adminPaymentDone && (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
                <p className="text-green-800 font-semibold">
                  ✅ Semua persiapan selesai! Kamu siap melanjutkan ke langkah berikutnya.
                </p>
              </div>
            )}

            <button
              onClick={handleNext}
              disabled={!bankSetupDone || !adminPaymentDone || isLoading}
              className={`w-full font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                bankSetupDone && adminPaymentDone && !isLoading
                  ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white hover:from-pink-500 hover:to-pink-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Menyimpan...' : 'Lanjut ke Langkah Berikutnya'}
              {!isLoading && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
