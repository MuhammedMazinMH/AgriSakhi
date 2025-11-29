import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { DetectionResult } from '@/lib/ai/detection';

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
  yellow: [254, 252, 232] as [number, number, number],
  orange: [245, 158, 11] as [number, number, number],
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

// Clean fern watermark
function addFernWatermark(pdf: jsPDF, pageWidth: number, pageHeight: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 0.04 }));
  pdf.setDrawColor(...COLORS.primary);
  pdf.setLineWidth(0.6);
  
  const fernX = pageWidth - 28;
  const fernY = pageHeight / 2;
  
  // Main stem
  pdf.line(fernX, fernY - 45, fernX, fernY + 45);
  
  // Leaflets
  for (let i = 0; i < 18; i++) {
    const y = fernY - 42 + i * 5;
    const length = 14 - Math.abs(i - 9) * 1.3;
    pdf.line(fernX, y, fernX - length, y - length * 0.2);
    pdf.line(fernX, y, fernX + length, y - length * 0.2);
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 1 }));
}

export async function generatePDFReport(result: DetectionResult, _imageUrl?: string): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  let yPos = 0;

  // Add watermark
  addFernWatermark(pdf, pageWidth, pageHeight);

  // ============ HEADER ============
  for (let i = 0; i < 32; i++) {
    const opacity = 1 - (i / 32) * 0.15;
    pdf.setFillColor(
      Math.max(0, COLORS.primary[0] - i * 0.2),
      Math.max(0, COLORS.primary[1] - i * 0.2),
      Math.max(0, COLORS.primary[2] - i * 0.2)
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity }));
    pdf.rect(0, i, pageWidth, 1, 'F');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 1 }));

  // Top line
  pdf.setFillColor(...COLORS.accent);
  pdf.rect(0, 0, pageWidth, 1.5, 'F');

  // Logo
  pdf.setFillColor(...COLORS.white);
  pdf.circle(22, 16, 8, 'F');
  pdf.setFillColor(...COLORS.primary);
  pdf.setFontSize(16);
  pdf.text('🌱', 18.5, 18.5);

  // Brand text
  pdf.setTextColor(...COLORS.white);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.text('AgriSakhi', 35, 15);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Plant Disease Detection Report', 35, 21);

  // Metadata
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  const reportId = `RPT-${Date.now().toString(36).toUpperCase()}`;
  pdf.text('REPORT ID', pageWidth - 55, 10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(reportId, pageWidth - 55, 14);
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('GENERATED', pageWidth - 55, 18);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6.5);
  const dateStr = formatDate(new Date());
  pdf.text(dateStr, pageWidth - 55, 22);

  yPos = 40;

  // ============ DETECTION CARD ============
  pdf.setFillColor(...COLORS.surface);
  pdf.roundedRect(13, yPos, pageWidth - 26, 30, 3, 3, 'F');
  
  pdf.setDrawColor(...COLORS.primary);
  pdf.setLineWidth(0.7);
  pdf.roundedRect(13, yPos, pageWidth - 26, 30, 3, 3, 'S');

  yPos += 7;

  pdf.setTextColor(...COLORS.textLight);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.text('DETECTED DISEASE', 17, yPos);

  yPos += 7;

  pdf.setTextColor(...COLORS.text);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(17);
  const diseaseName = result.disease.replace(/_/g, ' ');
  pdf.text(diseaseName, 17, yPos);

  yPos += 9;

  const confidence = Math.round(result.confidence * 100);
  
  // Badges
  pdf.setFillColor(...COLORS.primary);
  pdf.roundedRect(17, yPos - 4.5, 38, 8, 4, 4, 'F');
  pdf.setTextColor(...COLORS.white);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text(`${confidence}% Confidence`, 19, yPos);

  const severityColor = getSeverityColor(result.severity);
  pdf.setFillColor(...severityColor);
  pdf.roundedRect(58, yPos - 4.5, 30, 8, 4, 4, 'F');
  pdf.text(`Severity ${result.severity}/10`, 60, yPos);

  yPos += 12;

  // ============ METRICS TABLE ============
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(...COLORS.text);
  pdf.text('Analysis Metrics', 13, yPos);
  
  pdf.setDrawColor(...COLORS.accent);
  pdf.setLineWidth(1.8);
  pdf.line(13, yPos + 1.5, 65, yPos + 1.5);
  
  yPos += 3;

  const metricsData = [
    ['Metric', 'Value', 'Status'],
    ['Confidence', `${confidence}%`, confidence >= 80 ? 'High' : 'Moderate'],
    ['Severity', `${result.severity}/10`, result.severity >= 7 ? 'Critical' : 'Manageable'],
    ['Affected Area', `${Math.round(result.affectedArea)}%`, result.affectedArea >= 50 ? 'Large' : 'Moderate'],
    ['Image Quality', `${result.metadata.imageQuality}%`, 'Good'],
    ['Time', `${result.metadata.inferenceTime}ms`, 'Fast'],
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
      cellPadding: 2.5,
    },
    bodyStyles: {
      textColor: COLORS.text,
      fontSize: 8.5,
      cellPadding: 2.5,
    },
    alternateRowStyles: {
      fillColor: COLORS.surface,
    },
    columnStyles: {
      0: { cellWidth: 52 },
      1: { cellWidth: 42, halign: 'center', fontStyle: 'bold' },
      2: { cellWidth: 42, halign: 'center', textColor: COLORS.primary, fontStyle: 'bold' },
    },
    margin: { left: 13, right: 13 },
    styles: {
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
  });

  yPos = (pdf as any).lastAutoTable.finalY + 10;

  // ============ RECOMMENDATIONS ============
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(...COLORS.text);
  pdf.text('Recommended Actions', 13, yPos);
  
  pdf.setDrawColor(...COLORS.accent);
  pdf.setLineWidth(1.8);
  pdf.line(13, yPos + 1.5, 78, yPos + 1.5);
  
  yPos += 7;

  const recommendations = result.recommendations || [];
  const displayRecs = recommendations.slice(0, 4);

  displayRecs.forEach((rec) => {
    pdf.setFillColor(...COLORS.primary);
    pdf.circle(16, yPos - 1.5, 1.5, 'F');

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(...COLORS.text);
    
    // Proper text wrapping - use page width minus margins
    const maxWidth = pageWidth - 35;
    const lines = pdf.splitTextToSize(rec, maxWidth);
    const displayLines = lines.slice(0, 2); // Max 2 lines
    pdf.text(displayLines, 20, yPos);
    
    yPos += displayLines.length * 4 + 1.5;
  });

  // ============ PREVENTION BOX ============
  yPos += 3;

  pdf.setFillColor(...COLORS.yellow);
  pdf.roundedRect(13, yPos, pageWidth - 26, 35, 3, 3, 'F');
  
  pdf.setDrawColor(...COLORS.orange);
  pdf.setLineWidth(1);
  pdf.roundedRect(13, yPos, pageWidth - 26, 35, 3, 3, 'S');

  yPos += 7;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(180, 83, 9);
  pdf.text('Prevention & Best Practices', 17, yPos);

  yPos += 7;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(120, 53, 15);
  
  const tips = [
    'Regular monitoring: Check plants daily for early symptoms',
    'Proper spacing: Ensure adequate air circulation between plants',
    'Hygiene: Remove and dispose of infected plant material properly',
    'Rotation: Practice crop rotation to prevent disease buildup',
  ];

  tips.forEach(tip => {
    const tipLines = pdf.splitTextToSize(tip, pageWidth - 35);
    pdf.text(tipLines, 17, yPos);
    yPos += tipLines.length * 4 + 0.5;
  });

  // ============ FOOTER ============
  const footerY = pageHeight - 13;
  
  pdf.setFillColor(249, 250, 251);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 0.92 }));
  pdf.rect(0, footerY - 5, pageWidth, 18, 'F');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 1 }));
  
  pdf.setDrawColor(...COLORS.primary);
  pdf.setLineWidth(0.5);
  pdf.line(13, footerY - 5, pageWidth - 13, footerY - 5);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  pdf.setTextColor(...COLORS.text);
  pdf.text('© 2025 AgriSakhi', 13, footerY);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6.5);
  pdf.setTextColor(...COLORS.textLight);
  pdf.text('AI-Powered Plant Disease Detection • For assistance: agrisakhi.com', 13, footerY + 4);
  
  // Page number circle
  pdf.setFillColor(...COLORS.primary);
  pdf.circle(pageWidth - 16, footerY - 0.5, 4, 'F');
  pdf.setTextColor(...COLORS.white);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.text('1', pageWidth - 17.5, footerY + 1.5);
  
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(6);
  pdf.setTextColor(...COLORS.textLight);
  pdf.text('This report is AI-generated. Consult agriculture experts for critical decisions.', 13, footerY + 8);

  // ============ SAVE ============
  const fileName = `AgriSakhi_Report_${diseaseName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  pdf.save(fileName);
}

// GState polyfill
declare module 'jspdf' {
  interface jsPDF {
    GState(options: { opacity: number }): any;
  }
}


