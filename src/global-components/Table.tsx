import React, { useState, useMemo } from "react";
import PopoverMenu from "./PopoverMenu";
import Pagination from "./Pagination";
import { type DropdownMenuItem } from "./DropdownMenu";
import Loading from "../components/Loading";

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
  visible?: (record: T) => boolean;
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
  dropdownWidth?: string;
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
  dropdownWidth = "w-36",
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

  // Smart sorting function that handles different data types
  const smartSort = (aValue: any, bValue: any): number => {
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    // Convert to strings for type checking
    const aStr = String(aValue).trim();
    const bStr = String(bValue).trim();

    // Check if values are numbers (including negative numbers and decimals)
    const aNum = Number(aValue);
    const bNum = Number(bValue);
    if (!isNaN(aNum) && !isNaN(bNum) && aStr !== "" && bStr !== "") {
      return aNum - bNum;
    }

    // Check if values are valid dates
    const aDate = new Date(aValue);
    const bDate = new Date(bValue);
    if (
      !isNaN(aDate.getTime()) &&
      !isNaN(bDate.getTime()) &&
      aDate.getTime() !== 0 &&
      bDate.getTime() !== 0
    ) {
      return aDate.getTime() - bDate.getTime();
    }

    // Default to string comparison (case-insensitive)
    return aStr.toLowerCase().localeCompare(bStr.toLowerCase());
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      const comparison = smartSort(aValue, bValue);
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
    return actions
      .filter((action) => action.visible?.(record) !== false)
      .map((action) => ({
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
        <Loading spinnerSize="large" message="Loading..." />
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 h-fit ${className}`}
    >
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
                    <td
                      className="px-4 py-3 border-b border-szLightGrey400"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <PopoverMenu
                        items={getActionItems(record)}
                        size="small"
                        color="text-szBlack700"
                        position="left"
                        width={dropdownWidth}
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
