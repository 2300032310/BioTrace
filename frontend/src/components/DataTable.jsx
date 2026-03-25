import React, { useState } from 'react';
import '../styles/DataTable.css';

const DataTable = ({ columns, data, onRowClick, itemsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getValue = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }
    return item[column.key] || '-';
  };

  return (
    <div className="datatable-container">
      {/* Search Bar */}
      <div className="datatable-search">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="datatable-search-input"
        />
      </div>

      {/* Table */}
      <div className="datatable-wrapper">
        <table className="datatable">
          <thead className="datatable-head">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="datatable-th"
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="datatable-th-content">
                    {column.header}
                    {sortField === column.key && (
                      <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="datatable-body">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="datatable-empty">
                  No data available
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr
                  key={item.id || index}
                  className="datatable-row"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="datatable-cell">
                      {getValue(item, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="datatable-pagination">
          <div className="datatable-pagination-info">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of{' '}
            {sortedData.length} results
          </div>
          <div className="datatable-pagination-buttons">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="datatable-pagination-btn"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="datatable-pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
