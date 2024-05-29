// DataContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [salesData, setSalesData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [isDataChanged, setIsDataChanged] = useState(false); // Tambahkan state untuk sinyal perubahan
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/get_data');
        const { sales_data, forecast_data } = response.data.alldata;
        setSalesData(sales_data);
        setForecastData(forecast_data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [navigate]);

  const setReportData = (newData) => {
    // Tambahkan logika untuk menangani data laporan
    setSalesData(newData);
    setIsDataChanged(true); 
  };

  return (
    <DataContext.Provider value={{ salesData, forecastData, setReportData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
