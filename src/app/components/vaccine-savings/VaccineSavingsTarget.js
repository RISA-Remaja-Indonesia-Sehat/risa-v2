'use client';
import { useState } from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useVaccineSavingsStore from '../../store/useVaccineSavingsStore';

const VACCINE_PRICES = {
  HPV9_2DOSE: 1500000,
  HPV9_3DOSE: 2250000,
};

export default function VaccineSavingsTarget({ onNext }) {
  const router = useRouter();
  const { savingsData, setSavingsData } = useVaccineSavingsStore();
  const [vaccineType, setVaccineType] = useState('HPV9_2DOSE');
  const [dailySavings, setDailySavings] = useState('');
  const [estimatedDays, setEstimatedDays] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const vaccinePrice = VACCINE_PRICES[vaccineType];

  const handleVaccineChange = (type) => {
    setVaccineType(type);
    calculateDays(dailySavings, type);
  };

  const calculateDays = (daily, type) => {
    const price = VACCINE_PRICES[type];
    if (daily && parseInt(daily) > 0) {
      const days = Math.ceil(price / parseInt(daily));
      setEstimatedDays(days);
      setShowWarning(days > 365);
    }
  };

  const handleDailySavingsChange = (e) => {
    const value = e.target.value;
    setDailySavings(value);
    calculateDays(value, vaccineType);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!dailySavings) newErrors.dailySavings = 'Nominal tabungan harian wajib diisi';
    if (parseInt(dailySavings) < 10000) newErrors.dailySavings = 'Minimal Rp 10.000 per hari';
    if (estimatedDays > 365) newErrors.estimatedDays = 'Durasi tabungan tidak boleh lebih dari 1 tahun';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vaccine-savings/setup-target`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            vaccine_type: vaccineType,
            vaccine_price: vaccinePrice,
            daily_savings_target: parseInt(dailySavings),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menyimpan target tabungan');
      }

      setSavingsData({
        vaccine_type: vaccineType,
        vaccine_price: vaccinePrice,
        daily_savings_target: parseInt(dailySavings),
        estimated_days: estimatedDays,
      });

      router.push('/vaksin-hpv/savings/dashboard');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Target Tabungan</h1>
          <p className="text-gray-600 mb-8">Langkah 4: Tentukan Target Tabunganmu</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Vaccine Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-4">
                Pilih Jenis Vaksin HPV
              </label>
              <div className="space-y-3">
                {Object.entries(VACCINE_PRICES).map(([type, price]) => (
                  <label
                    key={type}
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      vaccineType === type
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="vaccine_type"
                      value={type}
                      checked={vaccineType === type}
                      onChange={() => handleVaccineChange(type)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {type === 'HPV9_2DOSE' ? 'HPV9 (2 Dosis)' : 'HPV9 (3 Dosis)'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Untuk usia {type === 'HPV9_2DOSE' ? '9-14 tahun' : '15+ tahun'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-pink-600">
                        Rp {price.toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-gray-500">Total harga</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Daily Savings Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                💰 Berapa nominal tabungan per hari?
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-600 font-semibold">Rp</span>
                <input
                  type="number"
                  value={dailySavings}
                  onChange={handleDailySavingsChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500"
                  placeholder="Minimal 10.000"
                  min="10000"
                  step="1000"
                />
              </div>
              {errors.dailySavings && (
                <p className="text-red-500 text-sm mt-1">{errors.dailySavings}</p>
              )}
            </div>

            {/* Calculation Result */}
            {estimatedDays > 0 && (
              <div className={`p-6 rounded-lg ${showWarning ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-blue-50 border-2 border-blue-300'}`}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Target Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      Rp {vaccinePrice.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tabungan Per Hari</p>
                    <p className="text-2xl font-bold text-pink-600">
                      Rp {parseInt(dailySavings).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">Estimasi Waktu Tabungan</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {estimatedDays} hari
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    ≈ {Math.ceil(estimatedDays / 30)} bulan
                  </p>
                </div>

                {showWarning && (
                  <div className="mt-4 flex gap-3 p-4 bg-yellow-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-yellow-900">⚠️ Durasi Terlalu Lama</p>
                      <p className="text-sm text-yellow-800 mt-1">
                        Untuk menjaga keamanan dan efektivitas vaksin, tabungan tidak boleh melewati 1 tahun. Naikkan nominal tabunganmu ya!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={showWarning || isLoading}
              className={`w-full font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                !showWarning && !isLoading
                  ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white hover:from-pink-500 hover:to-pink-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Menyimpan...' : 'Lanjut ke Dashboard Tabungan'}
              {!isLoading && <ChevronRight className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
