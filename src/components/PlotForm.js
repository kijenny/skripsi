// src/components/PlotForm.js
import React, { useState, useEffect } from 'react';

const PlotForm = ({ onDataSelect, onSubmit }) => {
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    // Fetch data from backend to populate the dropdown
    fetch('http://localhost:5000/show_data')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleDataSelect = (event) => {
    setSelectedId(event.target.value);
    onDataSelect(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(selectedId);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
            Select Data:
          </label>
          <div className="relative">
            <select value={selectedId} onChange={handleDataSelect}>
              <option value="" disabled>Select Data</option>
              {data.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.month} - {entry.sales}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <button type="submit">Plot</button>
    </form>
  );
};

export default PlotForm;
