import { Profile } from "iconsax-react";
import { useGetMedicalRecordsQuery } from "../../medical-records/api/medicalRecordsApi";
import { useMemo } from "react";

interface PatientRecord {
  id: string;
  name: string;
  dateOfRecord: string;
}

const RecentPatientRecord = () => {
  const { data, isLoading, isError } = useGetMedicalRecordsQuery();

  // Transform and limit to latest 5 records
  const patientRecords: PatientRecord[] = useMemo(() => {
    if (!data?.data) return [];

    // Sort by createdAt (latest first), filter out deleted patients, and limit to 5
    const sortedRecords = [...data.data]
      .filter((record) => record.patient !== null && record.patient !== undefined) // Filter out deleted patients
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Latest first
      })
      .slice(0, 5)
      .map((record) => {
        // Patient is guaranteed to exist due to filter above
        const patient = record.patient!;
        
        return {
          id: record._id,
          name: `${patient.lastName}, ${patient.firstName}`,
          dateOfRecord: new Date(record.dateOfRecord).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          ),
        };
      });

    return sortedRecords;
  }, [data]);

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
      <div className="min-h-[200px] max-h-80 overflow-y-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-red-500">
              Error loading patient records
            </p>
          </div>
        )}

        {/* Table Body */}
        {!isLoading &&
          !isError &&
          patientRecords.map((record, index) => (
            <div key={record.id}>
              <div className="px-4 py-2 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center gap-2 my-[6px]">
                  {/* Name */}
                  <div className="col-span-5">
                    <p className="text-sm text-gray-900 truncate">
                      {record.name}
                    </p>
                  </div>

                  {/* Date of Record */}
                  <div className="col-span-5">
                    <p className="text-sm text-gray-700 truncate">
                      {record.dateOfRecord}
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
        {!isLoading && !isError && patientRecords.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-gray-500">No recent patient records</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentPatientRecord;
