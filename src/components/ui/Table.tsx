// components/Table.tsx
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";
import Status from "./Status";
import Image from "next/image";
import { KeyboardArrowLeft } from "./icons/KeyboardArrowLeft";

const formatDate = (date: string): string => {
  const parsedDate = new Date(date);
  return new Intl.DateTimeFormat("en-GB")
    .format(parsedDate)
    .replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3 / $2 / $1");
};

interface TableProps<T extends { image?: string }> {
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

const Table = <T extends { image?: string }>({
  data,
  columns,
  renderRowActions,
  pagination,
  sortable,
  rowsPerPage = 20,
}: TableProps<T>) => {
  const t = useTranslations("tables");
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
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];
      
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, rowsPerPage]);

  const generatePagination = () => {
    const totalPages = pagination?.totalPages || 1;
    const pageNumbers: (number | string)[] = [];
    const range = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i <= range ||
        i >= totalPages - range ||
        (i >= currentPage - range && i <= currentPage + range)
      ) {
        pageNumbers.push(i);
      }
    }

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
    <>
      <div className="overflow-x-auto pb-4">
        <table className="table-auto overflow-scroll w-full">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.header}
                  className="px-3 py-[18px] text-start border-b border-light-100 cursor-pointer whitespace-nowrap"
                  onClick={() =>
                    sortable && column.accessor && handleSort(column.accessor)
                  }
                >
                  <span className="text-sm font-medium font-Cairo text-primary capitalize">
                    {t(column.header)}
                  </span>
                  {sortable && sortConfig.key === column.accessor && (
                    <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                  )}
                </th>
              ))}
              {renderRowActions && (
                <th className="px-3 py-[18px] text-start border-b border-light-100">
                  <span className="text-sm font-medium font-Cairo text-primary capitalize">
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
                  <td
                    key={column.header}
                    className="px-4 py-2 text-start border-b border-light-100"
                    data-column={column.accessor}
                  >
                    {column.accessor === "status" ? (
                      <Status status={String(row[column.accessor])} />
                    ) : column.accessor === "created" ? (
                      <span className="whitespace-nowrap">
                        {formatDate(String(row[column.accessor]))}
                      </span>
                    ) : column.accessor === "name" ? (
                      <div className="flex items-center gap-2 min-w-[200px]">
                        {row.image && row.image ? (
                          <Image
                            src={row.image}
                            alt="Company Logo"
                            className="w-10 h-10 object-cover rounded-full"
                            width={30}
                            height={30}
                          />
                        ) : null}
                        <span>{String(row[column.accessor])}</span>
                      </div>
                    ) : Array.isArray(row[column.accessor]) ? ( // Check if it's an array
                      (row[column.accessor] as string[]).join(", ") // Join array elements with a comma
                    ) : column.accessor &&
                      row[column.accessor] !== undefined ? (
                      (row[column.accessor] as React.ReactNode)
                    ) : (
                      "-"
                    )}
                  </td>
                ))}

                {renderRowActions && (
                  <td className="px-4 py-2 text-start border-b border-light-100 whitespace-nowrap">
                    {renderRowActions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
      </div>
      {pagination && (
        <ul className="p-4 flex justify-end gap-4 select-none">
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className={`p-2 text-gray-300 hover:opacity-100 ${
                currentPage <= 1 ? "opacity-30 pointer-events-none" : ""
              } cursor-pointer`}
            >
              <KeyboardArrowLeft />
            </button>
          </li>
          {generatePagination().map((page, index) => (
            <li
              key={index}
              className="w-10 h-10 text-gray-300 inline-flex items-center justify-center"
            >
              {page === "..." ? (
                <span>...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(Number(page))}
                  className={`px-4 py-2 rounded ${
                    page === currentPage ? "!text-black-400" : ""
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
              className="p-2 text-gray-300 hover:opacity-90 cursor-pointer rotate-180"
            >
              <KeyboardArrowLeft />
            </button>
          </li>
        </ul>
      )}
    </>
  );
};

export default Table;
