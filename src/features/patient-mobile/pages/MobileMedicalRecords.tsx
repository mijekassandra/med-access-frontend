import React, { useState } from "react";

import { SearchNormal1 } from "iconsax-react";

//components
import MobileError from "../mobile-global-components/MobileError";
import MobileLoading from "../mobile-global-components/MobileLoading";
import NoSearchFound from "../../../global-components/NoSearchFound";
import Inputs from "../../../global-components/Inputs";
import MobilePageTitle from "../mobile-global-components/MobilePageTitle";
import MobileMedicalRecordCard from "../components/MobileMedicalRecordCard";

// Mock data interface for medical records
interface MedicalRecordData {
  id: string | number;
  recordDate: string;
  doctor: string;
  specialty: string;
  diagnosis: string;
  description: string;
  treatment: string;
}

const MobileMedicalRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for medical records
  const mockMedicalRecords: MedicalRecordData[] = [
    {
      id: 1,
      recordDate: "Jan 15, 2024, 05:30 PM",
      doctor: "Dr. Maria Santos",
      specialty: "Internal Medicine",
      diagnosis: "Hypertension (Stage 2)",
      description:
        "Patient presented with elevated blood pressure readings over the past 3 months. Blood pressure consistently measured at 160/95 mmHg on multiple occasions. Patient reports occasional headaches and fatigue. No chest pain or shortness of breath. Family history of hypertension on maternal side. Patient is a 45-year-old office worker with sedentary lifestyle.",
      treatment:
        "Lifestyle modifications including DASH diet, regular aerobic exercise (30 minutes daily), weight reduction, and medication therapy with ACE inhibitor (Lisinopril 10mg daily). Follow-up appointment scheduled in 4 weeks to monitor blood pressure response and adjust medication if needed.",
    },
    {
      id: 2,
      recordDate: "Dec 20, 2023, 10:15 AM",
      doctor: "Dr. John Smith",
      specialty: "Cardiology",
      diagnosis: "Routine Check-up",
      description:
        "Annual physical examination. Patient reports feeling well with no acute complaints. Vital signs within normal limits. Heart sounds regular, no murmurs detected. Lungs clear to auscultation.",
      treatment:
        "Continue current medications. Maintain healthy lifestyle. Schedule next annual check-up in 12 months.",
    },
    {
      id: 3,
      recordDate: "Nov 8, 2023, 02:45 PM",
      doctor: "Dr. Sarah Johnson",
      specialty: "Dermatology",
      diagnosis: "Mild Acne",
      description:
        "Patient presents with mild facial acne, primarily on forehead and chin. No signs of infection or severe inflammation. Patient reports using over-the-counter treatments with minimal improvement.",
      treatment:
        "Prescribed topical retinoid cream and gentle cleanser. Advised to avoid harsh scrubbing and maintain consistent skincare routine. Follow-up in 6 weeks.",
    },
  ];

  // Filter medical records based on search term
  const filteredMedicalRecords = mockMedicalRecords.filter(
    (record) =>
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.treatment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-szWhite100 mb-6">
      {/* Header */}
      <div className="px-4 pt-4">
        <MobilePageTitle
          title="Medical Records"
          description="Access your complete medical history and treatment records"
        />

        {/* Search Bar */}
        <Inputs
          type="text"
          placeholder="Search medical records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={SearchNormal1}
          className="my-4"
        />
      </div>

      {/* Content */}
      <div className="px-4 py-2">
        {filteredMedicalRecords.length === 0 ? (
          <NoSearchFound
            hasSearchTerm={!!searchTerm}
            searchTitle="No medical records found"
            noItemsTitle="No medical records available"
            searchDescription="Try adjusting your search terms."
            noItemsDescription="Your medical records will appear here once available."
            icon={SearchNormal1}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-szDarkGrey600 text-body-base-reg">
                {filteredMedicalRecords.length} record
                {filteredMedicalRecords.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {filteredMedicalRecords.map((record, index) => (
              <MobileMedicalRecordCard
                key={record.id}
                record={record}
                recordNumber={index + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMedicalRecords;
