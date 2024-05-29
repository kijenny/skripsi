import React, { useState } from 'react';
import FileInput from '../components/Plot';
import ChartComponent from '../components/Chart';
import StepInput from '../components/Step';
import StationarityPlot from '../components/StationarityPlot';

const Forecasting = () => {
  const [file, setFile] = useState(null);
  const [stationarityImage, setStationarityImage] = useState(null);
  const [sarimaForecast, setSarimaForecast] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [steps, setSteps] = useState(null);
  const [orderP, setOrderP] = useState(null); // Tambah state untuk orderP
  const [orderD, setOrderD] = useState(null); // Tambah state untuk orderD
  const [orderQ, setOrderQ] = useState(null); // Tambah state untuk orderQ
  const [seasonalOrderP, setSeasonalOrderP] = useState(null); // Tambah state untuk seasonalOrderP
  const [seasonalOrderD, setSeasonalOrderD] = useState(null); // Tambah state untuk seasonalOrderD
  const [seasonalOrderQ, setSeasonalOrderQ] = useState(null); // Tambah state untuk seasonalOrderQ

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleStepsChange = (selectedSteps) => {
    setSteps(selectedSteps);
  };

  const handleOrderPChange = (value) => {
    setOrderP(value);
  };

  const handleOrderDChange = (value) => {
    setOrderD(value);
  };

  const handleOrderQChange = (value) => {
    setOrderQ(value);
  };

  const handleSeasonalOrderPChange = (value) => {
    setSeasonalOrderP(value);
  };

  const handleSeasonalOrderDChange = (value) => {
    setSeasonalOrderD(value);
  };

  const handleSeasonalOrderQChange = (value) => {
    setSeasonalOrderQ(value);
  };

  const handleFileSubmit = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/check_stationarity', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // Tampilkan gambar stasioneritas
      setStationarityImage(data.stationarityImage);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSarimaSubmit = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('steps', steps);
    formData.append('order_p', orderP); // Tambahkan nilai order_p dari state
    formData.append('order_d', orderD); // Tambahkan nilai order_d dari state
    formData.append('order_q', orderQ); // Tambahkan nilai order_q dari state
    formData.append('seasonal_order_p', seasonalOrderP); // Tambahkan nilai seasonal_order_p dari state
    formData.append('seasonal_order_d', seasonalOrderD); // Tambahkan nilai seasonal_order_d dari state
    formData.append('seasonal_order_q', seasonalOrderQ); // Tambahkan nilai seasonal_order_q dari state
  
    try {
      const response = await fetch('http://localhost:5000/api/plot', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
  
      const dateLabels = data.labels.map((label) => {
        const [month, year] = label.split(' ');
        const monthIndex = parseInt(month) - 1; // Months are zero-based in JavaScript
        const monthName = new Date(Date.UTC(2000, monthIndex, 1)).toLocaleString('en-US', { month: 'long' });
        return `${monthName} ${year}`;
      });
  
      setChartData({
        labels: dateLabels,
        datasets: [
          {
            label: 'Jumlah Penjualan',
            data: data.values,
            backgroundColor: 'rgba(75,192,192,0.6)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
          },
        ],
      });
  
      setSarimaForecast(data.sarimaForecast);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div className="Home">
      <h1></h1>
      <FileInput onFileChange={handleFileChange} onFileSubmit={handleFileSubmit} />
      {stationarityImage && <StationarityPlot stationarityImage={stationarityImage} />}
      <StepInput 
        onFileChange={handleFileChange} 
        onStepChange={handleStepsChange} 
        onOrderPChange={handleOrderPChange} 
        onOrderDChange={handleOrderDChange} 
        onOrderQChange={handleOrderQChange} 
        onSeasonalOrderPChange={handleSeasonalOrderPChange} 
        onSeasonalOrderDChange={handleSeasonalOrderDChange} 
        onSeasonalOrderQChange={handleSeasonalOrderQChange} 
        onFileSubmit={handleSarimaSubmit} 
      />
      {chartData && <ChartComponent chartData={chartData} />}
      {sarimaForecast && (
        <div>
          <h2>SARIMA Forecast</h2>
          <ul>
            {sarimaForecast.map((value, index) => (
              <li key={index}>{`Month ${index + 1}: ${value.toFixed(2)}`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Forecasting;
