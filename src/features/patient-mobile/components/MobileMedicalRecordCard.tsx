import React from "react";

interface MedicalRecordData {
  id: string | number;
  recordDate: string;
  doctor: string;
  specialty: string;
  diagnosis: string;
  description: string;
  treatment: string;
}

interface MobileMedicalRecordCardProps {
  record: MedicalRecordData;
  recordNumber?: number;
}

const MobileMedicalRecordCard: React.FC<MobileMedicalRecordCardProps> = ({
  record,
  recordNumber,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-szGrey200 relative">
      {/* Record Number Badge */}
      {recordNumber && (
        <div className="absolute top-3 right-3">
          <p className="bg-szPrimary100 text-szPrimary900 text-caption-reg font-bold px-2 py-1 rounded-md">
            #{recordNumber}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* Record Date */}
        <div>
          <p className="text-szDarkGrey600 text-sm font-montserrat font-medium mb-1">
            Record Date
          </p>
          <h5 className="text-szPrimary900 text-h5 ">{record.recordDate}</h5>
        </div>

        {/* Doctor */}
        <div>
          <p className="text-szDarkGrey600 text-sm font-montserrat font-medium mb-1">
            Doctor
          </p>
          <h5 className="text-szPrimary900 text-h5">{record.doctor}</h5>
          <p className="text-szDarkGrey600 text-body-base-reg">
            {record.specialty}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-szGrey200"></div>

        {/* Diagnosis */}
        <div>
          <h6 className="text-szDarkGrey600 text-h6 font-montserrat font-semibold mb-1">
            Diagnosis
          </h6>
          <p className="text-szBlack700 text-body-base-reg">
            {record.diagnosis}
          </p>
        </div>

        {/* Description */}
        <div>
          <h6 className="text-szDarkGrey600 text-h6 font-montserrat font-semibold mb-1">
            Description
          </h6>
          <p className="text-szBlack700 text-body-base-reg leading-relaxed text-justify">
            {record.description}
          </p>
        </div>

        {/* Treatment */}
        <div>
          <h6 className="text-szDarkGrey600 text-h6 font-montserrat font-semibold mb-1">
            Treatment
          </h6>
          <p className="text-szBlack700 text-body-base-reg leading-relaxed text-justify">
            {record.treatment}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileMedicalRecordCard;
