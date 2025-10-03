import { Marker, Popup, useMap } from "react-leaflet";
import L from 'leaflet';
import useNearestLabs from "@/app/store/useNearestLabs";

const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function NearestLabs() {
  const { nearestLabs } = useNearestLabs();
    const map = useMap();

    if (!nearestLabs || nearestLabs.length === 0) return null;

    return nearestLabs.map(lab => (
      <Marker 
        key={`nearest-${lab.id}`}
        position={[lab.latitude, lab.longitude]}
        icon={yellowIcon}
      >
        <Popup>
          <div>
            <div className="flex items-center gap-1 sm:gap-2 mb-2">
              <span className="text-lg sm:text-xl">🏥</span>
              <h3 className="font-bold text-pink-600 text-sm sm:text-base truncate">{lab.name}</h3>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm text-gray-600 flex items-start gap-1 sm:gap-2">
                <span className="text-pink-500 mt-0.5">📍</span>
                <span className="line-clamp-2">{lab.address}</span>
              </p>
              <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 sm:gap-2">
                <span className="text-pink-500">📞</span>
                <span className="truncate">{lab.phone}</span>
              </p>
              <p className="text-xs sm:text-sm font-medium bg-pink-50 text-pink-600 p-1.5 sm:p-2 rounded-md">
                Jarak: {(lab.distance / 1000).toFixed(2)} km
              </p>
            </div>
            <button 
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${lab.latitude},${lab.longitude}`)}
              className="mt-2 sm:mt-3 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2"
            >
              <span className="hidden sm:inline">Buka di </span>Google Maps
            </button>
          </div>
        </Popup>
      </Marker>
    ));
}