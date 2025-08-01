// --- CarteAvecEffetLibre.jsx ---
import React, { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Coordonnées centrées pour chaque pays
const countrySettings = {
  philippines: { center: [121.774, 12.8797], zoom: 5 },
  indonesie: { center: [113.9213, -0.7893], zoom: 4.5 },
  thailande: { center: [100.9925, 15.8700], zoom: 5.2 },
  malaysia: { center: [101.9758, 4.2105], zoom: 5.2 },
  "sri-lanka": { center: [80.7718, 7.8731], zoom: 6 },
  japon: { center: [138.2529, 36.2048], zoom: 4.5 },
  inde: { center: [78.9629, 20.5937], zoom: 4.5 },
  vietnam: { center: [108.2772, 14.0583], zoom: 5.2 },
  "coree-du-sud": { center: [127.7669, 35.9078], zoom: 5.3 },
};

const CarteAvecEffetLibre = ({ country = "philippines" }) => {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const { center, zoom } =
      countrySettings[country.toLowerCase()] || countrySettings.philippines;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style:
        "https://api.maptiler.com/maps/streets/style.json?key=gsmNeDjg2V0pS8etxXtI",
      center,
      zoom,
    });

    return () => map.remove();
  }, [country]);

  return (
    <div
      ref={mapContainer}
      className="shadow-xl"
      style={{
        height: "550px",
        width: "85%",
        borderRadius: "1rem",
        overflow: "hidden",
        margin: "40px auto",
        maxWidth: "1400px",
      }}
    />
  );
};

export default CarteAvecEffetLibre;


