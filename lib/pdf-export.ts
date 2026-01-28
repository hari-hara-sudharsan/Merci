/**
 * PDF export utilities for reports
 * Note: This is a placeholder implementation. In production, you would use libraries like:
 * - jsPDF for client-side PDF generation
 * - Puppeteer for server-side PDF generation
 * - PDFKit for Node.js PDF generation
 */

export interface ReportData {
    title: string;
    type: string;
    summary: string;
    sections: {
        title: string;
        content: string;
        insights?: string[];
    }[];
    keyMetrics?: {
        label: string;
        value: string | number;
        change?: number;
        trend?: "up" | "down" | "stable";
    }[];
    recommendations: {
        priority: "high" | "medium" | "low";
        title: string;
        description: string;
        actionItems?: string[];
    }[];
    createdAt: Date;
    businessName: string;
}

/**
 * Generate PDF from report data (client-side)
 * @param report - Report data
 * @returns Blob containing PDF
 */
export async function generatePDF(report: ReportData): Promise<Blob> {
    // This is a placeholder implementation
    // In production, you would use jsPDF or similar library

    const htmlContent = generateHTMLForPDF(report);

    // Convert HTML to PDF using browser's print functionality
    // This is a simple approach - for production, use a proper PDF library
    const blob = new Blob([htmlContent], { type: "text/html" });

    return blob;
}

/**
 * Generate HTML content for PDF
 * @param report - Report data
 * @returns HTML string
 */
function generateHTMLForPDF(report: ReportData): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${report.title}</title>
  <style>
    @page {
      margin: 2cm;
      size: A4;
    }
    
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #3E4A8A;
    }
    
    .header h1 {
      color: #3E4A8A;
      margin-bottom: 10px;
    }
    
    .header .meta {
      color: #666;
      font-size: 14px;
    }
    
    .summary {
      background: #f8f9fa;
      padding: 20px;
      border-left: 4px solid #3E4A8A;
      margin-bottom: 30px;
    }
    
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    
    .section h2 {
      color: #3E4A8A;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    
    .insights {
      background: #eff6ff;
      padding: 15px;
      border-radius: 8px;
      margin-top: 15px;
    }
    
    .insights h3 {
      color: #3E4A8A;
      font-size: 16px;
      margin-bottom: 10px;
    }
    
    .insights ul {
      margin: 0;
      padding-left: 20px;
    }
    
    .insights li {
      margin-bottom: 8px;
    }
    
    .metrics {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }
    
    .metric-card {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #3E4A8A;
    }
    
    .metric-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    
    .metric-value {
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }
    
    .recommendations {
      margin-top: 40px;
    }
    
    .recommendation {
      margin-bottom: 20px;
      padding: 15px;
      border-radius: 8px;
      page-break-inside: avoid;
    }
    
    .recommendation.high {
      background: #fee2e2;
      border-left: 4px solid #ef4444;
    }
    
    .recommendation.medium {
      background: #ffedd5;
      border-left: 4px solid #f59e0b;
    }
    
    .recommendation.low {
      background: #d1fae5;
      border-left: 4px solid #10b981;
    }
    
    .recommendation h3 {
      margin-top: 0;
      margin-bottom: 10px;
    }
    
    .recommendation .priority {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    
    .priority.high {
      background: #ef4444;
      color: white;
    }
    
    .priority.medium {
      background: #f59e0b;
      color: white;
    }
    
    .priority.low {
      background: #10b981;
      color: white;
    }
    
    .action-items {
      margin-top: 10px;
    }
    
    .action-items h4 {
      font-size: 14px;
      margin-bottom: 8px;
    }
    
    .action-items ul {
      margin: 0;
      padding-left: 20px;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${report.title}</h1>
    <div class="meta">
      <p>${report.businessName}</p>
      <p>Generated on ${new Date(report.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}</p>
    </div>
  </div>
  
  <div class="summary">
    <h2>Executive Summary</h2>
    <p>${report.summary}</p>
  </div>
  
  ${report.keyMetrics && report.keyMetrics.length > 0 ? `
    <div class="metrics">
      ${report.keyMetrics.map(metric => `
        <div class="metric-card">
          <div class="metric-label">${metric.label}</div>
          <div class="metric-value">${metric.value}</div>
          ${metric.change ? `<div style="color: ${metric.trend === 'up' ? '#10b981' : '#ef4444'}; font-size: 14px;">
            ${metric.trend === 'up' ? '↑' : '↓'} ${Math.abs(metric.change)}%
          </div>` : ''}
        </div>
      `).join('')}
    </div>
  ` : ''}
  
  ${report.sections.map(section => `
    <div class="section">
      <h2>${section.title}</h2>
      <div>${section.content.replace(/\n/g, '<br>')}</div>
      
      ${section.insights && section.insights.length > 0 ? `
        <div class="insights">
          <h3>💡 Key Insights</h3>
          <ul>
            ${section.insights.map(insight => `<li>${insight}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `).join('')}
  
  <div class="recommendations">
    <h2>Strategic Recommendations</h2>
    ${report.recommendations.map(rec => `
      <div class="recommendation ${rec.priority}">
        <span class="priority ${rec.priority}">${rec.priority} Priority</span>
        <h3>${rec.title}</h3>
        <p>${rec.description}</p>
        
        ${rec.actionItems && rec.actionItems.length > 0 ? `
          <div class="action-items">
            <h4>Action Items:</h4>
            <ul>
              ${rec.actionItems.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `).join('')}
  </div>
  
  <div class="footer">
    <p>This report was generated by Merci - AI-Powered Business Intelligence Platform</p>
    <p>© ${new Date().getFullYear()} All rights reserved</p>
  </div>
</body>
</html>
  `;
}

/**
 * Download PDF file
 * @param blob - PDF blob
 * @param filename - File name
 */
export function downloadPDF(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Export report as PDF
 * @param report - Report data
 */
export async function exportReportAsPDF(report: ReportData) {
    const blob = await generatePDF(report);
    const filename = `${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    downloadPDF(blob, filename);
}

/**
 * Print report (opens browser print dialog)
 * @param report - Report data
 */
export function printReport(report: ReportData) {
    const htmlContent = generateHTMLForPDF(report);
    const printWindow = window.open('', '_blank');

    if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();

        // Wait for content to load before printing
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }
}
