import React from 'react';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  return (
    <div className="flex overflow-x-auto sm:justify-center">
      <ul className="flex gap-4 my-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''} border-2 bg-blue-500 rounded-md text-white`}>
            <button
              onClick={() => onPageChange(i + 1)}
              className="w-6 h-6"
            >
              {i + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination;
