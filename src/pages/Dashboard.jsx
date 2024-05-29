import React, { useEffect, useState } from 'react';
import ChartComponent from '../components/Chart';
import { useDataContext } from '../context/DataContext';

const Dashboard = () => {
  const { forecastData } = useDataContext();
  const [chart, setChartData] = useState([]);
  const [komoditi, setKomoditi] = useState("");
  console.log(komoditi);

  useEffect(() => {
    if (forecastData && forecastData.length > 0 && komoditi) {
      const filteredData = forecastData.filter(item => item.komoditi === komoditi);

      const formattedData = filteredData.map((item) => {
        const date = new Date(item.date);
        const monthYear = `${getMonthName(date.getMonth())} ${date.getFullYear()}`;

        return {
          date: monthYear,
          predicted_sales: item.predicted_sales,
        };
      });

      setChartData({
        labels: formattedData.map((item) => item.date),
        datasets: [
          {
            label: 'Prediksi Penjualan',
            data: formattedData.map((item) => item.predicted_sales),
            backgroundColor: 'rgba(75,192,192,0.6)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
          },
        ],
      });
    }
  }, [forecastData, komoditi]);

  // Function to get the month name from the month index
  const getMonthName = (monthIndex) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthIndex];
  };

  const viewChart = (value) => {
    setKomoditi(value);
  };

  return (
    <div className="ml-1">
      <h1 className='mb-5'>Data Prediksi Penjualan</h1>
      <ul className='flex flex-row justify-around'>
        <li>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2" onClick={() => viewChart("Jeruk")}>
            Jeruk
          </button>
        </li>
        <li>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2" onClick={() => viewChart("Apel")}>
            Apel
          </button>
        </li>
        <li>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2" onClick={() => viewChart("Jambu")}>
            Jambu
          </button>
        </li>
      </ul>
      {chart && chart.labels && chart.labels.length > 0 && (
        <ChartComponent chartData={chart} />
      )}
    </div>
  );
};

export default Dashboard;
