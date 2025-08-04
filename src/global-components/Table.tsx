import React, { ReactElement, useState } from "react";
import Chip from "./Chip";
import Checkboxes from "./Checkboxes";
import { More, Grid2, ArrangeVertical } from "iconsax-react";

export type HeaderType =
    | { type: "string"; header: string; accessor: string; icon?: React.ReactNode }
    | { type: "more"; header: React.ReactNode; accessor: "more" }
    | { type: "checkbox"; header: React.ReactNode; accessor: "checkbox" };

interface TableProps {
    headers: HeaderType[];
    data: Record<string, React.ReactNode>[];
    moreOptions?: {
        icon?: ReactElement;
        label: string;
        onClick: (rowIndex: number) => void;
    }[];
    tableHeight?: string;
    onRowClick?: (rowIndex: number) => void;
}

const Table: React.FC<TableProps> = ({ headers, data, moreOptions, tableHeight, onRowClick }) => {
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: "asc" | "desc";
    } | null>(null);

    const [selectedRows, setSelectedRows] = useState<{
        [key: number]: boolean;
    }>({});
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);

    const isAllChecked = data.length > 0 && Object.keys(selectedRows).length === data.length;

    const handleHeaderCheckboxChange = () => {
        if (isAllChecked) {
            setSelectedRows({}); // Unselect all
        } else {
            const newSelection = data.reduce<{ [key: number]: boolean }>((acc, _, index) => {
                acc[index] = true;
                return acc;
            }, {});
            setSelectedRows(newSelection);
        }
    };

    const handleRowCheckboxChange = (index: number) => {
        setSelectedRows((prev) => {
            const updatedSelection = { ...prev };
            if (updatedSelection[index]) {
                delete updatedSelection[index]; // Unselect
            } else {
                updatedSelection[index] = true; // Select
            }
            return updatedSelection;
        });
    };

    const extractTextFromReactNode = (node: React.ReactNode): string => {
        if (typeof node === "string") return node;
        if (typeof node === "number") return node.toString();
        if (React.isValidElement(node)) {
            if (node.type === Chip) {
                // Handle the Chip component specifically
                return node.props.label;
            }
            // Traverse children recursively
            const children = node.props.children;
            if (typeof children === "string") return children;
            if (Array.isArray(children)) {
                return children.map(extractTextFromReactNode).join("");
            }
            return extractTextFromReactNode(children);
        }
        return "";
    };

    const sortedData = React.useMemo(() => {
        if (!sortConfig) return data;
        return [...data].sort((a, b) => {
            const aValue = extractTextFromReactNode(a[sortConfig.key]);
            const bValue = extractTextFromReactNode(b[sortConfig.key]);

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    const handleSort = (key: string) => {
        setSortConfig((prev) =>
            prev?.key === key ? { key, direction: prev.direction === "asc" ? "desc" : "asc" } : { key, direction: "asc" }
        );
    };

    return (
        <div className={`overflow-x-auto rounded-md border border-szGrey200 ${tableHeight}`}>
            <table className="min-w-full table-auto">
                <thead>
                    <tr className="bg-szGrey150">
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className="p-3 text-body-base-strong text-szBlack800 font-dmSans"
                                onClick={() => handleSort(header.accessor)}
                            >
                                <div className="flex items-center">
                                    {header.type === "string" && <span>{header.header}</span>}
                                    {header.type === "more" && <Grid2 className="w-5 h-5" />}
                                    {header.type === "checkbox" && (
                                        <Checkboxes checked={isAllChecked} onChange={handleHeaderCheckboxChange} />
                                    )}
                                    {header.type === "string" && (
                                        <span className="flex flex-row items-center justify-between w-1/2 gap-2 ml-2 text-gray-500">
                                            <ArrangeVertical className="w-3 h-3" />
                                            {header.icon && header.icon}
                                        </span>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((row, rowIndex) => (
                        <tr className="border border-szLightGrey400 border-x-0 p-3" key={rowIndex}>
                            {headers.map((header, colIndex) => (
                                <td key={colIndex} className="p-3">
                                    <div className="flex flex-row item-center gap-3 text-body-small-reg text-szBlack800 font-dmSans max-w-[220px]">
                                        {header.accessor === "more" ? (
                                            <div className="relative">
                                                <button
                                                    onClick={() => setOpenDropdown(openDropdown === rowIndex ? null : rowIndex)}
                                                    className="focus:outline-none"
                                                >
                                                    <More className="w-5 h-5 cursor-pointer" />
                                                </button>
                                                {openDropdown === rowIndex && moreOptions && (
                                                    <div className="absolute right-1 mt-0 bg-white border rounded-md shadow-lg z-10 w-fit">
                                                        {moreOptions.map((option, optionIndex) => (
                                                            <button
                                                                key={optionIndex}
                                                                onClick={() => {
                                                                    option.onClick(rowIndex);
                                                                    setOpenDropdown(null);
                                                                }}
                                                                className="flex flex-row items-center block text-left px-3 py-2 gap-[4px] text-body-small-reg text-szBlack800 font-dmSans hover:bg-szGrey150 whitespace-nowrap w-full"
                                                            >
                                                                {/* <Edit2 size="16" /> */}
                                                                {/* {option.icon} */}
                                                                {option.icon && React.cloneElement(option.icon, { size: 16 })}
                                                                {option.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : header.accessor === "checkbox" ? (
                                            <Checkboxes
                                                checked={!!selectedRows[rowIndex]}
                                                onChange={() => handleRowCheckboxChange(rowIndex)}
                                            />
                                        ) : (
                                            <span
                                                className="truncate overflow-hidden whitespace-nowrap block"
                                                title={String(row[header.accessor] ?? "")}
                                                onClick={() => {
                                                    onRowClick?.(rowIndex);
                                                }}
                                            >
                                                {row[header.accessor]}
                                            </span>
                                        )}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
