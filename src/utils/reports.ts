import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportToExcel(data: any[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportToPDF(title: string, headers: string[][], data: any[][], filename: string) {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text(title, 14, 22);
  doc.setFontSize(10);
  doc.setTextColor(100);
  const dateStr = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' });
  doc.text(`Generado el: ${dateStr}`, 14, 30);

  autoTable(doc, {
    startY: 36,
    head: headers,
    body: data,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [15, 118, 110],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  doc.save(`${filename}.pdf`);
}
