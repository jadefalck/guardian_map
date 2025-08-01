import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Papa from "papaparse";

export default function CarteAvecEffet({ csvFilePath, center = [10.3, 123.9], zoom = 6 }) {
  const mapRef = useRef(null);
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [centresData, setCentresData] = useState([]);

  useEffect(() => {
    if (csvFilePath) {
      fetch(csvFilePath)
        .then((res) => res.text())
        .then((text) => {
          const parsed = Papa.parse(text, { header: true });
          setCentresData(parsed.data);
        });
    }
  }, [csvFilePath]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.remove(); // supprime l'ancienne carte si elle existe
      mapRef.current = null;
    }

    if (centresData.length > 0) {
      const map = L.map("map").setView(center, zoom);
      mapRef.current = map;

      // Fond de carte moderne
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
      }).addTo(map);

      centresData.forEach((centre) => {
        const lat = parseFloat(centre.latitude);
        const lng = parseFloat(centre.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          const isInactive = getLabelText(centre.stamp_image || "") === "Label Inactif";
          const icon = new L.Icon({
            iconUrl: isInactive
              ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png"
              : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
            shadowSize: [41, 41],
          });

          const marker = L.marker([lat, lng], { icon })
            .addTo(map)
            .bindTooltip(centre.centre_name, { permanent: false });

          marker.on("click", () => {
            setSelectedCentre(centre);
            map.panTo([lat, lng - 0.3]);
          });
        }
      });

      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }
  }, [centresData, center, zoom]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, [centresData]);

  function getLabelText(stamp) {
    if (stamp.includes("gold")) return "Label Gold";
    if (stamp.includes("silver")) return "Label Silver";
    if (stamp.includes("bronze")) return "Label Bronze";
    if (stamp.includes("digital")) return "Label Digital";
    return "Label Inactif";
  }

  return (
    <div className="relative w-full bg-white py-12 flex justify-center items-start">
      {/* Map container */}
      <div className="relative w-[90%] h-[500px] z-10 rounded-xl overflow-hidden shadow-lg">
        <div id="map" className="w-full h-full"></div>
      </div>

      {/* Info box */}
      {selectedCentre && (
        <div className="absolute top-6 right-6 z-20 bg-white bg-opacity-90 backdrop-blur-md rounded-md shadow-md p-4 max-w-xs">
          <h2 className="text-lg font-bold text-blue-900">{selectedCentre.centre_name}</h2>
          <p className="text-sm mt-1"><strong>Contact :</strong> {selectedCentre.contacts || "Non renseigné"}</p>
          <p className="text-sm"><strong>Label :</strong> {getLabelText(selectedCentre.stamp_image || "")}</p>
        </div>
      )}
    </div>
  );
}
