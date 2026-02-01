import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PDFOptions {
  fileName?: string;
  orientation?: "portrait" | "landscape";
  pageSize?: "a4" | "letter" | "legal";
}

/**
 * Convert CSV data to PDF and trigger download
 * @param headers - Array of column headers
 * @param rows - 2D array of data rows
 * @param options - PDF generation options
 */
export function convertCsvToPdf(
  headers: string[],
  rows: string[][],
  options: PDFOptions = {}
): void {
  const {
    fileName = "csv-export.pdf",
    orientation = "landscape",
    pageSize = "a4",
  } = options;

  // Create new PDF document
  const doc = new jsPDF({
    orientation,
    unit: "mm",
    format: pageSize,
  });

  // Add title
  doc.setFontSize(16);
  doc.text(fileName.replace(".pdf", ""), 14, 15);

  // Add timestamp
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

  // Generate table
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 28,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [59, 130, 246], // Primary blue color
      textColor: 255,
      fontStyle: "bold",
      halign: "left",
    },
    bodyStyles: {
      textColor: 50,
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    margin: { top: 28, right: 14, bottom: 14, left: 14 },
    didDrawPage: (data: { pageNumber: number }) => {
      // Footer with page numbers
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    },
  });

  // Save the PDF
  doc.save(fileName);
}

/**
 * Generate PDF blob without downloading (useful for preview)
 * @param headers - Array of column headers
 * @param rows - 2D array of data rows
 * @param options - PDF generation options
 * @returns Blob containing the PDF data
 */
export function generatePdfBlob(
  headers: string[],
  rows: string[][],
  options: PDFOptions = {}
): Blob {
  const {
    fileName = "csv-export.pdf",
    orientation = "landscape",
    pageSize = "a4",
  } = options;

  const doc = new jsPDF({
    orientation,
    unit: "mm",
    format: pageSize,
  });

  doc.setFontSize(16);
  doc.text(fileName.replace(".pdf", ""), 14, 15);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 28,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: "bold",
      halign: "left",
    },
    bodyStyles: {
      textColor: 50,
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    margin: { top: 28, right: 14, bottom: 14, left: 14 },
  });

  return doc.output("blob");
}
