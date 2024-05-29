import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from "./pages/Authentication/SignIn";
import SideBar from "./components/SideNav";
import Dashboard from "./pages/Dashboard";
import Forecasting from "./pages/Forecasting";
import Report from "./pages/Report";
import { DataProvider } from "./context/DataContext";

function App() {
  // State to manage authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Check for the presence of the token in localStorage or wherever you store it
    const storedToken = localStorage.getItem('token');
    console.log(storedToken) // Adjust this based on your token storage mechanism
    if (storedToken) {
      setIsAuthenticated(true);
      setToken(storedToken);
    } else {
      setIsAuthenticated(false);
      setToken('');
    }
  }, []); // useEffect will be called whenever 'token' changes

  return (
    <Router>
      <DataProvider>
        <Routes>
          <Route path="/" element={isAuthenticated ? <SideBar /> : <SignIn />} >
            <Route index element={isAuthenticated ? <Dashboard /> : null} />
            <Route path="forecasting" element={<Forecasting />} />
            <Route path="report" element={<Report />} />
          </Route>
        </Routes>
      </DataProvider>
    </Router>
  );
}

export default App;
