import useLabsLocation from "@/app/store/useLabsLocation";
import { Marker, Popup } from "react-leaflet";

import L from 'leaflet';
const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function LabsMarker() {
    const { labs } = useLabsLocation();

    return labs.map(lab => (
      <Marker 
        key={lab.id} 
        position={[lab.latitude, lab.longitude]} 
        icon={yellowIcon}
      >
        <Popup>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🏥</span>
              <h3 className="font-bold text-pink-600">{lab.name}</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span>📍</span> {lab.address}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span>📞</span> {lab.phone}
              </p>
            </div>
          </div>
        </Popup>
      </Marker>
    ));
  }