import { Marker, Popup, useMapEvents } from "react-leaflet";
import useUserLocation from "@/app/store/useUserLocation";

// Custom icons configuration
import L from 'leaflet';
import useLocationPermission from "@/app/store/useLocationPermission";
import { useEffect } from "react";

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function UserMarker() {
  const { position, setPosition } = useUserLocation();
  const { locationPermission } = useLocationPermission();
  
   const map = useMapEvents({
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    useEffect(() => {
      if (locationPermission) {
        map.locate({ setView: true, maxZoom: 16 });
      }
    }, [locationPermission, map]);

    return position === null ? null : (
      <Marker position={position} icon={redIcon}>
        <Popup>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📍</span>
              <p className="font-medium text-pink-600">Lokasi Kamu</p>
            </div>
          </div>
        </Popup>
      </Marker>
    );
  }