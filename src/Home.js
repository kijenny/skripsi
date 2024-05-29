

// // src/App.js
// import React, { useState, useEffect } from 'react';
// import InputForm from './components/InputForm';
// import DataTable from './components/DataTable';
// import PlotForm from './components/PlotForm';
// import PlotResult from './components/PlotResult';

// function App() {
//   const [data, setData] = useState([]);
//   const [base64Image, setBase64Image] = useState(null);

//   useEffect(() => {
//     // Fetch data from backend to populate the table
//     fetchData();
//   }, []);

//   const fetchData = () => {
//     fetch('http://localhost:5000/show_data') // Ganti URL sesuai dengan URL backend Anda
//       .then((response) => response.json())
//       .then((data) => {
//         setData(data);
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//       });
//   };

//   const handleFormSubmit = (formData) => {
//     // Kirim data ke backend
//     fetch('http://localhost:5000/save_data', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(formData),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.error) {
//           console.error('Error saving data:', data.error);
//         } else {
//           console.log('Data saved successfully');
//           fetchData(); // Ambil data terbaru setelah penyimpanan
//         }
//       })
//       .catch((error) => {
//         console.error('Error saving data:', error);
//       });
//   };

//   const handlePlotSubmit = (selectedId) => {
//     // Fetch plot result from backend
//     fetch('http://localhost:5000/plot', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: new URLSearchParams({
//         selectedId: selectedId,
//       }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.error) {
//           console.error('Error:', data.error);
//         } else {
//           setBase64Image(data.base64Image);
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching plot result:', error);
//       });
//   };

//   return (
//     <div>
//       <h1>Data Analysis App</h1>
//       <InputForm onSubmit={handleFormSubmit} />
//       <DataTable data={data} />
//       <PlotForm onSubmit={handlePlotSubmit} data={data} />
//       {base64Image && <PlotResult base64Image={base64Image} />}
//     </div>
//   );
// }

// export default App;

import React, { useState } from 'react';
import FileInput from './components/Plot';
import ChartComponent from './components/Chart';
// import ImageResult from './components/ImageResult';

function Home() {
  const [file, setFile] = useState(null);
  const [chartData, setChartData] = useState(null);
  // const [base64Image, setBase64Image] = useState(null);
  const [sarimaForecast, setSarimaForecast] = useState(null);

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleFileSubmit = async () => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('http://localhost:5000/api/plot', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
  
      // Convert the numeric month to month names while keeping the year unchanged
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
  
      // setBase64Image(data.base64Image);
      setSarimaForecast(data.sarimaForecast);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="Home">
      <h1>Data Penjualan Plotting</h1>
      <FileInput onFileChange={handleFileChange} onFileSubmit={handleFileSubmit} />
      {chartData && <ChartComponent chartData={chartData} />}
      {/* {base64Image && <ImageResult base64Image={base64Image} />} */}
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
}

export default Home;




