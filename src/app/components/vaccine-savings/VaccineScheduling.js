'use client';
import { useState } from 'react';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import VaccineTicket from './VaccineTicket';
import useVaccineSavingsStore from '../../store/useVaccineSavingsStore';

export default function VaccineScheduling({ onComplete }) {
  const { savingsData, setSavingsData } = useVaccineSavingsStore();
  const [dose1Date, setDose1Date] = useState('');
  const [dose1Time, setDose1Time] = useState('');
  const [scheduled, setScheduled] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    return today.toISOString().split('T')[0];
  };

  const calculateDose2Date = (date) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 2);
    
    while (d.getDay() === 0 || d.getDay() === 6) {
      d.setDate(d.getDate() - 1);
    }
    
    return d;
  };

  const handleSchedule = async () => {
    if (!dose1Date || !dose1Time) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vaccine-savings/schedule`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            dose1_date: `${dose1Date}T${dose1Time}`,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        const dose2Date = calculateDose2Date(dose1Date);
        setSavingsData({
          vaccine_status: 'scheduled',
          dose1_date: new Date(`${dose1Date}T${dose1Time}`),
          dose2_date: dose2Date,
        });
        setScheduled(true);
      } else {
        throw new Error(data.error || 'Gagal menyimpan jadwal');
      }
    } catch (error) {
      console.error('Error scheduling:', error);
      alert(error.message || 'Gagal menyimpan jadwal vaksin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    Swal.fire({
      title: '🎉 Selamat!',
      html: 'Proses tabungan vaksin HPV kamu sudah selesai.<br/>Tunggu konfirmasi dari tim RISA.',
      icon: 'success',
      confirmButtonText: 'Selesai',
      confirmButtonColor: '#ec4899',
    }).then(() => {
      onComplete();
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const dose2Date = dose1Date ? calculateDose2Date(dose1Date) : null;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Jadwal Vaksinasi</h1>

            {!scheduled ? (
              <div className="space-y-8">
                <div className="border-2 border-pink-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">💉 Dosis 1</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Pilih Tanggal (minimal 3 hari dari hari ini)
                      </label>
                      <input
                        type="date"
                        value={dose1Date}
                        onChange={(e) => setDose1Date(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500"
                        min={getMinDate()}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Pilih Jam
                      </label>
                      <input
                        type="time"
                        value={dose1Time}
                        onChange={(e) => setDose1Time(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>

                  {dose1Date && (
                    <div className="mt-4 p-4 bg-pink-50 rounded-lg">
                      <p className="text-sm text-gray-600">Jadwal Dosis 1</p>
                      <p className="font-bold text-gray-900">
                        {formatDate(dose1Date)} pukul {dose1Time}
                      </p>
                    </div>
                  )}
                </div>

                {dose2Date && (
                  <div className="border-2 border-yellow-300 rounded-lg p-6 bg-yellow-50">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">💉 Dosis 2 (Otomatis)</h3>
                    
                    <div className="p-4 bg-white rounded-lg">
                      <p className="text-sm text-gray-600">Jadwal Dosis 2 (2 bulan setelah Dosis 1)</p>
                      <p className="font-bold text-gray-900">
                        {formatDate(dose2Date)}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        ℹ️ Jadwal otomatis disesuaikan jika jatuh di hari libur/weekend
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSchedule}
                  disabled={!dose1Date || !dose1Time || isLoading}
                  className={`w-full font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                    dose1Date && dose1Time && !isLoading
                      ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white hover:from-pink-500 hover:to-pink-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {isLoading ? 'Menyimpan...' : 'Konfirmasi Jadwal Vaksin'}
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                    <h3 className="text-2xl font-bold text-green-800">Jadwal Vaksin Dikonfirmasi!</h3>
                  </div>

                  <div className="space-y-4 mt-6">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Dosis 1</p>
                      <p className="font-bold text-gray-900">
                        {formatDate(savingsData.dose1_date)} pukul {new Date(savingsData.dose1_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Dosis 2</p>
                      <p className="font-bold text-gray-900">
                        {formatDate(savingsData.dose2_date)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      ✉️ Tunggu konfirmasi melalui email atau WhatsApp sebelum hari H vaksinasi.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowTicket(true)}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all flex items-center justify-center gap-2"
                >
                  Lihat Tiket Vaksin
                </button>

                <button
                  onClick={handleComplete}
                  className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold py-3 rounded-lg hover:from-pink-500 hover:to-pink-600 transition-all"
                >
                  Selesai
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showTicket && (
        <VaccineTicket
          show={showTicket}
          onClose={() => setShowTicket(false)}
          vaccinationData={{
            full_name: savingsData.full_name,
            age: savingsData.age,
            gender: savingsData.gender,
            parent_phone: savingsData.parent_phone,
            vaccine_type: savingsData.vaccine_type,
            vaccine_price: savingsData.vaccine_price,
            dose1_date: savingsData.dose1_date,
            dose2_date: savingsData.dose2_date,
          }}
        />
      )}
    </>
  );
}
