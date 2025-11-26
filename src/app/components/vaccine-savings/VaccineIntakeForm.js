'use client';
import { useState } from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';
import useVaccineSavingsStore from '../../store/useVaccineSavingsStore';

export default function VaccineIntakeForm({ onNext }) {
  const { savingsData, setSavingsData } = useVaccineSavingsStore();
  const [errors, setErrors] = useState({});
  const [ageAlert, setAgeAlert] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    if (name === 'age') {
      const age = parseInt(value);
      if (age < 9 && value !== '') {
        setAgeAlert('HPV vaccine recommended starting age 9.');
      } else {
        setAgeAlert('');
      }
    }

    setSavingsData({ [name]: newValue });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!savingsData.full_name) newErrors.full_name = 'Nama lengkap wajib diisi';
    if (!savingsData.age || parseInt(savingsData.age) < 9) newErrors.age = 'Usia minimal 9 tahun';
    if (!savingsData.gender) newErrors.gender = 'Jenis kelamin wajib dipilih';
    if (!savingsData.parent_email) newErrors.parent_email = 'Email orang tua wajib diisi';
    if (!savingsData.parent_phone) newErrors.parent_phone = 'Nomor WhatsApp wajib diisi';
    if (!savingsData.parental_consent) newErrors.parental_consent = 'Persetujuan orang tua wajib dicentang';

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/vaccine-savings/intake`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            full_name: savingsData.full_name,
            age: parseInt(savingsData.age),
            gender: savingsData.gender,
            previous_doses: savingsData.previous_doses,
            parent_email: savingsData.parent_email,
            parent_phone: savingsData.parent_phone,
            parental_consent: savingsData.parental_consent,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal menyimpan data');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tabungan Vaksin HPV</h1>
          <p className="text-gray-600 mb-8">Langkah 1: Data Diri Kamu</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Nama Lengkap</label>
              <input
                type="text"
                name="full_name"
                value={savingsData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500"
                placeholder="Masukkan nama lengkapmu"
              />
              {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Umur (tahun)</label>
              <input
                type="number"
                name="age"
                value={savingsData.age}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500"
                placeholder="Masukkan umurmu"
                min="9"
              />
              {ageAlert && (
                <div className="flex items-center gap-2 text-yellow-700 bg-yellow-50 p-3 rounded-lg mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{ageAlert}</span>
                </div>
              )}
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Jenis Kelamin</label>
              <select
                name="gender"
                value={savingsData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500"
              >
                <option value="">Pilih jenis kelamin</option>
                <option value="perempuan">Perempuan</option>
                <option value="laki-laki">Laki-laki</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">Sudah pernah vaksin HPV?</label>
              <div className="space-y-2">
                {[0, 1, 2].map((dose) => (
                  <label key={dose} className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 transition-all ${savingsData.previous_doses === dose ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                    <input
                      type="radio"
                      name="previous_doses"
                      value={dose}
                      checked={savingsData.previous_doses === dose}
                      onChange={handleChange}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span className="text-gray-700">
                      {dose === 0 ? 'Belum pernah' : `Sudah ${dose} dosis`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Email Orang Tua</label>
              <input
                type="email"
                name="parent_email"
                value={savingsData.parent_email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500"
                placeholder="Email orang tua"
              />
              {errors.parent_email && <p className="text-red-500 text-sm mt-1">{errors.parent_email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Nomor WhatsApp Aktif</label>
              <input
                type="tel"
                name="parent_phone"
                value={savingsData.parent_phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500"
                placeholder="Nomor WhatsApp (contoh: 08123456789)"
              />
              {errors.parent_phone && <p className="text-red-500 text-sm mt-1">{errors.parent_phone}</p>}
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="parental_consent"
                  checked={savingsData.parental_consent}
                  onChange={handleChange}
                  className="w-5 h-5 mt-1"
                />
                <span className="text-sm text-gray-700">
                  Saya masih di bawah umur dan sudah mendapat izin dari orang tua untuk mengikuti program tabungan vaksin ini.
                </span>
              </label>
              {errors.parental_consent && <p className="text-red-500 text-sm mt-1">{errors.parental_consent}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold py-3 rounded-lg hover:from-pink-500 hover:to-pink-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? 'Menyimpan...' : 'Lanjut ke Langkah Berikutnya'}
              {!isLoading && <ChevronRight className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
