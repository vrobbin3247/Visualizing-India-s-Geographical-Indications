import { useState, useEffect } from "react";
import "./App.css";
import DetailPanel from "./components/DetailPanel";
import FilterBar from "./components/FilterBar";
import MapView from "./components/MapView";

interface GI {
  id: string;
  name: string;
  type: string;
  states: string[];
  coordinates: { state: string; lat: number; lng: number }[];
  primaryState: string;
  stateCount: number;
}

function App() {
  const [giData, setGiData] = useState<GI[]>([]);
  const [selectedGI, setSelectedGI] = useState<GI | null>(null);
  const [filters, setFilters] = useState({
    type: "All",
    state: "All",
    search: "",
  });

  useEffect(() => {
    fetch("/script/processedGIData.json")
      .then((response) => response.json())
      .then((data) => setGiData(data))
      .catch((err) => console.error("Error loading GI data:", err));
  }, []);

  const handleMarkerClick = (gi: GI) => {
    setSelectedGI(gi);
  };

  const handleClosePanel = () => {
    setSelectedGI(null);
  };

  const handleNext = () => {
    const filteredData = giData.filter(
      (gi) =>
        (filters.type === "All" || gi.type === filters.type) &&
        (filters.state === "All" || gi.states.includes(filters.state)) &&
        gi.name.toLowerCase().includes(filters.search.toLowerCase())
    );

    if (!selectedGI) {
      if (filteredData.length > 0) setSelectedGI(filteredData[0]);
      return;
    }

    const currentIndex = filteredData.findIndex(
      (gi) => gi.id === selectedGI.id
    );
    const nextIndex = (currentIndex + 1) % filteredData.length;
    setSelectedGI(filteredData[nextIndex]);
  };

  return (
    <div className="flex h-screen relative">
      {/* Detail Panel - slides in from left */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          selectedGI ? "w-2/5" : "w-0"
        } h-screen overflow-hidden`}
      >
        {selectedGI && (
          <div className="h-full overflow-y-auto bg-white">
            <DetailPanel
              selectedGI={selectedGI}
              onClose={handleClosePanel}
              onNext={handleNext}
            />
          </div>
        )}
      </div>

      {/* Map View */}
      <div
        className={`transition-all duration-300 ${
          selectedGI ? "w-3/5" : "w-full"
        } h-screen`}
      >
        <MapView
          data={giData}
          onMarkerClick={handleMarkerClick}
          selectedGI={selectedGI}
          filters={filters}
        />
      </div>

      {/* Filter Bar - positioned at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <FilterBar filters={filters} setFilters={setFilters} giData={giData} />
      </div>
    </div>
  );
}

export default App;
