// src/components/DataTable.js
import React from 'react';

const DataTable = ({ data }) => {
  return (
    <div>
      <h2>Data Table</h2>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Month</th>
            <th>Sales</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{entry.month}</td>
              <td>{entry.sales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
