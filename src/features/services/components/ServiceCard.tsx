import { Health } from "iconsax-react";
import React from "react";

interface ServiceCardProps {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  name,
  price,
  description,
  image,
}) => {
  return (
    <div className="bg-white w-full rounded-lg shadow-sm border border-szLightGrey200 hover:shadow-lg hover:border-szPrimary300 hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
      {/* Image Section */}
      <div className="relative h-36 bg-gradient-to-br from-szPrimary50 via-szPrimary100 to-szPrimary200 flex items-center justify-center overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-14 h-14 bg-gradient-to-br from-szPrimary500 to-szPrimary700 rounded-xl flex items-center justify-center shadow-lg">
            <Health className="text-white" size={24} />
          </div>
        )}
        {/* Price Badge */}
        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-[4px] shadow-lg border border-szPrimary200">
          <p className="text-sm font-bold font-dmSans text-szPrimary700">
            ₱{price.toLocaleString()}
          </p>
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-2">
        <p className="text-lg font-bold font-dmSans uppercase text-szBlack700 group-hover:text-szPrimary700 transition-colors duration-300 text-center leading-tight tracking-wide">
          {name}
        </p>
        {description && (
          <p className="text-body-small-reg text-szBlack500 text-center leading-relaxed group-hover:text-szBlack600 transition-colors duration-300">
            {description}
          </p>
        )}
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-szPrimary300 transition-colors duration-300 pointer-events-none"></div>
    </div>
  );
};

export default ServiceCard;
