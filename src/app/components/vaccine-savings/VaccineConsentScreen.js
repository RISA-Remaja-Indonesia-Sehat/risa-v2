'use client';
import { useState } from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import useVaccineSavingsStore from '../../store/useVaccineSavingsStore';

export default function VaccineConsentScreen({ onNext }) {
  const { savingsData, setSavingsData } = useVaccineSavingsStore();
  const [consentChecked, setConsentChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConsent = () => {
    setConsentChecked(!consentChecked);
    setSavingsData({ consent_acknowledged: !consentChecked });
  };

  const handleNext = async () => {
    if (!consentChecked) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vaccine-savings/consent`,
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
        throw new Error(data.error || 'Gagal menyimpan persetujuan');
      }

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Persetujuan Konsultasi</h1>
          <p className="text-gray-600 mb-8">Langkah 2: Konfirmasi Persetujuan</p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
            <h2 className="font-semibold text-blue-900 mb-4">📋 Informasi Penting</h2>
            <ul className="space-y-3 text-sm text-blue-800">
              <li className="flex gap-3">
                <span className="font-bold">1.</span>
                <span>Vaksin HPV memerlukan konsultasi dengan dokter terlebih dahulu</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">2.</span>
                <span>Orang tua/wali harus memberikan izin tertulis</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">3.</span>
                <span>Kami akan mengirimkan surat rekomendasi dokter ke email orang tua</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">4.</span>
                <span>Jadwal vaksin akan disesuaikan dengan ketersediaan klinik</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <label className="flex items-start gap-4 p-6 border-2 border-pink-200 rounded-lg cursor-pointer hover:bg-pink-50 transition-colors">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={handleConsent}
                className="w-6 h-6 mt-1 accent-pink-500"
              />
              <div>
                <p className="font-semibold text-gray-900">
                  ✔ Saya mengerti bahwa saya perlu konsultasi dokter dan izin orang tua
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Dengan mencentang ini, saya menyetujui untuk melanjutkan proses tabungan vaksin HPV dan memahami bahwa konsultasi dokter adalah langkah wajib sebelum vaksinasi.
                </p>
              </div>
            </label>

            <button
              onClick={handleNext}
              disabled={!consentChecked || isLoading}
              className={`w-full font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                consentChecked && !isLoading
                  ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white hover:from-pink-500 hover:to-pink-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Menyimpan...' : 'Lanjut Konsultasi'}
              {!isLoading && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
