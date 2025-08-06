import React, { useState, useMemo } from "react";
import PopoverMenu from "./PopoverMenu";
import Pagination from "./Pagination";
import { type DropdownMenuItem } from "./DropdownMenu";

export interface TableColumn<T = Record<string, any>> {
  key: string;
  header: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  className?: string;
}

export interface TableAction<T = Record<string, any>> {
  label: string;
  icon?: React.ReactNode;
  onClick: (record: T) => void;
  disabled?: (record: T) => boolean;
}

export interface TableProps<T = Record<string, any>> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    onChange: (page: number) => void;
  };
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  rowClassName?: string | ((record: T, index: number) => string);
  onRowClick?: (record: T) => void;
}

const Table = <T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  searchKeys = [],
  pagination,
  loading = false,
  emptyMessage = "No records found",
  className = "",
  rowClassName,
  onRowClick,
}: TableProps<T>) => {
  const [searchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    return data.filter((record) => {
      const searchableKeys =
        searchKeys.length > 0 ? searchKeys : Object.keys(record);

      return searchableKeys.some((key) => {
        const value = record[key];
        if (value == null) return false;

        const stringValue = String(value).toLowerCase();
        return stringValue.includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, searchKeys]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      const comparison = String(aValue).localeCompare(String(bValue));
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const getRowClassName = (record: T, index: number) => {
    const baseClass = "hover:bg-szGrey50 transition-colors duration-200";
    const alternatingClass = index % 2 === 0 ? "bg-white" : "bg-szGrey25";
    const customClass =
      typeof rowClassName === "function"
        ? rowClassName(record, index)
        : rowClassName;
    const clickableClass = onRowClick ? "cursor-pointer" : "";

    return `${baseClass} ${alternatingClass} ${
      customClass || ""
    } ${clickableClass}`.trim();
  };

  const renderCell = (column: TableColumn<T>, record: T, index: number) => {
    const value = record[column.key];

    if (column.render) {
      return column.render(value, record, index);
    }

    return (
      <p className="text-body-small-reg text-szBlack700">
        {value != null ? String(value) : "-"}
      </p>
    );
  };

  const getActionItems = (record: T): DropdownMenuItem[] => {
    return actions.map((action) => ({
      label: action.label,
      icon: action.icon,
      onClick: () => action.onClick(record),
      disabled: action.disabled?.(record) || false,
    }));
  };

  if (loading) {
    return (
      <div
        className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
      >
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-szPrimary500 mx-auto"></div>
          <p className="mt-2 text-szBlack700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      {/* Search Bar */}
      {/* {searchable && (
        <div className="p-4 border-b border-szLightGrey400">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Box}
            className="max-w-md"
          />
        </div>
      )} */}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-szGrey25 border-b border-szLightGrey400 ">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-szBlack800 font-dmSans bg-gray-100 ${
                    column.sortable ? "cursor-pointer hover:bg-szGrey50" : ""
                  } ${column.className || ""}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2 min-h-[44px]">
                    <p className="text-body-base-strong text-szBlack700">
                      {column.header}
                    </p>
                    {column.sortable && sortConfig?.key === column.key && (
                      <p className="text-szPrimary500 text-body-small-strong">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </p>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-4 py-3 text-left text-szBlack800 bg-gray-100">
                  <p className="text-body-base-reg">Actions</p>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="px-4 py-8 text-center text-szBlack700 "
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((record, index) => (
                <tr
                  key={index}
                  className={
                    getRowClassName(record, index) + " hover:bg-szPrimary50"
                  }
                  onClick={() => onRowClick?.(record)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-3 border-b border-szLightGrey400 ${
                        column.className || ""
                      }`}
                    >
                      {renderCell(column, record, index)}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-4 py-3 border-b border-szLightGrey400">
                      <PopoverMenu
                        items={getActionItems(record)}
                        size="small"
                        color="text-szBlack700"
                        position="left"
                        width="w-36"
                      />
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="border-t border-szLightGrey400">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onChange={pagination.onChange}
          />
        </div>
      )}
    </div>
  );
};

export default Table;
