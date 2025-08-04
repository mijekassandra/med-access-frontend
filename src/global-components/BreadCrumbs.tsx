import React from "react";

interface BreadCrumbsProps {
  items: { label: string; icon?: React.ReactNode; href?: string }[];
}
const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            {item.icon && <span className="text-szGrey500">{item.icon}</span>}
            {item.href ? (
              <a
                href={item.href}
                className="text-caption-md text-szPrimary900 hover:text-szPrimary700 flex items-center"
                aria-current={index === items.length - 1 ? "page" : undefined}
              >
                {item.label}
              </a>
            ) : (
              <span className="text-caption-md text-szPrimary900">
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <span className="text-caption-md text-szPrimary900 p-2">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
export default BreadCrumbs;
