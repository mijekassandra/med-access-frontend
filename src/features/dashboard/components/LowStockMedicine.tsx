import { Box } from "iconsax-react";

interface MedicineItem {
  id: string;
  dosage: string;
  name: string;
  stock: number;
  brand: string;
}

const LowStockMedicine = () => {
  // Sample data - replace with actual data from props or API
  const medicines: MedicineItem[] = [
    {
      id: "1",
      name: "Paracetamol",
      dosage: "500mg",
      stock: 25,
      brand: "Paracetamol",
    },
    {
      id: "2",
      name: "Amoxicillin",
      dosage: "250mg",
      stock: 45,
      brand: "Amoxicillin",
    },
    {
      id: "3",
      name: "Ibuprofen",
      dosage: "400mg",
      stock: 75,
      brand: "Ibuprofen",
    },
    {
      id: "4",
      name: "Vitamin C",
      dosage: "1000mg",
      stock: 15,
      brand: "Vitamin C",
    },
    {
      id: "5",
      name: "Metformin",
      dosage: "500mg",
      stock: 85,
      brand: "Metformin",
    },
    {
      id: "6",
      name: "Lisinopril",
      dosage: "10mg",
      stock: 30,
      brand: "Lisinopril",
    },
    {
      id: "7",
      name: "Omeprazole",
      dosage: "20mg",
      stock: 60,
      brand: "Omeprazole",
    },
    {
      id: "8",
      name: "Atorvastatin",
      dosage: "20mg",
      stock: 40,
      brand: "Atorvastatin",
    },
  ];

  // Filter medicines with stock <= 100
  const lowStockMedicines = medicines.filter(
    (medicine) => medicine.stock <= 100
  );

  const getStockColor = (stock: number) => {
    if (stock < 50) {
      return "bg-error700";
    } else if (stock < 100) {
      return "bg-warning500";
    }
    return "bg-success700";
  };

  const getStockStatus = (stock: number) => {
    if (stock < 50) {
      return "Critical";
    } else if (stock < 100) {
      return "Low";
    }
    return "Normal";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-shadow duration-200 h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-szPrimary200 to-szPrimary100 px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-szPrimary700 rounded-md">
            <Box size={16} className="text-white" />
          </div>
          <h6 className="text-h6 font-bold text-szPrimary700">
            Low Stock Medicine
          </h6>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {lowStockMedicines.map((medicine, index) => (
          <div key={medicine.id}>
            <div className="flex justify-between items-center px-4 py-2 hover:bg-gray-50 transition-colors w-full">
              {/* Medicine Info */}
              <div className="flex justify-start items-center gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {medicine.name} {medicine.dosage}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {medicine.brand}
                  </p>
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex justify-between items-center gap-2 w-[90px] ">
                <div className="flex-shrink-0 mx-2 w-[10px]">
                  <div
                    className={`w-2 h-2 rounded-full ${getStockColor(
                      medicine.stock
                    )}`}
                    title={getStockStatus(medicine.stock)}
                  />
                </div>

                {/* Stock Count */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm text-gray-500">
                    {medicine.stock} stock
                  </p>
                </div>
              </div>
            </div>

            {/* Separator */}
            {index < lowStockMedicines.length - 1 && (
              <div className="border-b border-gray-100 mx-4" />
            )}
          </div>
        ))}

        {/* Empty State */}
        {lowStockMedicines.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-gray-500">No low stock medicines</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LowStockMedicine;
