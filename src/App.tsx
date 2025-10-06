import { useState, useEffect } from "react";
import "./App.css";
import DetailPanel from "./components/DetailPanel";
import FilterBar from "./components/FilterBar";
import MapView from "./components/MapView";

interface GI {
  id: string;
  name: string;
  type: string;
  info: string;
  states: string[];
  coordinates: { state: string; lat: number; lng: number }[];
  primaryState: string;
  stateCount: number;
  image_url: string;
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
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setGiData(data);
      })
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
    <div className="relative h-screen overflow-hidden">
      {/* Map View - Always full width */}
      <div className="w-full h-full absolute top-0 left-0 z-0">
        <MapView
          data={giData}
          onMarkerClick={handleMarkerClick}
          selectedGI={selectedGI}
          filters={filters}
        />
      </div>

      {/* Detail Panel - Fixed position for overlay and slide-in from right */}
      <div
        className={`fixed top-0 left-0 h-screen transition-transform duration-300 ease-in-out w-2/5 transform ${
          selectedGI ? "translate-x-0" : "-translate-x-full"
        } z-40`}
      >
        {selectedGI && (
          <div className="h-full overflow-y-auto bg-white/30 backdrop-blur-md border border-white/50 shadow-lg rounded-l-xl">
            <DetailPanel
              selectedGI={selectedGI}
              onClose={handleClosePanel}
              onNext={handleNext}
            />
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out transform ${
          selectedGI
            ? "translate-y-24 opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100"
        }`}
      >
        <div className="bg-white/30 backdrop-blur-md border-t border-white/50 shadow-lg rounded-t-xl ">
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            giData={giData}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
