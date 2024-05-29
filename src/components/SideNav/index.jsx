import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate for React Router v6
import axios from "axios";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token')
  console.log(token)// Use useNavigate for navigation in React Router v6

  const Navigation = [
    {
      name: "Dashboard",
      path: "/",
    },
    {
      name: "Forecasting",
      path: "/forecasting",
    },
    {
      name: "Report",
      path: "/report",
    },
    {
      name: "Logout",
      path: "/logout",
    }
  ];

  const currentNavigationItem = Navigation.find((item) => location.pathname === item.path);

  const removeTokenFromLocalStorage = () => {
    localStorage.removeItem('token');
  };

  const handleLogout = async (tokens) => {
    console.log(tokens)
    try {
      // Kirim permintaan logout ke backend
      const response = await axios.post('http://localhost:5000/api/logout', {}, {
        headers: {
          Authorization: tokens // Mengirim token sebagai header Authorization
        }
      });
      console.log(response.data.message);
      if (response.status === 200) {
        removeTokenFromLocalStorage();
        window.location.reload()
      } else {
        console.error("Logout failed");
      } // Pesan logout dari backend
      // Lakukan sesuatu setelah logout, seperti menghapus token dari penyimpanan lokal atau mengarahkan pengguna ke halaman login
    } catch (error) {
      console.error('Logout error:', error);
      // Tangani kesalahan logout, misalnya dengan menampilkan pesan kesalahan kepada pengguna
    }
  };

  return (
    <div className="flex h-full">
      <aside className="fixed z-50 w-20 md:w-72 h-full p-3 bg-white border-r-[1px] flex flex-col justify-between transition-all duration-300">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-medium md:hidden">Forecast</h1>
          <h1 className="text-3xl font-medium hidden md:block">SARIMA Forecast</h1>
          <span className="border-b-[1px] border-gray-200 w-full p-2"></span>
          <div className="mt-5 w-full flex flex-col gap-y-2">
            {Navigation.map((item, index) => (
              <div key={index}>
                {item.path === "/logout" ? (
                  <div onClick={() => handleLogout(token)} className="cursor-pointer text-dark p-3 rounded-md flex justify-center md:justify-start items-center gap-x-3 hover:bg-blue-700 hover:text-white transition duration-300">
                    <span className="hidden md:block font-medium grow">
                      {item.name}
                    </span>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`${location.pathname === item.path
                      ? "bg-blue-700 text-white"
                      : "text-dark"} p-3 rounded-md flex justify-center md:justify-start items-center gap-x-3 hover:bg-blue-700 hover:text-white transition duration-300`}
                  >
                    {/* You can include an icon here if needed */}
                    <span className="hidden md:block font-medium grow">
                      {item.name}
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>
      <main className="bg-[#F5F6F9] ml-20 md:ml-72 w-full pt-10 pb-5 px-5 min-h-screen overflow-hidden">
        {currentNavigationItem && (
          <div className="text-4xl font-bold mb-5">
            {currentNavigationItem.name}
          </div>
        )}
        {/* Outlet is used for rendering nested routes */}
        <Outlet />
      </main>
    </div>
  );
};

export default Sidebar;
