import React from 'react';

const StationarityPlot = ({ stationarityImage }) => {
  return (
    <div className="stationarity-plot">
      <h2>Stationarity Plot</h2>
      <img src={`data:image/png;base64,${stationarityImage}`} alt="Stationarity" />
    </div>
  );
};

export default StationarityPlot;
