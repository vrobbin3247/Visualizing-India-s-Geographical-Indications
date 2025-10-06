import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Tooltip,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-providers";
import type { Map } from "leaflet";

interface GI {
  id: string;
  name: string;
  type: string;
  states: string[];
  info: string;
  coordinates: { state: string; lat: number; lng: number }[];
  primaryState: string;
  stateCount: number;
  image_url: string;
}

const typeColors: { [key: string]: string } = {
  Agricultural: "#10B981",
  Handicraft: "#F59E0B",
  Manufactured: "#3B82F6",
  "Food Stuff": "#EF4444",
  "Natural Goods": "#8B5CF6",
};

const createPinIcon = (color: string) => {
  return L.divIcon({
    className: "custom-pin",
    html: `
      <div style="position: relative;">
        <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0C12.268 0 6 6.268 6 14c0 10.5 14 36 14 36s14-25.5 14-36c0-7.732-6.268-14-14-14z" 
                fill="${color}" 
                stroke="#ffffff" 
                stroke-width="2"/>
          <circle cx="20" cy="14" r="6" fill="#ffffff"/>
        </svg>
      </div>
      <style>
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
      </style>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });
};

interface MapViewProps {
  data: GI[];
  onMarkerClick: (gi: GI) => void;
  selectedGI: GI | null;
  filters: { type: string; state: string; search: string };
}

const MapView: React.FC<MapViewProps> = ({
  data,
  onMarkerClick,
  selectedGI,
  filters,
}) => {
  const [geoJSON, setGeoJSON] = useState<any>(null);
  const mapRef = useRef<Map>(null);

  useEffect(() => {
    fetch("/data/india_state.geojson")
      .then((res) => res.json())
      .then((data) => setGeoJSON(data))
      .catch((err) => console.error("Error loading GeoJSON:", err));
  }, []);

  useEffect(() => {
    if (selectedGI && mapRef.current) {
      const { lat, lng } = selectedGI.coordinates[0];
      mapRef.current.flyTo([lat, lng], 8, { duration: 1 });
    }
  }, [selectedGI]);

  const filteredData = data.filter(
    (gi) =>
      (filters.type === "All" || gi.type === filters.type) &&
      (filters.state === "All" || gi.states.includes(filters.state)) &&
      gi.name.toLowerCase().includes(filters.search.toLowerCase())
  );

  const geoJsonStyle = {
    color: "#4B5563",
    weight: 1,
    opacity: 0.6,
    dashArray: "5, 5",
    fillOpacity: 0,
  };

  if (!geoJSON) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading map...
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <MapContainer
        ref={mapRef}
        center={[20, 78]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC"
          maxZoom={16}
        />

        {geoJSON && <GeoJSON data={geoJSON} style={geoJsonStyle} />}

        {filteredData.flatMap((gi) =>
          gi.coordinates.map((coord) => {
            return (
              <CircleMarker
                key={`${gi.id}-${coord.state}`}
                center={[coord.lat, coord.lng]}
                radius={8}
                pathOptions={{
                  color: "#ffffff",
                  weight: 2,
                  fillColor: typeColors[gi.type] || "#6B7280",
                  fillOpacity: 0.8,
                }}
                eventHandlers={{
                  click: () => onMarkerClick(gi),
                }}
              >
                <Tooltip direction="top" offset={[0, -10]}>
                  <div className="w-32 text-center">
                    <img
                      src={gi.image_url}
                      alt={gi.name}
                      className="w-full h-24 object-cover rounded-t-lg"
                    />
                    <div className="p-2">
                      <strong className="font-bold">{gi.name}</strong>
                      <br />
                      <span className="text-gray-600 text-xs">{gi.type}</span>
                    </div>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })
        )}

        {selectedGI && (
          <Marker
            position={[
              selectedGI.coordinates[0].lat,
              selectedGI.coordinates[0].lng,
            ]}
            icon={createPinIcon(typeColors[selectedGI.type] || "#6B7280")}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{selectedGI.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedGI.type}</p>
                <p className="text-sm mt-2">{selectedGI.info}</p>
                <p className="text-xs text-gray-500 mt-2">
                  States: {selectedGI.states.join(", ")}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Legend */}
      <div
        className="absolute top-4 right-4 bg-white/30 backdrop-blur-md border-t border-white/50 shadow-lg rounded-t-xl p-4 z-[1000]"
        style={{ maxWidth: "200px" }}
      >
        <h3 className="text-sm font-bold text-gray-800 mb-3 border-b pb-2">
          GI Types
        </h3>
        <div className="space-y-2">
          {Object.entries(typeColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-700">{type}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center gap-2">
            <svg width="20" height="25" viewBox="0 0 40 50">
              <path
                d="M20 0C12.268 0 6 6.268 6 14c0 10.5 14 36 14 36s14-25.5 14-36c0-7.732-6.268-14-14-14z"
                fill="#6B7280"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <circle cx="20" cy="14" r="6" fill="#ffffff" />
            </svg>
            <span className="text-xs text-gray-700">Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
