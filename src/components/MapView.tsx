import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
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
}

const typeColors: { [key: string]: string } = {
  Agricultural: "#10B981",
  Handicraft: "#F59E0B",
  Handicrafts: "#F59E0B",
  Manufactured: "#3B82F6",
  "Food Stuff": "#EF4444",
  "Food stuff": "#EF4444",
  Natural: "#8B5CF6",
  "Natural Goods": "#8B5CF6",
};

interface MapViewProps {
  data: GI[]; // Pass data as prop instead of fetching
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

  // Load GeoJSON
  useEffect(() => {
    fetch("/data/india_state.geojson")
      .then((res) => res.json())
      .then((data) => setGeoJSON(data))
      .catch((err) => console.error("Error loading GeoJSON:", err));
  }, []);

  // Pan to selected GI
  useEffect(() => {
    if (selectedGI && mapRef.current) {
      const { lat, lng } = selectedGI.coordinates[0];
      mapRef.current.flyTo([lat, lng], 8, { duration: 1 });
    }
  }, [selectedGI]);

  // Filter data
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
    <MapContainer
      ref={mapRef}
      center={[20, 78]}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {geoJSON && <GeoJSON data={geoJSON} style={geoJsonStyle} />}

      {filteredData.flatMap((gi) =>
        gi.coordinates.map((coord) => {
          const isSelected = selectedGI?.id === gi.id;
          return (
            <CircleMarker
              key={`${gi.id}-${coord.state}`}
              center={[coord.lat, coord.lng]}
              radius={isSelected ? 12 : 8}
              pathOptions={{
                color: "#ffffff",
                weight: 2,
                fillColor: isSelected
                  ? "#EF4444"
                  : typeColors[gi.type] || "#6B7280",
                fillOpacity: isSelected ? 1 : 0.8,
              }}
              eventHandlers={{
                click: () => onMarkerClick(gi),
              }}
            >
              <Tooltip direction="top" offset={[0, -10]}>
                <div className="text-sm">
                  <strong>{gi.name}</strong>
                  <br />
                  <span className="text-gray-600">{gi.type}</span>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })
      )}
    </MapContainer>
  );
};

export default MapView;
