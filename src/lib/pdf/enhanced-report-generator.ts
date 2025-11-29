import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { DetectionResult } from '@/lib/ai/detection';

// Professional color palette
const COLORS = { primary: [22, 163, 74] as [number, number, number], secondary: [21, 128, 61] as [number, number, number], accent: [74, 222, 128] as [number, number, number], surface: [220, 252, 231] as [number, number, number], text: [31, 41, 55] as [number, number, number], textLight: [107, 114, 128] as [number, number, number], white: [255, 255, 255] as [number, number, number], danger: [220, 38, 38] as [number, number, number], warning: [245, 158, 11] as [number, number, number], success: [22, 163, 74] as [number, number, number] };

// Format date beautifully
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Get severity color based on score
function getSeverityColor(severity: number): [number, number, number] {
  if (severity >= 7) return COLORS.danger;
  if (severity >= 5) return COLORS.warning;
  return COLORS.success;
}

// Add decorative fern leaf watermark
function addLeafWatermark(pdf: jsPDF, pageWidth: number, pageHeight: number) {
  // Large fern in bottom right corner
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 0.03 }));
  pdf.setFillColor(...COLORS.primary);
  
  // Draw stylized fern leaves
  const fernCenterX = pageWidth - 40;
  const fernCenterY = pageHeight - 60;
  
  // Main stem
  pdf.setLineWidth(0.8);
  pdf.line(fernCenterX, fernCenterY - 50, fernCenterX, fernCenterY + 30);
  
  // Left leaflets
  for (let i = 0; i < 12; i++) {
    const y = fernCenterY - 45 + i * 6;
    const length = 15 - Math.abs(i - 6) * 1.5;
    pdf.line(fernCenterX, y, fernCenterX - length, y - length * 0.3);
    
    // Sub-leaflets
    for (let j = 0; j < 3; j++) {
      const subX = fernCenterX - (length / 3) * j;
      const subY = y - (length * 0.3 / 3) * j;
      pdf.line(subX, subY, subX - 3, subY - 2);
      pdf.line(subX, subY, subX - 3, subY + 2);
    }
  }
  
  // Right leaflets
  for (let i = 0; i < 12; i++) {
    const y = fernCenterY - 45 + i * 6;
    const length = 15 - Math.abs(i - 6) * 1.5;
    pdf.line(fernCenterX, y, fernCenterX + length, y - length * 0.3);
    
    // Sub-leaflets
    for (let j = 0; j < 3; j++) {
      const subX = fernCenterX + (length / 3) * j;
      const subY = y - (length * 0.3 / 3) * j;
      pdf.line(subX, subY, subX + 3, subY - 2);
      pdf.line(subX, subY, subX + 3, subY + 2);
    }
  }
  
  // Top right corner small leaf
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 0.02 }));
  const smallFernX = pageWidth - 25;
  const smallFernY = 25;
  pdf.line(smallFernX, smallFernY, smallFernX, smallFernY + 20);
  for (let i = 0; i < 6; i++) {
    const y = smallFernY + i * 3;
    pdf.line(smallFernX, y, smallFernX - 8, y - 2);
    pdf.line(smallFernX, y, smallFernX + 8, y - 2);
  }
  
  // Reset opacity
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 1 }));
}

// Generate enhanced PDF report
export async function generatePDFReport(result: DetectionResult, _imageUrl?: string): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  let yPos = 0;

  // ============ ADD LEAF WATERMARK TO ALL PAGES ============
  addLeafWatermark(pdf, pageWidth, pageHeight);

  // ============ STUNNING HEADER WITH GRADIENT ============
  // Create gradient effect with multiple rectangles
  for (let i = 0; i < 60; i++) {
    const opacity = 1 - (i / 60) * 0.3;
    const colorShift = Math.floor(i * 0.5);
    pdf.setFillColor(
      Math.max(0, COLORS.primary[0] - colorShift),
      Math.max(0, COLORS.primary[1] - colorShift),
      Math.max(0, COLORS.primary[2] - colorShift)
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity }));
    pdf.rect(0, i, pageWidth, 1, 'F');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 1 }));
  
  // Decorative top border
  pdf.setFillColor(...COLORS.accent);
  pdf.rect(0, 0, pageWidth, 2, 'F');

  // Logo circle with shadow effect
  pdf.setFillColor(240, 240, 240);
  pdf.circle(28, 28, 10, 'F');
  pdf.setFillColor(...COLORS.white);
  pdf.circle(27, 27, 9, 'F');
  
  // Leaf icon in logo
  pdf.setFillColor(...COLORS.primary);
  pdf.setFontSize(18);
  pdf.text('🌱', 23, 31);

  // Brand name with modern typography
  pdf.setTextColor(...COLORS.white);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(28);
  pdf.text('AgriSakhi', 42, 27);
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Plant Disease Detection Report', 42, 35);

  // Decorative line under title
  pdf.setDrawColor(...COLORS.accent);
  pdf.setLineWidth(0.5);
  pdf.line(42, 38, 110, 38);

  // Report metadata with modern styling
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  const reportId = `RPT-${Date.now().toString(36).toUpperCase()}`;
  pdf.text('REPORT ID', pageWidth - 60, 22);
  pdf.setFont('helvetica', 'normal');
  pdf.text(reportId, pageWidth - 60, 27);
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('GENERATED', pageWidth - 60, 33);
  pdf.setFont('helvetica', 'normal');
  const dateLines = pdf.splitTextToSize(formatDate(new Date()), 50);
  pdf.text(dateLines, pageWidth - 60, 38);

  yPos = 70;

  // ============ DETECTION RESULT CARD WITH SHADOW ============
  // Shadow effect
  pdf.setFillColor(200, 200, 200);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 0.15 }));
  pdf.roundedRect(16, yPos + 1, pageWidth - 32, 42, 4, 4, 'F');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 1 }));
  
  // Card background with gradient
  pdf.setFillColor(...COLORS.surface);
  pdf.roundedRect(15, yPos, pageWidth - 30, 42, 4, 4, 'F');
  
  // Accent border
  pdf.setDrawColor(...COLORS.primary);
  pdf.setLineWidth(0.8);
  pdf.roundedRect(15, yPos, pageWidth - 30, 42, 4, 4, 'S');
  
  // Decorative corner accent
  pdf.setFillColor(...COLORS.accent);
  pdf.triangle(15, yPos, 25, yPos, 15, yPos + 10, 'F');

  yPos += 8;

  // Label with icon
  pdf.setTextColor(...COLORS.textLight);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('🔬 DETECTED DISEASE', 20, yPos);

  yPos += 8;

  // Disease name with stunning typography
  pdf.setTextColor(...COLORS.text);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  const diseaseName = result.disease.replace(/_/g, ' ');
  const diseaseLines = pdf.splitTextToSize(diseaseName, pageWidth - 50);
  pdf.text(diseaseLines, 20, yPos);

  yPos += diseaseLines.length * 8 + 5;

  // Badges with modern pill design
  const confidence = Math.round(result.confidence * 100);
  
  // Confidence badge with glow effect
  pdf.setFillColor(220, 220, 220);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 0.3 }));
  pdf.roundedRect(20, yPos - 6, 42, 10, 5, 5, 'F');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 1 }));
  
  pdf.setFillColor(...COLORS.primary);
  pdf.roundedRect(20, yPos - 5, 40, 9, 4.5, 4.5, 'F');
  pdf.setTextColor(...COLORS.white);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text(`${confidence}% Confidence`, 22, yPos);

  // Severity badge
  const severityColor = getSeverityColor(result.severity);
  pdf.setFillColor(220, 220, 220);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 0.3 }));
  pdf.roundedRect(66, yPos - 6, 35, 10, 5, 5, 'F');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 1 }));
  
  pdf.setFillColor(...severityColor);
  pdf.roundedRect(66, yPos - 5, 33, 9, 4.5, 4.5, 'F');
  pdf.setTextColor(...COLORS.white);
  pdf.text(`Severity ${result.severity}/10`, 68, yPos);

  yPos += 18;

  // ============ METRICS TABLE WITH MODERN DESIGN ============
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(...COLORS.text);
  pdf.text('📊 Analysis Metrics', 15, yPos);
  
  // Decorative underline
  pdf.setDrawColor(...COLORS.accent);
  pdf.setLineWidth(2);
  pdf.line(15, yPos + 2, 75, yPos + 2);
  
  yPos += 3;

  const metricsData = [
    ['Metric', 'Value', 'Status'],
    ['Confidence Level', `${confidence}%`, confidence >= 80 ? '✓ High' : '○ Moderate'],
    ['Disease Severity', `${result.severity}/10`, result.severity >= 7 ? '⚠ Critical' : '✓ Manageable'],
    ['Affected Area', `${result.affectedArea}%`, result.affectedArea >= 50 ? '⚠ Large' : '✓ Moderate'],
    ['Image Quality', `${result.metadata.imageQuality}%`, result.metadata.imageQuality >= 70 ? '✓ Good' : '○ Fair'],
    ['Inference Time', `${result.metadata.inferenceTime}ms`, '✓ Fast'],
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
      fontSize: 11,
      cellPadding: 4,
    },
    bodyStyles: {
      textColor: COLORS.text,
      fontSize: 10,
      cellPadding: 3.5,
    },
    alternateRowStyles: {
      fillColor: COLORS.surface,
    },
    columnStyles: {
      0: { cellWidth: 60, fontStyle: 'bold' },
      1: { cellWidth: 60, halign: 'center', fontStyle: 'bold' },
      2: { cellWidth: 60, halign: 'center', textColor: COLORS.primary },
    },
    margin: { left: 15, right: 15 },
    styles: {
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
  });

  yPos = (pdf as any).lastAutoTable.finalY + 15;

  // ============ RECOMMENDATIONS WITH ICONS ============
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(...COLORS.text);
  pdf.text('💡 Recommended Actions', 15, yPos);
  
  pdf.setDrawColor(...COLORS.accent);
  pdf.setLineWidth(2);
  pdf.line(15, yPos + 2, 90, yPos + 2);
  
  yPos += 10;

  const recommendations = result.recommendations || [
    `Disease identified: ${diseaseName}`,
    `Confidence level: ${confidence}% - ${confidence >= 80 ? 'High confidence detection' : 'Consider expert consultation'}`,
  ];

  recommendations.forEach((rec) => {
    if (yPos > pageHeight - 40) {
      pdf.addPage();
      addLeafWatermark(pdf, pageWidth, pageHeight);
      yPos = 20;
    }

    // Gradient bullet point
    pdf.setFillColor(...COLORS.primary);
    pdf.circle(18, yPos - 1.5, 2, 'F');
    pdf.setFillColor(...COLORS.accent);
    pdf.circle(18, yPos - 1.5, 1, 'F');

    // Recommendation text with better formatting
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(...COLORS.text);
    
    const lines = pdf.splitTextToSize(rec, pageWidth - 45);
    pdf.text(lines, 24, yPos);
    
    yPos += lines.length * 5 + 4;
  });

  // ============ PREVENTION TIPS BOX ============
  if (yPos > pageHeight - 60) {
    pdf.addPage();
    addLeafWatermark(pdf, pageWidth, pageHeight);
    yPos = 20;
  }

  yPos += 8;

  // Shadow for prevention box
  pdf.setFillColor(200, 200, 200);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 0.15 }));
  pdf.roundedRect(16, yPos + 1, pageWidth - 32, 48, 4, 4, 'F');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 1 }));

  // Prevention box with gradient
  pdf.setFillColor(254, 252, 232);
  pdf.roundedRect(15, yPos, pageWidth - 30, 48, 4, 4, 'F');
  
  pdf.setDrawColor(245, 158, 11);
  pdf.setLineWidth(1);
  pdf.roundedRect(15, yPos, pageWidth - 30, 48, 4, 4, 'S');
  
  // Decorative corner
  pdf.setFillColor(245, 158, 11);
  pdf.triangle(pageWidth - 30, yPos, pageWidth - 20, yPos, pageWidth - 30, yPos + 10, 'F');

  yPos += 10;

  // Title with icon
  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(180, 83, 9);
  pdf.text('🌿 Prevention & Best Practices', 20, yPos);

  yPos += 8;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(120, 53, 15);
  
  const tips = [
    '✓ Regular monitoring: Check plants daily for early symptoms',
    '✓ Proper spacing: Ensure adequate air circulation',
    '✓ Hygiene: Remove infected material properly',
    '✓ Rotation: Practice crop rotation annually',
  ];

  tips.forEach(tip => {
    const tipLines = pdf.splitTextToSize(tip, pageWidth - 45);
    pdf.text(tipLines, 20, yPos);
    yPos += tipLines.length * 4.5;
  });

  // ============ PROFESSIONAL FOOTER ============
  const addFooter = (pageNum: number) => {
    const footerY = pageHeight - 18;
    
    // Footer background with gradient
    pdf.setFillColor(249, 250, 251);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 0.8 }));
    pdf.rect(0, footerY - 8, pageWidth, 23, 'F');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any`n  pdf.setGState(new (pdf as any).GState({ opacity: 1 }));
    
    // Top border
    pdf.setDrawColor(...COLORS.primary);
    pdf.setLineWidth(0.5);
    pdf.line(15, footerY - 8, pageWidth - 15, footerY - 8);

    // Footer content
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(...COLORS.text);
    pdf.text('© 2025 AgriSakhi', 15, footerY);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(...COLORS.textLight);
    pdf.text('AI-Powered Plant Disease Detection • For assistance: agrisakhi.com', 15, footerY + 4);
    
    // Page number with circle
    pdf.setFillColor(...COLORS.primary);
    pdf.circle(pageWidth - 20, footerY - 1, 4, 'F');
    pdf.setTextColor(...COLORS.white);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text(pageNum.toString(), pageWidth - 21.5, footerY + 1);
    
    // Disclaimer
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(6);
    pdf.setTextColor(...COLORS.textLight);
    pdf.text('This report is AI-generated. Consult agricultural experts for critical decisions.', 15, footerY + 8);
  };

  // Add footer to all pages
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    addFooter(i);
  }

  // ============ SAVE PDF ============
  const fileName = `AgriSakhi_Report_${diseaseName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  pdf.save(fileName);
}

// Helper for triangle
declare module 'jspdf' {
  interface jsPDF {
    triangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, style: string): jsPDF;
  }
}

// Polyfill for triangle method
(jsPDF as any).API.triangle = function(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, style: string) {
  this.lines([[x2 - x1, y2 - y1], [x3 - x2, y3 - y2], [x1 - x3, y1 - y3]], x1, y1);
  if (style === 'F') {
    this.fill();
  } else if (style === 'S') {
    this.stroke();
  } else {
    this.fillStroke();
  }
  return this;
};


