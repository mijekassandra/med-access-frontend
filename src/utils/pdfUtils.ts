import jsPDF from 'jspdf';
import logoImage from '../assets/medaccess.png';

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
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject(new Error('Could not get canvas context'));
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
export const generateMedicalRecordPDF = async (record: MedicalRecordForPDF): Promise<void> => {
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
    doc.addImage(logoDataUrl, 'PNG', logoX, 2.5, logoSize, logoSize);
  } catch (error) {
    console.warn('Could not load logo for PDF:', error);
    // Continue without logo if it fails to load
  }
  
  // Add header text (plain background, no fill) - positioned closer to logo
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const textX = 35; // Moved closer to logo (was 50)
  doc.text('Med Access Medical Record', textX, 12);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Patient medical record', textX, 19);
  
  // Add a subtle border line below header
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.5);
  doc.line(10, headerHeight + 5, 200, headerHeight + 5);
  
  // Add content section with more spacing
  let yPosition = headerHeight + 20;
  
  // Helper function to add a section
  const addSection = (label: string, value: string | string[], yPos: number) => {
    // Calculate label height
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const labelHeight = 4.5; // Height for the label text
    
    // Draw grey background for label only (matching label height)
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(10, yPos - labelHeight, 190, labelHeight + 2, 'F');
    
    // Add label
    doc.text(label, 15, yPos);
    
    // Add value below label
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const valueLines = Array.isArray(value) ? value : doc.splitTextToSize(value, 180);
    doc.text(valueLines, 15, yPos + 7);
    
    // Calculate total height used by this section
    const valueHeight = valueLines.length * 5;
    const sectionHeight = labelHeight + 2 + valueHeight + 5; // label + padding + value + spacing
    
    return sectionHeight;
  };
  
  // Patient Name section
  const patientNameHeight = addSection('Patient Name', record.patientName, yPosition);
  yPosition += patientNameHeight + 4; // More gap between sections
  
  // Date of Record section
  const formattedDate = new Date(record.dateOfRecord).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const dateHeight = addSection('Date of Record', formattedDate, yPosition);
  yPosition += dateHeight + 4; // More gap between sections
  
  // Diagnosis section
  const diagnosisLines = doc.splitTextToSize(record.diagnosis, 180);
  const diagnosisHeight = addSection('Diagnosis', diagnosisLines, yPosition);
  yPosition += diagnosisHeight + 4; // More gap between sections
  
  // Treatment Plan section
  const treatmentLines = doc.splitTextToSize(record.treatmentPlan, 180);
  
  // Check if we need a new page
  const estimatedTreatmentHeight = treatmentLines.length * 5 + 15;
  if (yPosition + estimatedTreatmentHeight > 270) {
    doc.addPage();
    yPosition = 20;
  }
  
  addSection('Treatment Plan', treatmentLines, yPosition);
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount}`,
      105,
      285,
      { align: 'center' }
    );
    doc.text(
      `Generated on ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`,
      105,
      290,
      { align: 'center' }
    );
  }
  
  // Generate filename
  const filename = `Medical_Record_${record.patientName.replace(/\s+/g, '_')}_${new Date(record.dateOfRecord).toISOString().split('T')[0]}.pdf`;
  
  // Save the PDF
  doc.save(filename);
};

