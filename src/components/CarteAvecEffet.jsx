import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function CarteAvecEffet() {
  const [hovered, setHovered] = useState(false);

  const carteWidth = hovered ? 'w-[850px]' : 'w-[650px]';
  const carteHeight = hovered ? 'h-[500px]' : 'h-[360px]';
  const fondPadding = hovered ? 'px-16 py-14' : 'px-8 py-8';

  return (
    <div className="flex justify-center my-16">
      {/* Fond autour de la carte */}
      <div
        className={`transition-all duration-700 ease-in-out rounded-3xl shadow-lg bg-gray-200/70 flex items-center justify-center ${fondPadding}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className={`transition-all duration-700 overflow-hidden rounded-2xl ${carteWidth} ${carteHeight}`}
        >
          <MapContainer
            center={[12.8797, 121.774]}
            zoom={6}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
