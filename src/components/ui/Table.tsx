// components/Table.tsx
import React, { useMemo, useState } from "react";

interface TableProps<T> {
  data: T[];
  columns: { header: string; accessor: keyof T }[];
  renderRowActions?: (row: T) => React.ReactNode;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  sortable?: boolean;
  rowsPerPage?: number;
}

const Table = <T,>({
  data,
  columns,
  renderRowActions,
  pagination,
  sortable,
  rowsPerPage = 20,
}: TableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);

  const handleSort = (key: keyof T) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    pagination?.onPageChange(page);
  };
  const sortedData = React.useMemo(() => {
    if (sortConfig.key) {
      return [...data].sort((a, b) => {
        if (sortConfig.key) {
          if (a[sortConfig.key] < b[sortConfig.key])
            return sortConfig.direction === "asc" ? -1 : 1;
          if (a[sortConfig.key] > b[sortConfig.key])
            return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return data;
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, rowsPerPage]);

  const generatePagination = () => {
    const totalPages = pagination?.totalPages || 1;
    const pageNumbers: (number | string)[] = [];
    const range = 1; // Number of pages to show before/after the current page

    for (let i = 1; i <= totalPages; i++) {
      // Always show the first few and last few pages
      if (
        i <= range ||
        i >= totalPages - range ||
        (i >= currentPage - range && i <= currentPage + range)
      ) {
        pageNumbers.push(i);
      }
    }

    // Add ellipsis when there are gaps
    const finalPages: (number | string)[] = [];
    pageNumbers.forEach((page, index) => {
      if (
        index > 0 &&
        typeof page === "number" &&
        typeof pageNumbers[index - 1] === "number" &&
        (page as number) - (pageNumbers[index - 1] as number) > 1
      ) {
        finalPages.push("...");
      }
      finalPages.push(page);
    });

    return finalPages;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.header}
                className="px-3 py-[18px] text-start border-b border-light-100 cursor-pointer"
                onClick={() =>
                  sortable && column.accessor && handleSort(column.accessor)
                }
              >
                <span className="text-sm font-medium font-Cairo text-primary">
                  {column.header}
                </span>
                {sortable && sortConfig.key === column.accessor && (
                  <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                )}
              </th>
            ))}
            {renderRowActions && (
              <th className="px-3 py-[18px] text-start border-b border-light-100">
                <span className="text-sm font-medium font-Cairo text-primary">
                  Actions
                </span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b">
              {columns.map((column) => (
                <td key={column.header} className="px-4 py-2 text-start">
                  {(column.accessor &&
                    (row[column.accessor] as React.ReactNode)) ||
                    "-"}
                </td>
              ))}
              {renderRowActions && (
                <td className="px-4 py-2 text-start">
                  {renderRowActions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {pagination && (
        <ul className="mt-4 flex justify-between">
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Previous
            </button>
          </li>
          {generatePagination().map((page, index) => (
            <li key={index}>
              {page === "..." ? (
                <span className="px-4 py-2 text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(Number(page))}
                  className={`px-4 py-2 rounded ${
                    page === currentPage
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              )}
            </li>
          ))}

          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= pagination.totalPages}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Next
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Table;
