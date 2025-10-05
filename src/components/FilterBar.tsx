
import React, { useState, useEffect } from 'react';

interface Filters {
  type: string;
  state: string;
  search: string;
}

interface FilterBarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters }) => {
  const [types, setTypes] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  
  useEffect(() => {
    fetch('/script/giDataSummary.json')
      .then(res => res.json())
      .then(data => {
        setTypes(['All', ...data.types]);
        setStates(['All', ...data.states]);
      });
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ type: 'All', state: 'All', search: '' });
  };

  return (
    <div className="fixed bottom-0 w-full bg-gray-100 p-4 flex justify-center space-x-4">
      <select name="type" value={filters.type} onChange={handleFilterChange} className="p-2 rounded">
        {types.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <select name="state" value={filters.state} onChange={handleFilterChange} className="p-2 rounded">
        {states.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <input
        type="text"
        name="search"
        placeholder="Search..."
        value={filters.search}
        onChange={handleFilterChange}
        className="p-2 rounded"
      />
      <button onClick={resetFilters} className="p-2 bg-gray-800 text-white rounded">Reset</button>
    </div>
  );
};

export default FilterBar;
