import React from "react";
import { SearchNormal1 } from "iconsax-react";

interface NoSearchFoundProps {
  hasSearchTerm?: boolean;
  searchTitle?: string;
  noItemsTitle?: string;
  searchDescription?: string;
  noItemsDescription?: string;
  icon?: React.ComponentType<any>;
  iconSize?: number;
  className?: string;
}

const NoSearchFound: React.FC<NoSearchFoundProps> = ({
  hasSearchTerm = false,
  searchTitle = "No results found",
  noItemsTitle = "No items available",
  searchDescription = "Try adjusting your search terms.",
  noItemsDescription = "Check back later for new items.",
  icon: Icon = SearchNormal1,
  iconSize = 48,
  className = "",
}) => {
  return (
    <div className={`text-center mt-20 ${className}`}>
      <Icon size={iconSize} className="text-szDarkGrey600 mx-auto mb-4" />
      <h3 className="text-h4 text-szGray700 mb-2">
        {hasSearchTerm ? searchTitle : noItemsTitle}
      </h3>
      <p className="text-szDarkGrey600 text-body-base-reg">
        {hasSearchTerm ? searchDescription : noItemsDescription}
      </p>
    </div>
  );
};

export default NoSearchFound;
