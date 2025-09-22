'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import CustomButton from '../components/ui/CustomButton';
import Toast from '../components/ui/Toast';
import PromoCarousel from '../components/ui/PromoCarousel';
import Image from 'next/image';

export default function VaksinHPVPage() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [showLocationToast, setShowLocationToast] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [nearbyLabs, setNearbyLabs] = useState([]);

  const vaccineTypes = [
    { name: 'HPV Dosis 1', price: 'Rp 1.471.550', description: 'Vaksin HPV dosis pertama untuk perlindungan awal' },
    { name: 'HPV Dosis 2', price: 'Rp 1.440.570', description: 'Vaksin HPV dosis kedua untuk melengkapi perlindungan' },
    { name: 'HPV Dosis 3', price: 'Rp 1.409.590', description: 'Vaksin HPV dosis ketiga untuk perlindungan maksimal' },
    { name: 'HPV 9-Valent Dosis 1', price: 'Rp 2.707.500', description: 'Vaksin HPV 9-valent dosis pertama, perlindungan lebih luas' },
    { name: 'HPV 9-Valent Dosis 2', price: 'Rp 2.650.500', description: 'Vaksin HPV 9-valent dosis kedua' },
    { name: 'HPV 9-Valent Dosis 3', price: 'Rp 2.593.500', description: 'Vaksin HPV 9-valent dosis ketiga, perlindungan optimal' }
  ];

  const initMap = useCallback(async () => {
    if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current && locationPermissionGranted) {
      const L = (await import('leaflet')).default;
      
      await import('leaflet/dist/leaflet.css');
      
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current).setView([-6.7063, 108.5572], 13);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      map.locate({setView: true, maxZoom: 15});

      map.on('locationfound', async function(e) {
        const userLat = e.latlng.lat;
        const userLng = e.latlng.lng;

        L.marker([userLat, userLng]).addTo(map)
          .bindPopup("Lokasi Anda").openPopup();

        // Query untuk mencari Prodia labs
        const query = `
          [out:json];
          (
            node["name"~"Prodia",i](around:10000,${userLat},${userLng});
            node["amenity"="clinic"]["name"~"Prodia",i](around:10000,${userLat},${userLng});
            node["amenity"="hospital"]["name"~"Prodia",i](around:10000,${userLat},${userLng});
          );
          out;
        `;

        const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

        try {
          const response = await fetch(url);
          const json = await response.json();

          const labsData = [];
          json.elements.forEach(lab => {
            if (lab.lat && lab.lon) {
              const labInfo = {
                name: lab.tags.name || "Laboratorium Prodia",
                address: lab.tags["addr:full"] || lab.tags["addr:street"] || "Alamat tidak tersedia",
                phone: lab.tags.phone || "Hubungi cabang terdekat",
                lat: lab.lat,
                lon: lab.lon,
                distance: Math.round(map.distance([userLat, userLng], [lab.lat, lab.lon]) / 1000 * 10) / 10
              };
              labsData.push(labInfo);
              
              L.marker([lab.lat, lab.lon]).addTo(map)
                .bindPopup(`<b>${labInfo.name}</b><br>
                            ${labInfo.address}<br>
                            <small>Jarak: ${labInfo.distance} km</small>`);
            }
          });
          
          // Sort by distance and take first 5
          labsData.sort((a, b) => a.distance - b.distance);
          setNearbyLabs(labsData.slice(0, 5));
        } catch (error) {
          console.error('Error fetching Prodia labs:', error);
          // Fallback data jika API gagal
          setNearbyLabs([
            { name: "Prodia Cirebon", address: "Jl. R. A. Kartini No. 37, Cirebon", phone: "(0231) 202-888", distance: 1.7 },
            { name: "Prodia Kuningan", address: "Jl. A. Yani No. 39, Kuningan", phone: "(0233) 281-888", distance: 30.0 },
            { name: "Prodia Indramayu", address: "Jl. Jend. Sudirman No. 128, Indramayu", phone: "(0234) 272-888", distance: 50.3 }
          ]);
        }
      });

      map.on('locationerror', function() {
        alert("Tidak bisa mendapatkan lokasi Anda. Menampilkan lokasi default Cirebon.");
      });
    }
  }, [locationPermissionGranted]);

  useEffect(() => {
    if (locationPermissionGranted) {
      initMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locationPermissionGranted, initMap]);

  const handleFindLocation = () => {
    setShowLocationToast(true);
  };

  const handleLocationAccept = () => {
    setLocationPermissionGranted(true);
    setShowLocationToast(false);
  };

  const handleLocationDecline = () => {
    setShowLocationToast(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Toast 
        message="Kami memerlukan akses lokasi untuk menunjukkan laboratorium Prodia terdekat dari lokasi Anda. Ini akan membantu Anda menemukan tempat vaksinasi HPV yang paling mudah dijangkau."
        show={showLocationToast}
        onAccept={handleLocationAccept}
        onDecline={handleLocationDecline}
      />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-100 to-purple-100 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-[#382b22] mb-6">
                Lindungi Masa Depanmu dengan <span className="text-pink-600">Vaksin HPV</span>
              </h1>
              <p className="md:text-lg text-gray-700 mb-8">
                Bergabunglah dengan <strong>ribuan remaja cerdas</strong> yang sudah melindungi diri dari kanker serviks. 
                Vaksinasi HPV adalah investasi terbaik untuk kesehatan reproduksimu di masa depan!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
            <div className="relative">
              <Image 
                src="/image/vaksin-hpv.png" 
                alt="Vaksin HPV" 
                width={1000} 
                height={800}
                className="drop-shadow-lg drop-shadow-violet-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Promo Carousel Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#382b22] mb-8">🎉 Promo Spesial Hari Ini</h2>
          <PromoCarousel />
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#382b22] mb-8">Berkolaborasi dengan</h2>
          <div className="flex justify-center items-center">
            <Image 
              src="/image/Laboratorium_Klinik_Prodia.png" 
              alt="Prodia Logo" 
              width={300} 
              height={120}
              className='drop-shadow-lg drop-shadow-slate-400'
            />
          </div>
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
            Dipercaya oleh laboratorium terkemuka di Indonesia dengan standar internasional 
            dan pengalaman lebih dari 50 tahun dalam pelayanan kesehatan.
          </p>
        </div>
      </section>

      {/* Vaccine Types Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#382b22] text-center mb-12">Jenis Vaksin HPV dari Prodia</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vaccineTypes.map((vaccine, index) => (
              <div key={index} className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border-2 border-pink-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-[#382b22] mb-3">{vaccine.name}</h3>
                <p className="text-2xl font-bold text-pink-600 mb-3">{vaccine.price}</p>
                <p className="text-gray-600 text-sm mb-4">{vaccine.description}</p>
                <CustomButton title="Pilih Paket" className="w-full py-3" />
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Butuh konsultasi untuk memilih jenis vaksin yang tepat?</p>
            <button className="px-8 py-4 bg-white text-pink-600 font-semibold rounded-lg border-2 border-pink-500 cursor-pointer hover:bg-pink-50 hover:border-pink-600 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg">
              Konsultasi dengan Dokter
            </button>
          </div>
        </div>
      </section>

      {/* Location Finder Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#382b22] mb-4">Temukan Laboratorium Prodia Terdekat</h2>
            <p className="text-gray-600 mb-8">
              Cari lokasi laboratorium Prodia di sekitar Anda untuk vaksinasi HPV yang mudah dan nyaman.
            </p>
            {!locationPermissionGranted && (
              <div onClick={handleFindLocation}>
                <CustomButton 
                  title="Cari Lokasi Terdekat" 
                  className="px-8 py-4 text-lg"
                />
              </div>
            )}
          </div>
          
          {locationPermissionGranted && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200">
              <div className="h-96 w-full">
                <div ref={mapRef} className="w-full h-full"></div>
              </div>
              <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50">
                <h3 className="text-lg font-semibold text-[#382b22] mb-4">📍 Laboratorium Terdekat:</h3>
                {nearbyLabs.length > 0 ? (
                  <div className="grid gap-4 mb-6">
                    {nearbyLabs.map((lab, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-pink-200">
                        <h4 className="font-semibold text-[#382b22] mb-1">{lab.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">{lab.address}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">{lab.phone}</span>
                          <span className="text-sm font-medium text-pink-600">{lab.distance} km</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 mb-4">Mencari laboratorium terdekat...</p>
                )}
                <h4 className="text-sm font-semibold text-[#382b22] mb-2">💡 Tips:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Klik marker untuk melihat detail lokasi</li>
                  <li>• Hubungi laboratorium untuk membuat janji temu</li>
                  <li>• Bawa kartu identitas (jika ada)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  )
}