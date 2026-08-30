import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FullAnalysisReport } from '@freightiq/shared-types';

export async function exportReportToPdf(elementId: string, report: FullAnalysisReport): Promise<void> {
  const container = document.getElementById(elementId);
  if (!container) {
    window.print();
    return;
  }

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pdfWidth - margin * 2;
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    let heightLeft = contentHeight;
    let position = margin;

    // Add first page
    pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight);
    heightLeft -= (pdfHeight - margin * 2);

    // Multi-page handling
    while (heightLeft > 0) {
      position = heightLeft - contentHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight);
      heightLeft -= (pdfHeight - margin * 2);
    }

    const filename = `FreightIQ_Decision_Memo_${report.procurementRequestId || 'Report'}.pdf`;
    pdf.save(filename);
  } catch (err) {
    console.error('PDF generation error, falling back to window.print():', err);
    window.print();
  }
}
