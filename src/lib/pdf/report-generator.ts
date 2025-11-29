import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { DetectionResult } from '@/lib/ai/detection';

// Add colors for professional look
const COLORS = {
  primary: '#16a34a', // Green
  secondary: '#15803d',
  darkGreen: '#0f5132',
  accent: '#4ade80',
  lightGreen: '#dcfce7',
  text: '#1f2937',
  lightText: '#6b7280',
  background: '#f9fafb',
  white: '#ffffff',
  danger: '#dc2626',
  warning: '#f59e0b',
  success: '#16a34a',
};

// Fern leaf background pattern (subtle watermark)
const LEAF_WATERMARK = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJsZWFmLXBhdHRlcm4iIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj4KICAgICAgPGcgb3BhY2l0eT0iMC4wMyI+CiAgICAgICAgPHBhdGggZD0iTTEwMCw1MCBRMTIwLDYwIDEyMCw4MCBRMTIwLDEwMCAxMDUsMTEwIEwxMDAsMTUwIEw5NSwxMTAgUTgwLDEwMCA4MCw4MCBRODAsNjAgMTAwLDUwIFoiIGZpbGw9IiMxNmEzNGEiLz4KICAgICAgICA8cGF0aCBkPSJNMTAwLDcwIEwxMzAsODAgTDEyNSw5MCBMMTAwLDg1IFoiIGZpbGw9IiMxNmEzNGEiLz4KICAgICAgICA8cGF0aCBkPSJNMTAwLDcwIEw3MCw4MCBMNzUsOTAgTDEwMCw4NSBaIiBmaWxsPSIjMTZhMzRhIi8+CiAgICAgICAgPHBhdGggZD0iTTEwMCw5MCBMMTM1LDEwMCBMMTMwLDExMCBMMTAwLDEwNSBaIiBmaWxsPSIjMTZhMzRhIi8+CiAgICAgICAgPHBhdGggZD0iTTEwMCw5MCBMNZV3MTAwIEw3MCwxMTAgTDEwMCwxMDUgWiIgZmlsbD0iIzE2YTM0YSIvPgogICAgICA8L2c+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2xlYWYtcGF0dGVybikiLz4KPC9zdmc+`;

// Format date
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Get severity color
function getSeverityColor(severity: number): string {
  if (severity >= 7) return COLORS.danger;
  if (severity >= 5) return COLORS.warning;
  return COLORS.success;
}

// Generate PDF Report
export async function generatePDFReport(result: DetectionResult, imageUrl?: string): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  let yPos = 20;

  // ============ HEADER WITH BACKGROUND ============
  // Background gradient effect (using rectangles)
  pdf.setFillColor(22, 163, 74); // Primary green
  pdf.rect(0, 0, pageWidth, 50, 'F');
  
  pdf.setFillColor(21, 128, 61); // Secondary green (darker)
  pdf.rect(0, 35, pageWidth, 15, 'F');

  // Logo/Brand area (white circle)
  pdf.setFillColor(255, 255, 255);
  pdf.circle(25, 25, 8, 'F');
  
  // Plant icon representation (green leaf in white circle)
  pdf.setFillColor(22, 163, 74);
  pdf.setFontSize(16);
  pdf.text('🌱', 22, 28);

  // Header Text
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.text('AgriSakhi', 40, 23);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Plant Disease Detection Report', 40, 31);

  // Report ID and Date
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const reportId = `RPT-${Date.now().toString(36).toUpperCase()}`;
  pdf.text(`Report ID: ${reportId}`, pageWidth - 60, 23);
  pdf.text(`Generated: ${formatDate(new Date())}`, pageWidth - 60, 29);

  yPos = 60;

  // ============ DETECTION RESULT BOX ============
  pdf.setFillColor(249, 250, 251); // Light background
  pdf.roundedRect(15, yPos, pageWidth - 30, 35, 3, 3, 'F');
  
  // Border
  pdf.setDrawColor(22, 163, 74);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(15, yPos, pageWidth - 30, 35, 3, 3, 'S');

  yPos += 8;

  // Detected Disease Label
  pdf.setTextColor(107, 114, 128);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text('DETECTED DISEASE', 20, yPos);

  yPos += 7;

  // Disease Name (large and prominent)
  pdf.setTextColor(31, 41, 55);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  const diseaseName = result.disease.replace(/_/g, ' ');
  pdf.text(diseaseName, 20, yPos);

  yPos += 8;

  // Confidence Badge
  const confidence = Math.round(result.confidence * 100);
  pdf.setFillColor(22, 163, 74);
  pdf.roundedRect(20, yPos - 5, 35, 8, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text(`${confidence}% Confidence`, 22, yPos);

  // Severity Badge
  const severityColor = getSeverityColor(result.severity);
  const rgbColor = hexToRgb(severityColor);
  pdf.setFillColor(rgbColor.r, rgbColor.g, rgbColor.b);
  pdf.roundedRect(60, yPos - 5, 30, 8, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.text(`Severity: ${result.severity}/10`, 62, yPos);

  yPos += 15;

  // ============ KEY METRICS TABLE ============
  yPos += 5;
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.setTextColor(31, 41, 55);
  pdf.text('Analysis Metrics', 15, yPos);
  
  yPos += 2;

  const metricsData = [
    ['Metric', 'Value', 'Status'],
    ['Confidence Level', `${confidence}%`, confidence >= 80 ? 'High' : 'Moderate'],
    ['Disease Severity', `${result.severity}/10`, result.severity >= 7 ? 'Critical' : 'Manageable'],
    ['Affected Area', `${result.affectedArea}%`, result.affectedArea >= 50 ? 'Large' : 'Moderate'],
    ['Image Quality', `${result.metadata.imageQuality}%`, result.metadata.imageQuality >= 70 ? 'Good' : 'Fair'],
    ['Inference Time', `${result.metadata.inferenceTime}ms`, 'Fast'],
  ];

  autoTable(pdf, {
    startY: yPos,
    head: [metricsData[0]],
    body: metricsData.slice(1),
    theme: 'grid',
    headStyles: {
      fillColor: [22, 163, 74],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      textColor: [31, 41, 55],
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 60, halign: 'center' },
      2: { cellWidth: 60, halign: 'center', fontStyle: 'bold' },
    },
    margin: { left: 15, right: 15 },
  });

  yPos = (pdf as any).lastAutoTable.finalY + 10;

  // ============ RECOMMENDATIONS SECTION ============
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.setTextColor(31, 41, 55);
  pdf.text('Recommended Actions', 15, yPos);
  
  yPos += 7;

  // Recommendations with icons
  (result.recommendations || []).forEach((rec, index) => {
    if (yPos > pageHeight - 30) {
      pdf.addPage();
      yPos = 20;
    }

    // Bullet point circle
    pdf.setFillColor(22, 163, 74);
    pdf.circle(18, yPos - 1.5, 1.5, 'F');

    // Recommendation text
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(55, 65, 81);
    
    const lines = pdf.splitTextToSize(rec, pageWidth - 40);
    pdf.text(lines, 24, yPos);
    
    yPos += lines.length * 5 + 3;
  });

  // ============ PREVENTION TIPS BOX ============
  if (yPos > pageHeight - 50) {
    pdf.addPage();
    yPos = 20;
  }

  yPos += 5;

  pdf.setFillColor(254, 252, 232); // Light yellow background
  pdf.roundedRect(15, yPos, pageWidth - 30, 40, 3, 3, 'F');
  
  pdf.setDrawColor(245, 158, 11); // Warning orange border
  pdf.setLineWidth(0.5);
  pdf.roundedRect(15, yPos, pageWidth - 30, 40, 3, 3, 'S');

  yPos += 8;

  // Icon and Title
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(180, 83, 9);
  pdf.text('💡 Prevention Tips', 20, yPos);

  yPos += 7;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(120, 53, 15);
  
  const tips = [
    '• Regular monitoring: Check plants daily for early disease symptoms',
    '• Proper spacing: Ensure adequate air circulation between plants',
    '• Hygiene: Remove and dispose of infected plant material properly',
    '• Rotation: Practice crop rotation to prevent disease buildup',
  ];

  tips.forEach(tip => {
    const tipLines = pdf.splitTextToSize(tip, pageWidth - 40);
    pdf.text(tipLines, 20, yPos);
    yPos += tipLines.length * 4;
  });

  // ============ FOOTER ============
  const addFooter = (pageNum: number) => {
    const footerY = pageHeight - 15;
    
    // Footer background
    pdf.setFillColor(249, 250, 251);
    pdf.rect(0, footerY - 5, pageWidth, 20, 'F');
    
    // Footer line
    pdf.setDrawColor(229, 231, 235);
    pdf.setLineWidth(0.3);
    pdf.line(15, footerY - 5, pageWidth - 15, footerY - 5);

    // Footer text
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(107, 114, 128);
    
    pdf.text('© 2025 AgriSakhi - AI-Powered Plant Disease Detection', 15, footerY);
    pdf.text('For agricultural assistance, visit agrisakhi.com', 15, footerY + 4);
    
    // Page number
    pdf.text(`Page ${pageNum}`, pageWidth - 25, footerY);
    
    // Disclaimer
    pdf.setFontSize(7);
    pdf.setTextColor(156, 163, 175);
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

// Helper: Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}
