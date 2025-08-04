import React from "react";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number, meta?: { source?: string }) => void;
  visiblePages?: number; // number of pages to display at a time
  disabled?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onChange,
  disabled = false,
  visiblePages = 5,
  className = "",
}) => {
  //? Button styles
  const baseButtonClass =
    "h-8 w-8 flex justify-center items-center rounded-custom-md outline-0  ";
  const disabledButtonClass = "text-szGrey300 cursor-not-allowed";
  const defaultButtonClass = "text-szBlack700 hover:bg-szPrimary100";
  const defaultPageClass =
    "text-szPrimary900 hover:bg-szPrimary100 font-dmSans text-body-small-strong";
  const activePageClass =
    "bg-szPrimary500 font-dmSans text-szWhite100 text-body-small-strong";

  //? Generate page numbers in a dynamic way
  const generatePageNumbers = (): (number | "more")[] => {
    const pages: (number | "more")[] = [];
    const halfVisible = Math.floor(visiblePages / 2);

    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, currentPage + halfVisible);

    // Ensure the range always contains `visiblePages` if possible
    if (end - start + 1 < visiblePages) {
      if (start === 1) {
        end = Math.min(totalPages, start + visiblePages - 1);
      } else if (end === totalPages) {
        start = Math.max(1, end - visiblePages + 1);
      }
    }

    // Add page numbers to the list
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipses if there are more pages
    if (start > 1) {
      pages.unshift("more");
      pages.unshift(1); // include the first page
    }
    if (end < totalPages) {
      pages.push("more");
      pages.push(totalPages); // include the last page
    }

    return pages;
  };

  return (
    <div
      className={`flex justify-center items-center space-x-2 py-4 ${className}`}
    >
      {/* Previous Button  -----------------------------------------------*/}
      <button
        className={`${baseButtonClass} ${
          currentPage === 1 || disabled
            ? disabledButtonClass
            : defaultButtonClass
        }`}
        onClick={() =>
          currentPage > 1 &&
          !disabled &&
          onChange(currentPage - 1, { source: "prev-button" })
        }
        disabled={currentPage === 1 || disabled}
        aria-label="Previous Page"
      >
        <ArrowLeft2 size="20" />
      </button>

      {/* Page Numbers  -----------------------------------------------*/}
      {generatePageNumbers().map((page, index) =>
        page === "more" ? (
          <span
            key={`more-${index}`}
            className="h-8 w-8 flex justify-center items-center text-szSecondary500"
          >
            •••
          </span>
        ) : (
          <button
            key={page}
            className={`${baseButtonClass} ${
              disabled
                ? `${disabledButtonClass} bg-szGrey150`
                : `${page === currentPage ? activePageClass : defaultPageClass}`
            }`}
            onClick={() =>
              !disabled && onChange(page as number, { source: "page-number" })
            }
            disabled={disabled}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        )
      )}

      {/* Next Button ----------------------------------------------- */}
      <button
        className={`${baseButtonClass} ${
          currentPage === totalPages || disabled
            ? disabledButtonClass
            : defaultButtonClass
        }`}
        onClick={() =>
          currentPage < totalPages &&
          !disabled &&
          onChange(currentPage + 1, { source: "next-button" })
        }
        disabled={currentPage === totalPages || disabled}
        aria-label="Next Page"
      >
        <ArrowRight2 size="20" />
      </button>
    </div>
  );
};

export default Pagination;
