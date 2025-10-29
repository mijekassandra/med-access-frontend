import React from "react";
import { Profile } from "iconsax-react";

interface PatientRecord {
  id: string;
  name: string;
  address: string;
}

const RecentPatientRecord = () => {
  // Sample data - replace with actual data from props or API
  const patientRecords: PatientRecord[] = [
    {
      id: "001",
      name: "Ladera, Karl William",
      address: "Gumaod, Claveria Mis. Or.",
    },
    {
      id: "002",
      name: "Coliao, Gladys A.",
      address: "Bontugan Jasaan, Mis. Or.",
    },
    {
      id: "003",
      name: "Pana, James Anthony",
      address: "Kimaya Jasaan, Mis. Or.",
    },
    {
      id: "004",
      name: "Dacula, Fell Jedd",
      address: "Solana Jasaan, Mis. Or.",
    },
    {
      id: "005",
      name: "Ackerman, Levi",
      address: "Solana Jasaan, Mis. Or.",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-shadow duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-szPrimary200 to-szPrimary100 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-szPrimary700 rounded-md">
            <Profile size={16} className="text-white" />
          </div>
          <h6 className="text-h6 font-bold text-szPrimary700">
            Recent Patient Records
          </h6>
        </div>
      </div>

      {/* Body */}
      <div className="max-h-80 overflow-y-auto">
        {/* Table Body */}
        {patientRecords.map((record, index) => (
          <div key={record.id}>
            <div className="px-4 py-2 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center gap-2 my-[6px]">
                {/* Name */}
                <div className="col-span-5">
                  <p className="text-sm text-gray-900 truncate">
                    {record.name}
                  </p>
                </div>

                {/* Address */}
                <div className="col-span-5">
                  <p className="text-sm text-gray-700 truncate">
                    {record.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Separator */}
            {index < patientRecords.length - 1 && (
              <div className="border-b border-gray-100 mx-4" />
            )}
          </div>
        ))}

        {/* Empty State */}
        {patientRecords.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-gray-500">No recent patient records</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentPatientRecord;
