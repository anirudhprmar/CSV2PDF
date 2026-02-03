import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

self.onmessage = (e: MessageEvent) => {
  const { headers, rows, fileName } = e.data;

  try {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(fileName || "Export", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

    // Add Table
    autoTable(doc, {
        startY: 30,
        head: [headers],
        body: rows,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] },
    });

    // Generate ArrayBuffer
    const pdfOutput = doc.output("arraybuffer");

    // Send back to main thread
    self.postMessage({ status: "success", data: pdfOutput });

  } catch (error) {
    self.postMessage({ status: "error", message: (error as Error).message });
  }
};
