import React from 'react';

const ImageResult = ({ base64Image }) => {
  return (
    <div>
      <h2>Plot Result</h2>
      <img src={`data:image/png;base64,${base64Image}`} alt="Plot Result" />
    </div>
  );
};

export default ImageResult;
