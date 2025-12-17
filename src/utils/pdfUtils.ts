import jsPDF from "jspdf";
import logoImage from "../assets/medaccess.png";

interface MedicalRecordForPDF {
  patientName: string;
  diagnosis: string;
  treatmentPlan: string;
  dateOfRecord: string;
}

/**
 * Converts an image URL or imported image to base64 data URL
 */
const getImageAsDataUrl = (imageSrc: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } else {
        reject(new Error("Could not get canvas context"));
      }
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
};

/**
 * Generates a PDF document for a medical record
 * @param record - The medical record data to include in the PDF
 */
export const generateMedicalRecordPDF = async (
  record: MedicalRecordForPDF
): Promise<void> => {
  const doc = new jsPDF();

  // Set up colors
  const textColor = [51, 51, 51]; // Dark gray
  const lightGray = [245, 245, 245];
  const borderGray = [220, 220, 220];

  // Header height (smaller)
  const headerHeight = 25;

  // Try to load and add logo
  try {
    const logoDataUrl = await getImageAsDataUrl(logoImage);
    // Add logo on the left side of header (square size to prevent stretching)
    const logoSize = 20; // Square dimensions
    const logoX = 10; // Logo X position
    doc.addImage(logoDataUrl, "PNG", logoX, 2.5, logoSize, logoSize);
  } catch (error) {
    console.warn("Could not load logo for PDF:", error);
    // Continue without logo if it fails to load
  }

  // Add header text (plain background, no fill) - positioned closer to logo
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const textX = 35; // Moved closer to logo (was 50)
  doc.text("Med Access Medical Record", textX, 12);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Patient medical record", textX, 19);

  // Add a subtle border line below header
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.5);
  doc.line(10, headerHeight + 5, 200, headerHeight + 5);

  // Add content section with more spacing
  let yPosition = headerHeight + 20;

  // Helper function to add a section
  const addSection = (
    label: string,
    value: string | string[],
    yPos: number
  ) => {
    // Calculate label height
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const labelHeight = 4.5; // Height for the label text

    // Draw grey background for label only (matching label height)
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(10, yPos - labelHeight, 190, labelHeight + 2, "F");

    // Add label
    doc.text(label, 15, yPos);

    // Add value below label
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const valueLines = Array.isArray(value)
      ? value
      : doc.splitTextToSize(value, 180);
    doc.text(valueLines, 15, yPos + 7);

    // Calculate total height used by this section
    const valueHeight = valueLines.length * 5;
    const sectionHeight = labelHeight + 2 + valueHeight + 5; // label + padding + value + spacing

    return sectionHeight;
  };

  // Patient Name section
  const patientNameHeight = addSection(
    "Patient Name",
    record.patientName,
    yPosition
  );
  yPosition += patientNameHeight + 4; // More gap between sections

  // Date of Record section
  const formattedDate = new Date(record.dateOfRecord).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
  const dateHeight = addSection("Date of Record", formattedDate, yPosition);
  yPosition += dateHeight + 4; // More gap between sections

  // Diagnosis section
  const diagnosisLines = doc.splitTextToSize(record.diagnosis, 180);
  const diagnosisHeight = addSection("Diagnosis", diagnosisLines, yPosition);
  yPosition += diagnosisHeight + 4; // More gap between sections

  // Treatment Plan section
  const treatmentLines = doc.splitTextToSize(record.treatmentPlan, 180);

  // Check if we need a new page
  const estimatedTreatmentHeight = treatmentLines.length * 5 + 15;
  if (yPosition + estimatedTreatmentHeight > 270) {
    doc.addPage();
    yPosition = 20;
  }

  addSection("Treatment Plan", treatmentLines, yPosition);

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: "center" });
    doc.text(
      `Generated on ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      105,
      290,
      { align: "center" }
    );
  }

  // Generate filename
  const filename = `Medical_Record_${record.patientName.replace(/\s+/g, "_")}_${
    new Date(record.dateOfRecord).toISOString().split("T")[0]
  }.pdf`;

  // Save the PDF
  doc.save(filename);
};

/**
 * Generates a PDF document with all medical records for a patient
 * @param patientName - The name of the patient
 * @param records - Array of medical records for the patient (sorted by date, latest first)
 */
export const generateAllPatientRecordsPDF = async (
  patientName: string,
  records: MedicalRecordForPDF[]
): Promise<void> => {
  const doc = new jsPDF();

  // Set up colors
  const textColor = [51, 51, 51]; // Dark gray
  const lightGray = [245, 245, 245];
  const borderGray = [220, 220, 220];

  // Header height
  const headerHeight = 25;

  // Try to load and add logo
  try {
    const logoDataUrl = await getImageAsDataUrl(logoImage);
    const logoSize = 20;
    const logoX = 10;
    doc.addImage(logoDataUrl, "PNG", logoX, 2.5, logoSize, logoSize);
  } catch (error) {
    console.warn("Could not load logo for PDF:", error);
  }

  // Add header text
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const textX = 35;
  doc.text("Med Access Medical Record", textX, 12);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Patient medical records", textX, 19);

  // Add a subtle border line below header
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.5);
  doc.line(10, headerHeight + 5, 200, headerHeight + 5);

  // Start content section
  let yPosition = headerHeight + 20;

  // Add Patient Name section with better styling
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 100, 100); // Darker gray for label
  doc.text("Name of the Patient", 10, yPosition);
  yPosition += 6;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(textColor[0], textColor[1], textColor[2]); // Reset to dark text
  doc.text(patientName, 10, yPosition);
  yPosition += 8;

  // Add summary info (total records)
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(128, 128, 128);
  doc.text(`Total Records: ${records.length}`, 10, yPosition);
  yPosition += 10;

  // Add separator line (thicker and more prominent)
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.8);
  doc.line(10, yPosition, 200, yPosition);
  yPosition += 12;

  // Helper function to add a record section
  const addRecordSection = (
    label: string,
    value: string | string[],
    yPos: number
  ) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const labelHeight = 4.5;

    // Draw grey background for label with subtle border
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(10, yPos - labelHeight, 190, labelHeight + 2, "F");

    // Add subtle left border accent
    doc.setFillColor(100, 150, 255); // Light blue accent
    doc.rect(10, yPos - labelHeight, 2, labelHeight + 2, "F");

    // Add label
    doc.setTextColor(80, 80, 80); // Darker gray for labels
    doc.text(label, 15, yPos);

    // Add value below label
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(textColor[0], textColor[1], textColor[2]); // Reset to dark text
    const valueLines = Array.isArray(value)
      ? value
      : doc.splitTextToSize(value, 180);
    doc.text(valueLines, 15, yPos + 7);

    // Calculate total height used by this section
    const valueHeight = valueLines.length * 5;
    const sectionHeight = labelHeight + 2 + valueHeight + 5;

    return sectionHeight;
  };

  // Add all medical records (already sorted by date, latest first)
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const recordNumber = i + 1;

    // Check if we need a new page before adding the record
    const estimatedRecordHeight = 70; // Rough estimate for a record
    if (yPosition + estimatedRecordHeight > 270) {
      doc.addPage();
      yPosition = 20;
    }

    // Add record number header with white background only
    doc.setFillColor(255, 255, 255); // White background
    doc.rect(10, yPosition - 5, 190, 8, "F");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60); // Darker text for headers
    doc.text(`Record #${recordNumber}`, 15, yPosition);

    // Add record date in smaller text on the right
    const recordDate = new Date(record.dateOfRecord).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    const dateWidth = doc.getTextWidth(recordDate);
    doc.text(recordDate, 200 - dateWidth - 5, yPosition);

    yPosition += 10;

    // Date of Record section
    const formattedDate = new Date(record.dateOfRecord).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
    const dateHeight = addRecordSection(
      "Date of Record",
      formattedDate,
      yPosition
    );
    yPosition += dateHeight + 2; // Reduced gap between Date of Record and Diagnosis

    // Check for page break before diagnosis
    if (yPosition > 260) {
      doc.addPage();
      yPosition = 20;
    }

    // Diagnosis section
    const diagnosisLines = doc.splitTextToSize(record.diagnosis, 180);
    const diagnosisHeight = addRecordSection(
      "Diagnosis",
      diagnosisLines,
      yPosition
    );
    yPosition += diagnosisHeight + 4;

    // Check for page break before treatment plan
    if (yPosition > 260) {
      doc.addPage();
      yPosition = 20;
    }

    // Treatment Plan section
    const treatmentLines = doc.splitTextToSize(record.treatmentPlan, 180);
    const estimatedTreatmentHeight = treatmentLines.length * 5 + 15;
    if (yPosition + estimatedTreatmentHeight > 270) {
      doc.addPage();
      yPosition = 20;
    }

    const treatmentHeight = addRecordSection(
      "Treatment Plan",
      treatmentLines,
      yPosition
    );
    yPosition += treatmentHeight + 6;

    // Add separator line between records (except for the last one)
    if (i < records.length - 1) {
      yPosition += 4;
      // Add a subtle dashed line for better visual separation
      doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      doc.setLineWidth(0.5);
      // Draw dashed line manually
      const dashLength = 3;
      const gapLength = 2;
      let xPos = 10;
      while (xPos < 200) {
        doc.line(xPos, yPosition, Math.min(xPos + dashLength, 200), yPosition);
        xPos += dashLength + gapLength;
      }
      yPosition += 8;
    }
  }

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: "center" });
    doc.text(
      `Generated on ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      105,
      290,
      { align: "center" }
    );
  }

  // Generate filename
  const filename = `All_Medical_Records_${patientName.replace(
    /\s+/g,
    "_"
  )}.pdf`;

  // Save the PDF
  doc.save(filename);
};
