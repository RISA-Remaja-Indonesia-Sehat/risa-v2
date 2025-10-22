'use client';

import Toast from '../components/ui/Toast';
import Image from 'next/image';
import MapComponent from '../components/maps/MapComponent';
import useLocationToast from '../store/useLocationToast';
import useLocationPermission from '../store/useLocationPermission';
import useVaccineTypes from '../store/useVaccineTypes';
import { useEffect } from 'react';
import BookingModal from '../components/ui/BookingModal';
import ETicket from '../components/ui/ETicket';
import useBookingData from '../store/useBookingData';
import useModalState from '../store/useModalState';
import FAQ from '../components/ui/FAQ';
import VaccineInfoModal from '../components/ui/VaccineInfoModal';
import CustomButton from '../components/ui/CustomButton';

export default function Home() {
  const { showToast, setShowToast } = useLocationToast();
  const { locationPermission, setLocationPermission } = useLocationPermission();
  const { vaccineTypes, fetchVaccineTypes } = useVaccineTypes();
  const { bookingData } = useBookingData();
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



  const handleBookingSubmit = (data) => {
    showTicketAfterBooking();
  };



  return (
    <div className="min-h-screen">
      <Toast 
        message="Kami memerlukan akses lokasi untuk menunjukkan laboratorium Prodia terdekat dari lokasi Anda. Ini akan membantu Anda menemukan tempat vaksinasi HPV yang paling mudah dijangkau."
        show={showToast}
        onAccept={handleLocationAccept}
        onDecline={handleLocationDecline}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 via-white to-rose-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 justify-center items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#382b22] mb-6">
                Lindungi Masa Depanmu dengan <span className="text-pink-600">Vaksin HPV</span>
              </h1>
              <p className="md:text-lg text-gray-700 mb-8">
                Bergabunglah dengan <strong>ribuan remaja cerdas</strong> yang sudah melindungi diri dari kanker serviks. 
                Vaksinasi HPV adalah investasi terbaik untuk kesehatan reproduksimu di masa depan!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8 w-fit">
                <CustomButton title="Daftar Vaksin Sekarang" className="px-4 py-2 md:px-6 md:py-3 md:text-lg" />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-cover bg-center" style={{backgroundImage: 'url(https://cdn.stocksnap.io/img-thumbs/960w/woman-smartphone_MLEPUKHYUU.jpg)'}}></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-cover bg-center" style={{backgroundImage: 'url(https://www.shutterstock.com/shutterstock/photos/2341582245/display_1500/stock-photo-beautiful-young-asian-woman-pointing-finger-to-her-teeth-on-isolated-pink-background-facial-and-2341582245.jpg)'}}></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-cover bg-center" style={{backgroundImage: 'url(https://www.shutterstock.com/shutterstock/photos/2038337828/display_1500/stock-photo-pink-background-portrait-of-a-young-asian-woman-with-pigtails-2038337828.jpg)'}}></div>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>2,500+</strong> remaja sudah terlindungi bulan ini
                </p>
              </div>
            </div>
            <div>
              <Image 
                src="/image/vaksin-hpv.png" 
                alt="Vaksin HPV" 
                width={1000} 
                height={800}
                priority={false}
              />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {vaccineTypes.map((vaccine) => (
              <div key={vaccine.id} className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-200 hover:shadow-lg transition-shadow relative">
                {/* Discount Badge */}
                <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  20% OFF
                </div>
                
                <h3 className="text-xl font-bold text-[#382b22] mb-3 pr-16">{vaccine.name}</h3>
                
                {/* Price with Discount */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg text-gray-400 line-through">{vaccine.price}</span>
                    <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded text-xs font-medium">Hemat 20%</span>
                  </div>
                  <div className="text-2xl font-bold text-pink-600">
                    {vaccine.price.includes('Rp') 
                      ? `Rp ${Math.floor(parseInt(vaccine.price.replace(/[^0-9]/g, '')) * 0.8).toLocaleString('id-ID')}`
                      : vaccine.price
                    }
                  </div>
                  <p className="text-xs text-pink-500 font-medium mt-1">💰 Harga Spesial RISA</p>
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
            ))}
          </div>
        </div>
      </section>

      <FAQ />

      {/* Location Finder Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-pink-50 via-white to-rose-50 relative">
        {/* Decorative elements */}
        
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
        bookingData={bookingData}
      />
    </div>
  )
}