'use client';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import useLabsLocation from '@/app/store/useLabsLocation';
import useUserLocation from '@/app/store/useUserLocation';
import useNearestLabs from '@/app/store/useNearestLabs';
import useLocationPermission from '@/app/store/useLocationPermission';
import NearestLabs from './NearestLabs';
import LabsMarker from './LabsMarker';
import UserMarker from './UserMarker';

// Custom icons configuration
import L from 'leaflet';

export default function Map() {
  const { labs, fetchLabs } = useLabsLocation();
  const { position, setPosition } = useUserLocation();
  const { nearestLabs, setNearestLabs } = useNearestLabs();
  const { locationPermission } = useLocationPermission();
  const mapRef = useRef();

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchLabs();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };  
    fetchData();
  }, [fetchLabs]);
  
  
  // Effect untuk otomatis mencari lokasi ketika permission diberikan
  useEffect(() => {
    if (locationPermission && mapRef.current) {
      mapRef.current.locate({ setView: true, maxZoom: 16 });
    }
  }, [locationPermission]);

  // Effect untuk menghitung lab terdekat
  useEffect(() => {
    if (!position) return;

    // Convert user position to LatLng
    const userLatLng = L.latLng(position.lat, position.lng);

    // Calculate distances for all labs
    const labsWithDistance = labs.map(lab => ({
      ...lab,
      distance: userLatLng.distanceTo(L.latLng(lab.latitude, lab.longitude))
    }));

    // Sort by distance and get top 3
    const nearest = labsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);

    setNearestLabs(nearest);
  }, [position, labs, setNearestLabs]);

  return (
    <>
      <MapContainer 
        center={[-6.2088, 106.8456]} 
        zoom={13} 
        scrollWheelZoom={true}
        style={{ height: '300px', width: '100%' }}
        className="sm:!h-[400px] lg:!h-[500px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <UserMarker />
        <LabsMarker />
        <NearestLabs />
      </MapContainer>

      <div className="mt-4 sm:mt-6 shadow-lg p-4 sm:p-6">
        <div className="mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-[#382b22]">Lab Terdekat dari Kamu</h2>
        </div>
        {position ? (
          nearestLabs.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {nearestLabs.map(lab => (
                <div 
                  key={lab.id} 
                  className="bg-pink-100/90 rounded-lg p-3 sm:p-4 border border-pink-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
                    <div className="flex-1">
                      <h3 className="font-bold text-pink-600 mb-1 text-sm sm:text-base">{lab.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 sm:gap-2">
                        <span>📞</span> <span className="truncate">{lab.phone}</span>
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 flex items-start gap-1 sm:gap-2 mt-1">
                        <span className="mt-0.5">📍</span> <span className="line-clamp-2">{lab.address}</span>
                      </p>
                    </div>
                    <div className="bg-white px-2 sm:px-3 py-1 sm:py-2 rounded-full border border-pink-200 self-start">
                      <p className="text-xs sm:text-sm font-medium text-pink-600">
                        {(lab.distance / 1000).toFixed(2)} km
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${lab.latitude},${lab.longitude}`)}
                    className="mt-2 sm:mt-3 w-full bg-white text-pink-600 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium border-2 border-pink-200 hover:bg-pink-50 transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2"
                  >
                    <span>🗺️</span> <span className="hidden sm:inline">Lihat </span>Rute
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <div className="animate-spin inline-block w-6 sm:w-8 h-6 sm:h-8 border-4 border-pink-200 border-t-pink-600 rounded-full mb-3 sm:mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">Mencari lab terdekat...</p>
            </div>
          )
        ) : (
          <div className="text-center py-6 sm:py-8 px-2 sm:px-4">
            <p className="text-gray-600 text-sm sm:text-base">
              <span className="block text-3xl sm:text-4xl mb-2 sm:mb-3">🎯</span>
              Izinkan akses lokasi untuk menemukan lab terdekat dari kamu
            </p>
          </div>
        )}
      </div>
    </>
  );
}