import React, { useState, useEffect } from "react";

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
  const filteredCount = giData.filter(
    (gi) =>
      (filters.type === "All" || gi.type === filters.type) &&
      (filters.state === "All" || gi.states.includes(filters.state)) &&
      gi.name.toLowerCase().includes(filters.search.toLowerCase())
  ).length;

  return (
    <div className="w-full bg-gray-100 border-t border-gray-300 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3">
        {/* Type Filter */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-600 mb-1 ml-1">Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleTypeChange}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
        <div className="flex flex-col">
          <label className="text-xs text-gray-600 mb-1 ml-1">State</label>
          <select
            name="state"
            value={filters.state}
            onChange={handleStateChange}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={giData.length === 0}
          >
            {uniqueStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-600 mb-1 ml-1">Search GI</label>
          <input
            type="text"
            name="search"
            placeholder="Search by name..."
            value={searchInput}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-64"
            disabled={giData.length === 0}
          />
        </div>

        {/* Reset Button */}
        <div className="flex flex-col">
          <label className="text-xs text-transparent mb-1">Reset</label>
          <button
            onClick={resetFilters}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={giData.length === 0}
          >
            Reset
          </button>
        </div>

        {/* Filter Count Display */}
        {giData.length > 0 && (
          <div className="flex flex-col justify-end ml-4"></div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
