import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  // Reset to page 1 whenever the data changes when filtering 
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (!data.length) return <div className="text-center p-10 text-gray-500">No data available for this selection.</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-bold text-gray-800">Vehicle Registrations</h2>
        <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
          Total Records: <span className="font-semibold text-gray-900">{data.length.toLocaleString()}</span>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
            <tr>
              <th className="px-6 py-4">VIN</th>
              <th className="px-6 py-4">Make</th>
              <th className="px-6 py-4">Model</th>
              <th className="px-6 py-4">Year</th>
              <th className="px-6 py-4">City</th>
              <th className="px-6 py-4 text-right">Range (mi)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentRows.map((row, index) => (
              <tr key={index} className="hover:bg-blue-50 transition duration-150">
                <td className="px-6 py-4 font-mono text-xs text-gray-500">{row['VIN (1-10)']}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{row.Make}</td>
                <td className="px-6 py-4">{row.Model}</td>
                <td className="px-6 py-4">{row['Model Year']}</td>
                <td className="px-6 py-4">{row.City}</td>
                <td className="px-6 py-4 text-right">
                  {row['Electric Range'] === '0' ? 
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">Unknown</span> : 
                    <span className="text-green-600 font-semibold">{row['Electric Range']}</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition
            ${currentPage === 1 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 shadow-sm'
            }`}
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous
        </button>

        <span className="text-sm text-gray-600 font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition
            ${currentPage === totalPages 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 shadow-sm'
            }`}
        >
          Next
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default DataTable;