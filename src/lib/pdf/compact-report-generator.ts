import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { DetectionResult } from '@/lib/ai/detection';

// Professional color palette
const COLORS = {
  primary: [22, 163, 74] as [number, number, number],
  secondary: [21, 128, 61] as [number, number, number],
  accent: [74, 222, 128] as [number, number, number],
  surface: [220, 252, 231] as [number, number, number],
  text: [31, 41, 55] as [number, number, number],
  textLight: [107, 114, 128] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  danger: [220, 38, 38] as [number, number, number],
  warning: [245, 158, 11] as [number, number, number],
  success: [22, 163, 74] as [number, number, number],
};

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getSeverityColor(severity: number): [number, number, number] {
  if (severity >= 7) return COLORS.danger;
  if (severity >= 5) return COLORS.warning;
  return COLORS.success;
}

// Compact fern leaf watermark
function addCompactFernWatermark(pdf: jsPDF, pageWidth: number, pageHeight: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 0.04 }));
  pdf.setDrawColor(...COLORS.primary);
  pdf.setLineWidth(0.5);
  
  // Right side fern
  const fernX = pageWidth - 30;
  const fernY = pageHeight / 2;
  
  pdf.line(fernX, fernY - 40, fernX, fernY + 40);
  
  for (let i = 0; i < 16; i++) {
    const y = fernY - 38 + i * 5;
    const length = 12 - Math.abs(i - 8) * 1.2;
    pdf.line(fernX, y, fernX - length, y - length * 0.25);
    pdf.line(fernX, y, fernX + length, y - length * 0.25);
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 1 }));
}

export async function generatePDFReport(result: DetectionResult, _imageUrl?: string): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  let yPos = 0;

  // Add subtle watermark
  addCompactFernWatermark(pdf, pageWidth, pageHeight);

  // ============ COMPACT HEADER ============
  // Gradient header (30mm height)
  for (let i = 0; i < 30; i++) {
    const opacity = 1 - (i / 30) * 0.2;
    pdf.setFillColor(
      Math.max(0, COLORS.primary[0] - i * 0.3),
      Math.max(0, COLORS.primary[1] - i * 0.3),
      Math.max(0, COLORS.primary[2] - i * 0.3)
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity }));
    pdf.rect(0, i, pageWidth, 1, 'F');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 1 }));

  // Top accent line
  pdf.setFillColor(...COLORS.accent);
  pdf.rect(0, 0, pageWidth, 1.5, 'F');

  // Logo
  pdf.setFillColor(...COLORS.white);
  pdf.circle(20, 15, 7, 'F');
  pdf.setFillColor(...COLORS.primary);
  pdf.setFontSize(14);
  pdf.text('🌱', 17, 17.5);

  // Brand
  pdf.setTextColor(...COLORS.white);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.text('AgriSakhi', 32, 14);
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Plant Disease Detection Report', 32, 20);

  // Report metadata - compact
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  const reportId = `RPT-${Date.now().toString(36).toUpperCase()}`;
  pdf.text('REPORT ID', pageWidth - 50, 11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(reportId, pageWidth - 50, 15);
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('GENERATED', pageWidth - 50, 19);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6);
  pdf.text(formatDate(new Date()), pageWidth - 50, 23);

  yPos = 38;

  // ============ DETECTION CARD - COMPACT ============
  pdf.setFillColor(...COLORS.surface);
  pdf.roundedRect(12, yPos, pageWidth - 24, 28, 3, 3, 'F');
  
  pdf.setDrawColor(...COLORS.primary);
  pdf.setLineWidth(0.6);
  pdf.roundedRect(12, yPos, pageWidth - 24, 28, 3, 3, 'S');

  yPos += 6;

  pdf.setTextColor(...COLORS.textLight);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.text('🔬 DETECTED DISEASE', 16, yPos);

  yPos += 6;

  pdf.setTextColor(...COLORS.text);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  const diseaseName = result.disease.replace(/_/g, ' ');
  pdf.text(diseaseName, 16, yPos);

  yPos += 8;

  const confidence = Math.round(result.confidence * 100);
  
  // Compact badges
  pdf.setFillColor(...COLORS.primary);
  pdf.roundedRect(16, yPos - 4, 35, 7, 3.5, 3.5, 'F');
  pdf.setTextColor(...COLORS.white);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text(`${confidence}% Confidence`, 18, yPos);

  const severityColor = getSeverityColor(result.severity);
  pdf.setFillColor(...severityColor);
  pdf.roundedRect(54, yPos - 4, 28, 7, 3.5, 3.5, 'F');
  pdf.text(`Severity ${result.severity}/10`, 56, yPos);

  yPos += 10;

  // ============ COMPACT METRICS TABLE ============
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(...COLORS.text);
  pdf.text('📊 Analysis Metrics', 12, yPos);
  
  pdf.setDrawColor(...COLORS.accent);
  pdf.setLineWidth(1.5);
  pdf.line(12, yPos + 1, 60, yPos + 1);
  
  yPos += 2;

  const metricsData = [
    ['Metric', 'Value', 'Status'],
    ['Confidence', `${confidence}%`, confidence >= 80 ? '✓ High' : '○ Moderate'],
    ['Severity', `${result.severity}/10`, result.severity >= 7 ? '⚠ Critical' : '✓ Manageable'],
    ['Affected Area', `${Math.round(result.affectedArea)}%`, result.affectedArea >= 50 ? '⚠ Large' : '✓ Moderate'],
    ['Image Quality', `${result.metadata.imageQuality}%`, '✓ Good'],
    ['Time', `${result.metadata.inferenceTime}ms`, '✓ Fast'],
  ];

  autoTable(pdf, {
    startY: yPos,
    head: [metricsData[0]],
    body: metricsData.slice(1),
    theme: 'grid',
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 9,
      cellPadding: 2,
    },
    bodyStyles: {
      textColor: COLORS.text,
      fontSize: 8,
      cellPadding: 2,
    },
    alternateRowStyles: {
      fillColor: COLORS.surface,
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 45, halign: 'center', fontStyle: 'bold' },
      2: { cellWidth: 45, halign: 'center', textColor: COLORS.primary },
    },
    margin: { left: 12, right: 12 },
    styles: {
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
  });

  yPos = (pdf as any).lastAutoTable.finalY + 8;

  // ============ COMPACT RECOMMENDATIONS ============
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(...COLORS.text);
  pdf.text('💡 Recommended Actions', 12, yPos);
  
  pdf.setDrawColor(...COLORS.accent);
  pdf.setLineWidth(1.5);
  pdf.line(12, yPos + 1, 72, yPos + 1);
  
  yPos += 6;

  const recommendations = result.recommendations || [];
  const displayRecs = recommendations.slice(0, 4); // Only show 4 main recommendations

  displayRecs.forEach((rec) => {
    pdf.setFillColor(...COLORS.primary);
    pdf.circle(15, yPos - 1.5, 1.5, 'F');

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(...COLORS.text);
    
    const lines = pdf.splitTextToSize(rec, pageWidth - 32);
    const maxLines = lines.slice(0, 2); // Max 2 lines per recommendation
    pdf.text(maxLines, 19, yPos);
    
    yPos += maxLines.length * 3.5 + 2;
  });

  // ============ COMPACT PREVENTION BOX ============
  yPos += 2;

  pdf.setFillColor(254, 252, 232);
  pdf.roundedRect(12, yPos, pageWidth - 24, 32, 3, 3, 'F');
  
  pdf.setDrawColor(245, 158, 11);
  pdf.setLineWidth(0.8);
  pdf.roundedRect(12, yPos, pageWidth - 24, 32, 3, 3, 'S');

  yPos += 6;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(180, 83, 9);
  pdf.text('🌿 Prevention & Best Practices', 16, yPos);

  yPos += 6;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(120, 53, 15);
  
  const tips = [
    '✓ Regular monitoring: Check plants daily',
    '✓ Proper spacing: Ensure air circulation',
    '✓ Hygiene: Remove infected material',
    '✓ Rotation: Practice crop rotation',
  ];

  tips.forEach(tip => {
    pdf.text(tip, 16, yPos);
    yPos += 4;
  });

  // ============ COMPACT FOOTER ============
  const footerY = pageHeight - 12;
  
  pdf.setFillColor(249, 250, 251);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 0.9 }));
  pdf.rect(0, footerY - 4, pageWidth, 16, 'F');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 1 }));
  
  pdf.setDrawColor(...COLORS.primary);
  pdf.setLineWidth(0.4);
  pdf.line(12, footerY - 4, pageWidth - 12, footerY - 4);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  pdf.setTextColor(...COLORS.text);
  pdf.text('© 2025 AgriSakhi', 12, footerY);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6);
  pdf.setTextColor(...COLORS.textLight);
  pdf.text('AI-Powered Plant Disease Detection • For assistance: agrisakhi.com', 12, footerY + 3.5);
  
  pdf.setFillColor(...COLORS.primary);
  pdf.circle(pageWidth - 15, footerY - 0.5, 3.5, 'F');
  pdf.setTextColor(...COLORS.white);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  pdf.text('1', pageWidth - 16.2, footerY + 1);
  
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(5.5);
  pdf.setTextColor(...COLORS.textLight);
  pdf.text('This report is AI-generated. Consult agricultural experts for critical decisions.', 12, footerY + 7);

  // ============ SAVE PDF ============
  const fileName = `AgriSakhi_Report_${diseaseName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  pdf.save(fileName);
}

// GState polyfill
declare module 'jspdf' {
  interface jsPDF {
    GState(options: { opacity: number }): any;
  }
}


