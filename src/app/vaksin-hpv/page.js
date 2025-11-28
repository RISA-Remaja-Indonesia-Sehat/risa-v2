'use client';

import Toast from '../components/ui/Toast';
import Image from 'next/image';
import MapComponent from '../components/maps/MapComponent';
import useLocationToast from '../store/useLocationToast';
import useLocationPermission from '../store/useLocationPermission';
import useVaccineTypes from '../store/useVaccineTypes';
import useAuthStore from '../store/useAuthStore';
import { useState, useEffect } from 'react';
import BookingModal from '../components/ui/BookingModal';
import ETicket from '../components/ui/ETicket';
import useBookingData from '../store/useBookingData';
import useModalState from '../store/useModalState';
import FAQ from '../components/ui/FAQ';
import VaccineInfoModal from '../components/ui/VaccineInfoModal';
import CustomButton from '../components/ui/CustomButton';
import VaksinFTUE from '../components/first-time/VaksinFTUE';
import { Spinner } from '../components/ui/spinner';
import Link from 'next/link';

export default function Home() {
  const { isLoading, setIsLoading } = useState(true);
  const { showToast, setShowToast } = useLocationToast();
  const { locationPermission, setLocationPermission } = useLocationPermission();
  const { vaccineTypes, fetchVaccineTypes } = useVaccineTypes();
  const { user } = useAuthStore();
  const [hasVaccineSavings, setHasVaccineSavings] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [savingsIsComplete, setSavingsIsComplete] = useState(false);
  const [savingsNextStep, setSavingsNextStep] = useState(1);
  const currentBookingId = useBookingData(state => state.currentBookingId);
  const { 
    showVaccineInfo, 
    showBooking, 
    showTicket, 
    selectedVaccine,
    openVaccineInfo,
    closeVaccineInfo,
    proceedToBooking,
    closeBooking,
    showTicketAfterBooking,
    closeTicket
  } = useModalState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchVaccineTypes();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };  
    fetchData();
  }, [fetchVaccineTypes]);

  useEffect(() => {
    const checkVaccineSavingsStatus = async () => {
      if (!user?.id) {
        setCheckingStatus(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vaccine-savings/check-status`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setHasVaccineSavings(data.hasVaccineSavings);
          setSavingsIsComplete(!!data.isComplete);
          if (data.nextStep) setSavingsNextStep(data.nextStep);
        }
      } catch (error) {
        console.error('Error checking vaccine savings status:', error);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkVaccineSavingsStatus();
  }, [user?.id]);

  const handleFindLocation = () => {
    setShowToast(true);
  };

  const handleLocationAccept = () => {
    setLocationPermission(true);
    setShowToast(false);
  };

  const handleLocationDecline = () => {
    setShowToast(false);
  };

  const handleBookingSubmit = async (formData) => {
    const { submitBooking } = useBookingData.getState();
    const result = await submitBooking(formData);
    console.log('Booking result:', result);
    
    if (result.success) {
      const { currentBookingId: newBookingId } = useBookingData.getState();
      console.log('Current booking ID:', newBookingId);
      console.log('Before showTicketAfterBooking - showTicket:', showTicket);
      showTicketAfterBooking();
      console.log('After showTicketAfterBooking - showTicket should be true');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div className="min-h-screen">
      <VaksinFTUE />
      <Toast 
        message="Kami memerlukan akses lokasi untuk menunjukkan laboratorium Prodia terdekat dari lokasi Anda. Ini akan membantu Anda menemukan tempat vaksinasi HPV yang paling mudah dijangkau."
        show={showToast}
        onAccept={handleLocationAccept}
        onDecline={handleLocationDecline}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 via-white to-rose-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 justify-center items-center gap-10">

            {/* LEFT SIDE */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#2A1E1A] leading-tight mb-6">
                Investasi Masa Depanmu Dimulai Hari Ini
              </h1>

              <p className="md:text-lg text-gray-700 mb-6 leading-relaxed">
                Kanker serviks dapat dicegah. Dengan menabung mulai dari <span className="text-pink-600 font-semibold">Rp 10.000</span> setiap hari, kamu bisa mendapatkan vaksin HPV sebagai perlindungan penting untuk kesehatan reproduksimu.
              </p>

              <p className="text-sm text-gray-600 mb-8 italic">
                Merawat diri bukan hanya dari luar, tetapi juga dari dalam. Ini langkah preventif untuk masa depan yang lebih sehat.
              </p>

              {!checkingStatus && (
                <Link
                  href={
                    hasVaccineSavings
                      ? savingsIsComplete
                        ? '/vaksin-hpv/savings/dashboard'
                        : '/vaksin-hpv/savings'
                      : '/vaksin-hpv/savings'
                  }
                  className="flex flex-col sm:flex-row gap-4 mb-8 w-fit"
                >
                  <CustomButton
                    title={
                      hasVaccineSavings
                        ? savingsIsComplete
                          ? 'Lihat Tabungan'
                          : 'Lanjutkan Tabungan'
                        : 'Mulai Nabung'
                    }
                    className="px-5 py-3 md:px-7 md:text-lg font-semibold"
                  />
                </Link>
              )}

              {/* SOCIAL PROOF */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-cover bg-center" 
                  style={{backgroundImage: 'url(https://cdn.stocksnap.io/img-thumbs/960w/woman-smartphone_MLEPUKHYUU.jpg)'}}></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-cover bg-center" 
                  style={{backgroundImage: 'url(https://www.shutterstock.com/shutterstock/photos/2341582245/display_1500/stock-photo-beautiful-young-asian-woman-pointing-finger-to-her-teeth-on-isolated-pink-background-facial-and-2341582245.jpg)'}}></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-cover bg-center" 
                  style={{backgroundImage: 'url(https://www.shutterstock.com/shutterstock/photos/2038337828/display_1500/stock-photo-pink-background-portrait-of-a-young-asian-woman-with-pigtails-2038337828.jpg)'}}></div>
                </div>

                <p className="text-sm text-gray-600">
                  <strong>2.500+</strong> remaja sudah mulai nabung bulan ini
                </p>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative">
              <Image
                src="/image/vaksin-hpv.png"
                alt="Vaksin HPV"
                width={1000}
                height={800}
                className="drop-shadow-lg animate-float"
              />

              {/* Small Badge */}
              <div className="absolute -top-6 right-2 bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                Program kesehatan remaja
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#382b22]">Berkolaborasi dengan</h2>
          <div className="flex justify-center items-center">
            <Image 
              src="/image/Laboratorium_Klinik_Prodia.png" 
              alt="Prodia Logo" 
              width={300} 
              height={120}
              className='drop-shadow-sm drop-shadow-slate-400'
              priority={false}
            />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dipercaya oleh laboratorium terkemuka di Indonesia dengan standar internasional 
            dan pengalaman lebih dari 50 tahun dalam pelayanan kesehatan.
          </p>
        </div>
      </section>

      {/* Vaccine Types Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#382b22] text-center mb-12">Jenis Vaksin HPV dari Prodia</h2>
          {isLoading ? (
            <Spinner />
          )
          : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {vaccineTypes.map((vaccine) => (
              <div key={vaccine.id} className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-200 hover:shadow-lg transition-shadow relative">
                
                <h3 className="text-xl font-bold text-[#382b22] mb-3 pr-16">{vaccine.name}</h3>
                
                {/* Price */}
                <div className="mb-3">
                    <p className="text-lg font-bold text-pink-600">{vaccine.price}</p>           
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{vaccine.description}</p>
                
                <button 
                  onClick={() => openVaccineInfo(vaccine)}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="group-hover:rotate-45 transition-transform duration-300">✨</span>
                  Pilih Paket
                </button>
              </div>
            ))}</div>
          )}
        </div>
      </section>

      <FAQ />

      {/* Location Finder Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-pink-50 via-white to-rose-50 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 relative">
            <span className="inline-block animate-bounce mb-4">📍</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Temukan Lab Prodia Terdekat
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4">
              Cari lokasi laboratorium Prodia di sekitar kamu untuk vaksinasi HPV yang mudah dan nyaman.
            </p>
            {!locationPermission && (
              <div onClick={handleFindLocation}>
                <CustomButton 
                  title="Cari Lokasi Terdekat" 
                  className="px-6 py-3 text-lg"
                />
              </div>
            )}
          </div>
          
          {locationPermission && (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-pink-200 transform hover:scale-[1.01] transition-all duration-300">
                <MapComponent />
              <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-pink-50 to-rose-50">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">💝</span>
                  <h4 className="text-lg font-bold text-pink-600">Tips Kunjungan Lab</h4>
                </div>
                <ul className="text-xs sm:text-sm text-gray-700 space-y-2 sm:space-y-3">
                  <li className="flex items-center gap-2">
                    <span className="text-pink-500">👆</span>
                    Klik marker pada peta untuk melihat detail lokasi lab
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-pink-500">📞</span>
                    Hubungi lab untuk membuat janji & konsultasi
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-pink-500">🪪</span>
                    Jangan lupa bawa kartu identitas saat kunjungan
                  </li>
                </ul>
                <div className="mt-4 sm:mt-6 bg-pink-50 rounded-xl p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-pink-600 font-medium flex items-center gap-2 flex-wrap">
                    <span>📸</span> Bagikan pengalamanmu! Post foto dengan #VaksinBareng, tag @risaofficial, dan dapatkan 10 stiker digital! <span className="animate-bounce">✨</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <VaccineInfoModal
        show={showVaccineInfo}
        onClose={closeVaccineInfo}
        onBooking={proceedToBooking}
        selectedVaccine={selectedVaccine}
      />

      <BookingModal
        show={showBooking}
        onClose={closeBooking}
        onSubmit={handleBookingSubmit}
        selectedVaccine={selectedVaccine}
      />

      <ETicket
        show={showTicket}
        onClose={closeTicket}
        bookingId={currentBookingId}
      />
    </div>
  )
}
