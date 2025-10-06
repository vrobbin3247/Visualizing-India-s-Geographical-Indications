import React, { useState, useEffect } from "react";
import { useDrag } from "react-use-gesture";

interface GI {
  id: string;
  name: string;
  type: string;
  states: string[];
  coordinates: { state: string; lat: number; lng: number }[];
  primaryState: string;
  stateCount: number;
}

interface Filters {
  type: string;
  state: string;
  search: string;
}

interface FilterBarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  giData?: GI[]; // Make optional
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  giData = [],
}) => {
  const [searchInput, setSearchInput] = useState(filters.search);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const bind = useDrag(({ down, direction: [, yDir], velocity }) => {
    if (!down && velocity > 0.2) {
      setIsFilterOpen(yDir > 0); // Open on swipe down, close on swipe up
    }
  });

  // Extract unique types and states - giData is now guaranteed to be an array
  const uniqueTypes =
    giData.length > 0
      ? ["All", ...Array.from(new Set(giData.map((gi) => gi.type)))].sort()
      : ["All"];

  const uniqueStates =
    giData.length > 0
      ? [
          "All",
          ...Array.from(new Set(giData.flatMap((gi) => gi.states))),
        ].sort()
      : ["All"];

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, setFilters]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, type: e.target.value }));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, state: e.target.value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const resetFilters = () => {
    setFilters({ type: "All", state: "All", search: "" });
    setSearchInput("");
  };

  // Calculate filtered count

  return (
    <div
      {...bind()}
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out md:static md:transform-none ${
        isFilterOpen
          ? "translate-y-0"
          : "translate-y-[calc(100%-56px)] md:translate-y-0"
      }`}
    >
      <div className="relative bg-white/30 backdrop-blur-md border-t border-white/50 shadow-lg rounded-t-xl md:bg-transparent md:shadow-none md:border-none">
        <div className="w-full p-4">
          {/* Drag Handle & Toggle Button */}
          <div
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden w-full flex justify-center cursor-pointer"
          >
            <div className="w-16 h-1.5 bg-gray-400 rounded-full" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700 absolute right-4 top-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isFilterOpen ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"}
              />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row flex-wrap items-center justify-center gap-4 mt-4 md:mt-0">
            {/* Row 1: Dropdowns */}
            <div className="w-full flex gap-4 md:w-auto">
              {/* Type Filter */}
              <div className="flex-1 flex flex-col">
                <label
                  htmlFor="type-filter"
                  className="text-xs text-gray-600 mb-1 ml-1"
                >
                  Type
                </label>
                <select
                  id="type-filter"
                  name="type"
                  value={filters.type}
                  onChange={handleTypeChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  disabled={giData.length === 0}
                >
                  {uniqueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* State Filter */}
              <div className="flex-1 flex flex-col">
                <label
                  htmlFor="state-filter"
                  className="text-xs text-gray-600 mb-1 ml-1"
                >
                  State
                </label>
                <select
                  id="state-filter"
                  name="state"
                  value={filters.state}
                  onChange={handleStateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  disabled={giData.length === 0}
                >
                  {uniqueStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Search and Reset */}
            <div className="w-full flex gap-4 md:w-auto">
              {/* Search Input */}
              <div className="flex-1 flex flex-col">
                <label
                  htmlFor="search-input"
                  className="text-xs text-gray-600 mb-1 ml-1"
                >
                  Search GI
                </label>
                <input
                  id="search-input"
                  type="text"
                  name="search"
                  placeholder="Search by name..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  disabled={giData.length === 0}
                />
              </div>

              {/* Reset Button */}
              <div className="flex flex-col justify-end">
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={giData.length === 0}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
