// src/components/ResultDisplay.js
import React from 'react';

const ResultDisplay = ({ isStationary }) => {
  return (
    <div>
      <h2>Result:</h2>
      {isStationary ? <p>Data is stationary.</p> : <p>Data is not stationary.</p>}
    </div>
  );
};

export default ResultDisplay;
