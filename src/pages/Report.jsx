import React, { useState, useEffect } from 'react';
import Pagination from '../components/Pagination';
import { useDataContext } from '../context/DataContext';
import axios from 'axios';

const Report = () => {
  const { salesData, setReportData } = useDataContext();
  const dataPage = salesData;
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [version, setVersion] = useState(0);
  const [totalSales, setTotalSales] = useState('');
  const [saleIdToUpdate, setSaleIdToUpdate] = useState(null);

  useEffect(() => {
    setCurrentPage(1); // Reset currentPage setiap kali data berubah
  }, [salesData]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = dataPage.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(dataPage.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (saleId, initialTotalSales) => {
    setSaleIdToUpdate(saleId);
    setTotalSales(initialTotalSales);
  };

  const handleUpdate = async () => {
    try {
      // Mengirim request PUT ke endpoint /api/sales/<sale_id> dengan data yang diperbarui
      await axios.put(`http://localhost:5000/api/sales/${saleIdToUpdate}`, { total_sales: totalSales });
      const response = await axios.get('http://localhost:5000/api/get_data');
      setReportData(response.data.alldata.sales_data);
      setTotalSales('');
      setSaleIdToUpdate(null);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleCloseModal = () => {
    setTotalSales('');
    setSaleIdToUpdate(null);
  };

  const handleDelete = async (saleId) => {
    try {
      // Mengirim request DELETE ke endpoint /api/sales/<sale_id>
      await axios.delete(`http://localhost:5000/api/sales/${saleId}`);
      // Memperbarui data setelah penghapusan berhasil
      const response = await axios.get('http://localhost:5000/api/get_data');
      setReportData(response.data.alldata.sales_data);
      setVersion(version + 1)

    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg' key={version}>
      <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr className=''>
            <th scope="col" className='px-6 py-3'>ID</th>
            <th scope="col" class="px-6 py-3">Date</th>
            <th scope="col" class="px-6 py-3">Total Sales</th>
            <th scope="col" class="px-6 py-3">Komoditas</th>
            <th scope="col" class="px-6 py-3">Actions</th> {/* Kolom untuk menampilkan tombol aksi */}
          </tr>
        </thead >
        <tbody className=''>
          {currentData.map((item, index) => {
            const itemId = indexOfFirstItem + index + 1; // Nomor ID dihitung dari indeks data secara keseluruhan
            return (
              <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' key={item.id}>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{itemId}</td>
                <td className="px-6 py-4">{item.date}</td>
                <td className="px-6 py-4">{item.total_sales}</td>
                <td className="px-6 py-4">{item.komoditi}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleEdit(item.id)} className="mr-2 text-blue-500 hover:text-blue-700">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">Delete</button>
                </td> {/* Tombol aksi untuk edit dan delete */}
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
      {saleIdToUpdate !== null && (
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            {/* Centered content */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Update Total Sales</h3>
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Enter new total sales"
                        value={totalSales || ''}
                        onChange={(e) => setTotalSales(e.target.value)}
                        className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md mb-2"
                      />
                      <div className="flex justify-end">
                        <button onClick={handleUpdate} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Update
                        </button>
                        <button onClick={handleCloseModal} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Report;
